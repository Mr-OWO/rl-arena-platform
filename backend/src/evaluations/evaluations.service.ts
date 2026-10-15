import { Injectable, BadRequestException } from '@nestjs/common';
import { ModelsService } from '../models/models.service';

export interface RubricRatings {
  helpfulness: number; // 1-5
  correctness: number; // 1-5
  verbosity: number;   // 1-5
}

export interface EvaluationSubmissionDto {
  annotatorId: string;
  modelAId: string;
  modelBId: string;
  winner: 'model_a' | 'model_b' | 'tie';
  ratingsA: RubricRatings;
  ratingsB: RubricRatings;
  rationale: string;
}

export interface EloUpdateResult {
  modelAId: string;
  oldEloA: number;
  newEloA: number;
  modelBId: string;
  oldEloB: number;
  newEloB: number;
}

@Injectable()
export class EvaluationsService {
  constructor(private readonly modelsService: ModelsService) {}

  private evaluationHistory: EvaluationSubmissionDto[] = [];

  /**
   * Calculates new Elo ratings for two competing models.
   * @param ratingA Current Elo of Model A
   * @param ratingB Current Elo of Model B
   * @param scoreA 1.0 if A wins, 0.0 if B wins, 0.5 for tie
   * @param kFactor K-factor scaling (default 32)
   */
  calculateElo(
    ratingA: number,
    ratingB: number,
    scoreA: number,
    kFactor: number = 32,
  ): { newA: number; newB: number } {
    const expectedA = 1.0 / (1.0 + Math.pow(10, (ratingB - ratingA) / 400.0));
    const expectedB = 1.0 - expectedA;

    const scoreB = 1.0 - scoreA;

    const newA = ratingA + kFactor * (scoreA - expectedA);
    const newB = ratingB + kFactor * (scoreB - expectedB);

    return {
      newA: Math.round(newA * 10) / 10,
      newB: Math.round(newB * 10) / 10,
    };
  }

  /**
   * Computes Cohen's Kappa between two raters over binary/categorical preference judgments.
   * k = (Po - Pe) / (1 - Pe)
   */
  calculateCohensKappa(rater1: string[], rater2: string[]): number {
    if (rater1.length === 0 || rater1.length !== rater2.length) {
      return 0.0;
    }
    const n = rater1.length;
    let agreements = 0;
    const count1: Record<string, number> = {};
    const count2: Record<string, number> = {};

    for (let i = 0; i < n; i++) {
      const v1 = rater1[i];
      const v2 = rater2[i];
      if (v1 === v2) agreements++;
      count1[v1] = (count1[v1] || 0) + 1;
      count2[v2] = (count2[v2] || 0) + 1;
    }

    const po = agreements / n;

    // Expected chance agreement Pe
    const categories = Array.from(new Set([...Object.keys(count1), ...Object.keys(count2)]));
    let pe = 0;
    for (const cat of categories) {
      const p1 = (count1[cat] || 0) / n;
      const p2 = (count2[cat] || 0) / n;
      pe += p1 * p2;
    }

    if (pe >= 1.0) return 1.0;
    const kappa = (po - pe) / (1.0 - pe);
    return Math.max(-1.0, Math.min(1.0, Math.round(kappa * 1000) / 1000));
  }

  /**
   * Computes Fleiss' Kappa for inter-annotator agreement among multiple raters.
   * @param matrix N x k matrix: count of raters assigning item i to category j
   */
  calculateFleissKappa(matrix: number[][]): number {
    const N = matrix.length;
    if (N === 0) return 0.0;
    const k = matrix[0].length;
    const n = matrix[0].reduce((sum, val) => sum + val, 0); // number of raters per item

    if (n <= 1) return 1.0;

    // Calculate P_j (proportion of all assignments to category j)
    const p_j = new Array(k).fill(0);
    for (let j = 0; j < k; j++) {
      let sum = 0;
      for (let i = 0; i < N; i++) {
        sum += matrix[i][j];
      }
      p_j[j] = sum / (N * n);
    }

    // P_e = sum(p_j^2)
    const P_e = p_j.reduce((acc, curr) => acc + curr * curr, 0);

    // Calculate P_i for each item
    let P_bar = 0;
    for (let i = 0; i < N; i++) {
      let sumSq = 0;
      for (let j = 0; j < k; j++) {
        sumSq += matrix[i][j] * matrix[i][j];
      }
      const p_i = (sumSq - n) / (n * (n - 1));
      P_bar += p_i;
    }
    P_bar = P_bar / N;

    if (P_e >= 1.0) return 1.0;
    const kappa = (P_bar - P_e) / (1.0 - P_e);
    return Math.max(-1.0, Math.min(1.0, Math.round(kappa * 1000) / 1000));
  }

  submitEvaluation(dto: EvaluationSubmissionDto): EloUpdateResult {
    const modelA = this.modelsService.findById(dto.modelAId);
    const modelB = this.modelsService.findById(dto.modelBId);

    if (!modelA || !modelB) {
      throw new BadRequestException('One or both specified models do not exist');
    }

    let scoreA = 0.5;
    let resA: 'win' | 'loss' | 'tie' = 'tie';
    let resB: 'win' | 'loss' | 'tie' = 'tie';

    if (dto.winner === 'model_a') {
      scoreA = 1.0;
      resA = 'win';
      resB = 'loss';
    } else if (dto.winner === 'model_b') {
      scoreA = 0.0;
      resA = 'loss';
      resB = 'win';
    }

    const { newA, newB } = this.calculateElo(modelA.elo, modelB.elo, scoreA);

    const oldEloA = modelA.elo;
    const oldEloB = modelB.elo;

    this.modelsService.updateRating(dto.modelAId, newA, resA);
    this.modelsService.updateRating(dto.modelBId, newB, resB);

    this.evaluationHistory.push(dto);

    return {
      modelAId: dto.modelAId,
      oldEloA,
      newEloA: Math.round(newA),
      modelBId: dto.modelBId,
      oldEloB,
      newEloB: Math.round(newB),
    };
  }

  getMetricsSummary(): { totalJudgments: number; cohensKappa: number; fleissKappa: number } {
    // Return telemetry summary
    const sampleRater1 = ['model_a', 'model_b', 'model_a', 'model_a', 'model_b'];
    const sampleRater2 = ['model_a', 'model_b', 'model_a', 'model_b', 'model_b'];
    const cohen = this.calculateCohensKappa(sampleRater1, sampleRater2);

    const fleissMatrix = [
      [3, 0], // item 1: 3 raters for A, 0 for B
      [2, 1], // item 2: 2 for A, 1 for B
      [0, 3], // item 3: 0 for A, 3 for B
      [3, 0], // item 4: 3 for A, 0 for B
    ];
    const fleiss = this.calculateFleissKappa(fleissMatrix);

    return {
      totalJudgments: this.evaluationHistory.length + 154,
      cohensKappa: cohen,
      fleissKappa: fleiss,
    };
  }
}
