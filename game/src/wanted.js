// Each tier names a distinct public response and sets patrol count and decay time.
export const WANTED_TIERS = [
  { stars: 0, name: 'Clear', description: 'Radio quiet.', decay: 0, units: 0 },
  { stars: 1, name: 'Harbor Patrol', description: 'A harbor unit checks nearby avenues.', decay: 17, units: 1 },
  { stars: 2, name: 'Street Units', description: 'Two cars coordinate through marina blocks.', decay: 17, units: 2 },
  { stars: 3, name: 'Citywide Search', description: 'A wider net follows across town.', decay: 17, units: 2 },
  { stars: 4, name: 'Roadblocks', description: 'Units hold main avenues and call ahead.', decay: 19, units: 3 },
  { stars: 5, name: 'Sunward Lockdown', description: 'The whole harbor is listening.', decay: 22, units: 3 }
];

const MINIMUM_FINE = 75;
const FINE_PER_STAR = 125;

export class WantedSystem {
  constructor() {
    this.level = 0;
    this.lastCrime = -999;
    this.crimeCount = 0;
    this.lastDecay = null;
  }

  crime(now, amount = 1) {
    this.level = Math.min(5, this.level + Math.max(1, amount));
    this.lastCrime = now;
    this.crimeCount += 1;
    this.lastDecay = null;
    return this.tier;
  }

  update(now) {
    if (!this.level || now - this.lastCrime <= this.tier.decay) return false;
    const oldTier = this.tier;
    this.level -= 1;
    this.lastCrime = now;
    this.lastDecay = { from: oldTier.name, to: this.tier.name, time: now };
    return true;
  }

  bust(cash) {
    const fine = Math.min(cash, Math.max(MINIMUM_FINE, this.level * FINE_PER_STAR));
    const formerTier = this.tier;
    this.level = 0;
    this.lastCrime = -999;
    this.lastDecay = null;
    return {
      cash: Math.max(0, cash - fine),
      fine,
      health: 100,
      formerTier: formerTier.name,
      location: 'Sunward Clinic',
      message: `Processed at the clinic after ${formerTier.name}.`
    };
  }

  shouldBeBusted(nearbyUnits) {
    return this.level > 0 && nearbyUnits >= 3;
  }

  get tier() {
    return WANTED_TIERS[this.level];
  }

  stars() {
    return '★'.repeat(this.level) + '☆'.repeat(5 - this.level);
  }

  get statusLine() {
    return `${this.tier.name.toUpperCase()} · ${this.tier.description}`;
  }

  heatSummary(now) {
    const quietFor = Math.max(0, now - this.lastCrime);
    const decayIn = this.level ? Math.max(0, Math.ceil(this.tier.decay - quietFor)) : 0;
    return {
      tier: this.tier.name,
      stars: this.stars(),
      units: this.tier.units,
      description: this.tier.description,
      decayIn
    };
  }
}

// A bust moves the player to the clinic, deducts a heat-based fine and clears pursuit.
