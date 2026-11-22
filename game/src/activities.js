// Taxi work, a three-gate circuit, photo jobs and hidden palm coins give the
// player something to discover between the ten main chapters.
export const FARES = [
  {
    name: 'Nia Bell',
    pickup: { x: 1, z: 0 },
    destination: { x: -28, z: 8 },
    fare: 90,
    line: 'The old quarter awnings, please; I have cake in my lap.',
    note: 'Nia is carrying a lemon cake for her aunt’s repair shop.'
  },
  {
    name: 'Tomas Reed',
    pickup: { x: 27, z: 31 },
    destination: { x: -8, z: -18 },
    fare: 120,
    line: 'Civic Sun, if the fountain is still running.',
    note: 'Tomas has a ferry timetable folded into his jacket pocket.'
  },
  {
    name: 'Mina Solis',
    pickup: { x: -28, z: 8 },
    destination: { x: 25, z: 36 },
    fare: 110,
    line: 'The pier lights are better than the bus stop.',
    note: 'Mina is meeting her sister before the evening set begins.'
  },
  {
    name: 'Owen Pike',
    pickup: { x: 0, z: -4 },
    destination: { x: 34, z: 8 },
    fare: 105,
    line: 'Glass Harbor. My brother is closing the shop.',
    note: 'Owen has a toolbox and knows the loading lane shortcuts.'
  },
  {
    name: 'Leah Cruz',
    pickup: { x: -20, z: -20 },
    destination: { x: 8, z: 34 },
    fare: 135,
    line: 'Marina Row, please. I can hear the first ferry from here.',
    note: 'Leah has just finished a night shift in Palmetto Heights.'
  },
  {
    name: 'Arlo Finch',
    pickup: { x: 34, z: 8 },
    destination: { x: -30, z: 8 },
    fare: 145,
    line: 'Old Quarter. I promised to return this wrench before lunch.',
    note: 'Arlo repairs the warehouse doors and keeps his own hours.'
  },
  {
    name: 'Sami Noor',
    pickup: { x: 25, z: 36 },
    destination: { x: 0, z: 0 },
    fare: 100,
    line: 'Civic Sun square. I need to catch a friend by the fountain.',
    note: 'Sami is bringing a record sleeve to a friend across town.'
  },
  {
    name: 'Pia Lane',
    pickup: { x: 8, z: 34 },
    destination: { x: -20, z: -20 },
    fare: 125,
    line: 'Up to Palmetto Heights. I want to see the whole bay once.',
    note: 'Pia is visiting the overlook before her last day in town.'
  }
];

export const RACE = {
  name: 'Boulevard Three',
  rivals: ['Dante Rook', 'Tess Alvarez', 'Bo Mercer'],
  introduction: 'Three checkpoints make a loop from the palms to the harbor and back.',
  rules: [
    'Start in a car and talk to Dante near the boulevard.',
    'Cross each gold gate in order; cutting the route does not count.',
    'The finish is the Marina Arch. The cleanest line is usually the quickest.'
  ],
  gates: [
    { x: -10, z: -29, label: 'PALMS GATE', district: 'Palmetto Heights' },
    { x: 30, z: -10, label: 'GLASS GATE', district: 'Glass Harbor' },
    { x: 10, z: 30, label: 'MARINA ARCH', district: 'Marina Row' }
  ]
};

const COIN_HINTS = [
  'follow the sea wall north until the paving changes color',
  'look behind the coral awning at the repair lane',
  'check under the shade of the two plaza palms',
  'walk to the end of the north slip beside the blue skiff',
  'search near the old clock on the Civic Sun square',
  'look along the fish market wall where carts turn around',
  'the west side of the glass warehouse catches late light',
  'one palm coin sits above the first stair on the overlook',
  'walk beneath the boardwalk where the tide leaves a dry patch',
  'check the quiet corner behind the ferry ticket window',
  'look for a gold glint beside the causeway marker',
  'the last coin is near the fountain’s east bench'
];

export const COINS = Array.from({ length: 12 }, (_, id) => {
  const angle = id * Math.PI / 6;
  const radiusX = id % 2 ? 34 : 27;
  const radiusZ = id % 3 ? 30 : 24;
  return {
    id,
    x: Math.round(Math.cos(angle) * radiusX),
    z: Math.round(Math.sin(angle) * radiusZ),
    hint: COIN_HINTS[id],
    value: 25,
    name: `Palm coin ${String(id + 1).padStart(2, '0')}`
  };
});

export const PHOTO_STOPS = [
  { label: 'CIVIC FOUNTAIN', x: 0, z: 0, hint: 'frame the compass from the eastern walk' },
  { label: 'MARINA SLIPS', x: 0, z: 31, hint: 'catch the boats beyond the string lights' },
  { label: 'LUNA PIER', x: 31, z: 38, hint: 'wait for the ferry lamps behind the boards' },
  { label: 'GLASS WAREHOUSE', x: 30, z: 8, hint: 'stand where the blue windows mirror the water' }
];

export class ActivityBook {
  constructor(saved = {}) {
    this.fares = Math.max(0, saved.fares | 0);
    this.coins = new Set(Array.isArray(saved.coins) ? saved.coins : []);
    this.fareIndex = Math.max(0, saved.fareIndex | 0);
    this.raceGate = 0;
    this.photos = new Set();
    this.bestRaceSeconds = null;
    this.currentRaceSeconds = 0;
  }

  collectCoin(id) {
    if (this.coins.has(id)) return false;
    this.coins.add(id);
    return true;
  }

  nextFare() {
    return FARES[this.fareIndex % FARES.length];
  }

  finishFare() {
    this.fares += 1;
    this.fareIndex += 1;
    return this.fares;
  }

  beginRace() {
    this.raceGate = 0;
    this.currentRaceSeconds = 0;
  }

  advanceRace(dt) {
    if (this.raceGate >= RACE.gates.length) return { complete: true, gate: null };
    this.currentRaceSeconds += dt;
    return { complete: false, gate: RACE.gates[this.raceGate] };
  }

  crossRaceGate() {
    this.raceGate += 1;
    if (this.raceGate < RACE.gates.length) return { complete: false, next: RACE.gates[this.raceGate] };
    const seconds = this.currentRaceSeconds;
    this.bestRaceSeconds = this.bestRaceSeconds === null ? seconds : Math.min(seconds, this.bestRaceSeconds);
    return { complete: true, seconds, best: this.bestRaceSeconds };
  }

  progressLine(missionIndex) {
    return `MISSIONS ${Math.min(missionIndex, 10)}/10 · FARES ${this.fares} · COINS ${this.coins.size}/12`;
  }

  summary(cash, wantedStars) {
    return `${this.progressLine(0)} · $${cash.toLocaleString('en-US')} · WANTED ${wantedStars}`;
  }

  get coinCompletion() {
    return `${this.coins.size}/${COINS.length}`;
  }

  get photoCompletion() {
    return `${this.photos.size}/${PHOTO_STOPS.length}`;
  }
}

// Set-backed collections make repeated frame checks safe for fares, photos and coins.
