import { Injectable } from '@nestjs/common';

export interface ModelEntity {
  id: string;
  name: string;
  version: string;
  elo: number;
  matches: number;
  wins: number;
  losses: number;
  ties: number;
}

@Injectable()
export class ModelsService {
  private models: Map<string, ModelEntity> = new Map([
    [
      'model-alpha',
      {
        id: 'model-alpha',
        name: 'OmniReason-70B',
        version: 'v2.1',
        elo: 1240,
        matches: 84,
        wins: 54,
        losses: 25,
        ties: 5,
      },
    ],
    [
      'model-beta',
      {
        id: 'model-beta',
        name: 'NexusInstruct-33B',
        version: 'v1.4',
        elo: 1185,
        matches: 78,
        wins: 38,
        losses: 36,
        ties: 4,
      },
    ],
    [
      'model-gamma',
      {
        id: 'model-gamma',
        name: 'AetherCode-14B',
        version: 'v3.0',
        elo: 1215,
        matches: 65,
        wins: 41,
        losses: 21,
        ties: 3,
      },
    ],
  ]);

  findAll(): ModelEntity[] {
    return Array.from(this.models.values()).sort((a, b) => b.elo - a.elo);
  }

  findById(id: string): ModelEntity | undefined {
    return this.models.get(id);
  }

  updateRating(id: string, newElo: number, result: 'win' | 'loss' | 'tie'): void {
    const m = this.models.get(id);
    if (!m) return;
    m.elo = Math.round(newElo);
    m.matches += 1;
    if (result === 'win') m.wins += 1;
    else if (result === 'loss') m.losses += 1;
    else m.ties += 1;
  }
}
