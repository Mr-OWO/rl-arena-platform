import { EloTelemetryService } from './elo-telemetry.service';

describe('EloTelemetryService', () => {
  let service: EloTelemetryService;

  beforeEach(() => {
    service = new EloTelemetryService();
  });

  it('should compute head to head win rates accurately', () => {
    const stats = service.computeHeadToHead('model-alpha', 'model-beta', [
      'A',
      'A',
      'B',
      'TIE',
    ]);
    expect(stats.matchesPlayed).toBe(4);
    expect(stats.modelAWins).toBe(2);
    expect(stats.modelBWins).toBe(1);
    expect(stats.ties).toBe(1);
    // (2 + 0.5) / 4 = 0.625
    expect(stats.winRateA).toBe(0.625);
  });

  it('should handle zero matches gracefully', () => {
    const stats = service.computeHeadToHead('model-alpha', 'model-beta', []);
    expect(stats.matchesPlayed).toBe(0);
    expect(stats.winRateA).toBe(0.5);
  });
});
