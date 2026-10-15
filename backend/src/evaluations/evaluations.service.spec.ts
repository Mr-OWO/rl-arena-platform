import { EvaluationsService } from './evaluations.service';
import { ModelsService } from '../models/models.service';

describe('EvaluationsService', () => {
  let service: EvaluationsService;
  let modelsService: ModelsService;

  beforeEach(() => {
    modelsService = new ModelsService();
    service = new EvaluationsService(modelsService);
  });

  describe('calculateElo', () => {
    it('should correctly update Elo when equal rated models play and A wins', () => {
      const { newA, newB } = service.calculateElo(1200, 1200, 1.0, 32);
      expect(newA).toBe(1216);
      expect(newB).toBe(1184);
    });

    it('should retain ratings on tie between equally rated models', () => {
      const { newA, newB } = service.calculateElo(1200, 1200, 0.5, 32);
      expect(newA).toBe(1200);
      expect(newB).toBe(1200);
    });

    it('should reward underdog more when lower rated model wins', () => {
      const { newA, newB } = service.calculateElo(1000, 1400, 1.0, 32);
      expect(newA).toBeGreaterThan(1028);
      expect(newB).toBeLessThan(1372);
    });
  });

  describe('Inter-Annotator Agreement (Kappa)', () => {
    it('should compute perfect Cohen Kappa when raters fully agree', () => {
      const r1 = ['A', 'B', 'A', 'B'];
      const r2 = ['A', 'B', 'A', 'B'];
      const kappa = service.calculateCohensKappa(r1, r2);
      expect(kappa).toBe(1.0);
    });

    it('should compute Fleiss Kappa for multi-rater evaluations', () => {
      const matrix = [
        [3, 0],
        [3, 0],
        [0, 3],
        [0, 3],
      ];
      const kappa = service.calculateFleissKappa(matrix);
      expect(kappa).toBe(1.0);
    });
  });

  describe('submitEvaluation', () => {
    it('should submit preference judgment and update model ratings', () => {
      const result = service.submitEvaluation({
        annotatorId: 'annotator_1',
        modelAId: 'model-alpha',
        modelBId: 'model-beta',
        winner: 'model_a',
        ratingsA: { helpfulness: 5, correctness: 5, verbosity: 3 },
        ratingsB: { helpfulness: 2, correctness: 2, verbosity: 4 },
        rationale: 'Model Alpha delivered syntactically sound code and zero sycophancy.',
      });

      expect(result.newEloA).toBeGreaterThan(result.oldEloA);
      expect(result.newEloB).toBeLessThan(result.oldEloB);
    });
  });
});
