import { Injectable } from '@nestjs/common';

export interface HeadToHeadStats {
  modelA: string;
  modelB: string;
  matchesPlayed: number;
  modelAWins: number;
  modelBWins: number;
  ties: number;
  winRateA: number;
}

@Injectable()
export class EloTelemetryService {
  /**
   * Computes head-to-head win rates and match breakdown between model pairs.
   */
  computeHeadToHead(
    modelA: string,
    modelB: string,
    outcomes: Array<'A' | 'B' | 'TIE'>,
  ): HeadToHeadStats {
    const total = outcomes.length;
    if (total === 0) {
      return {
        modelA,
        modelB,
        matchesPlayed: 0,
        modelAWins: 0,
        modelBWins: 0,
        ties: 0,
        winRateA: 0.5,
      };
    }

    const modelAWins = outcomes.filter((o) => o === 'A').length;
    const modelBWins = outcomes.filter((o) => o === 'B').length;
    const ties = outcomes.filter((o) => o === 'TIE').length;

    // Standard scoring: 1 pt for win, 0.5 for tie
    const pointsA = modelAWins + ties * 0.5;
    const winRateA = Number((pointsA / total).toFixed(4));

    return {
      modelA,
      modelB,
      matchesPlayed: total,
      modelAWins,
      modelBWins,
      ties,
      winRateA,
    };
  }
}
