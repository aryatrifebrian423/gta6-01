// WebAudio builds an original ambient bed and short cues from local oscillators.
// Context creation waits for a user gesture so autoplay policy never blocks play.
const NOTE_FREQUENCIES = {
  low: [55, 65.41, 73.42, 82.41],
  chord: [110, 130.81, 146.83, 164.81],
  shimmer: [220, 246.94, 293.66, 329.63]
};

const CUES = {
  click: { frequency: 660, duration: 0.06, type: 'sine', gain: 0.035 },
  shot: { frequency: 92, duration: 0.11, type: 'sawtooth', gain: 0.1 },
  crime: { frequency: 185, duration: 0.18, type: 'triangle', gain: 0.07 },
  mission: { frequency: 523.25, duration: 0.24, type: 'sine', gain: 0.08 },
  engine: { frequency: 110, duration: 0.16, type: 'square', gain: 0.045 },
  coin: { frequency: 880, duration: 0.2, type: 'sine', gain: 0.08 },
  radio: { frequency: 392, duration: 0.12, type: 'triangle', gain: 0.045 },
  damage: { frequency: 72, duration: 0.3, type: 'sawtooth', gain: 0.08 }
};

export class BayAudio {
  constructor() {
    this.context = null;
    this.master = null;
    this.ambient = null;
    this.station = 0;
    this.started = false;
    this.muted = false;
    this.nextNoteAt = 0;
    this.noteIndex = 0;
  }

  start() {
    if (this.started) {
      if (this.context?.state === 'suspended') this.context.resume();
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    this.context = new AudioContextClass();
    this.master = this.context.createGain();
    this.master.gain.value = 0.18;
    this.master.connect(this.context.destination);
    this.ambient = this.context.createGain();
    this.ambient.gain.value = 0.08;
    this.ambient.connect(this.master);
    this.started = true;
    this.startDrone();
  }

  startDrone() {
    if (!this.context || !this.ambient) return;
    const now = this.context.currentTime;
    const base = [55, 65.41, 73.42][this.station];
    [base, base * 1.5, base * 2].forEach((frequency, index) => {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = index === 0 ? 'sine' : 'triangle';
      oscillator.frequency.value = frequency;
      gain.gain.value = index === 0 ? 0.3 : 0.08 / index;
      oscillator.connect(gain);
      gain.connect(this.ambient);
      oscillator.start(now);
      if (index === 0) this.droneOscillator = oscillator;
      if (index === 0) this.droneGain = gain;
    });
  }

  blip(name = 'click') {
    const cue = CUES[name] || CUES.click;
    if (!this.context) this.start();
    if (!this.context || this.muted) return;
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = cue.type;
    oscillator.frequency.setValueAtTime(cue.frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, cue.frequency * 0.72), now + cue.duration);
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(cue.gain, now + 0.012);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + cue.duration);
    oscillator.connect(envelope);
    envelope.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + cue.duration + 0.015);
  }

  switchStation(index) {
    this.station = ((index % 3) + 3) % 3;
    if (!this.context || !this.droneOscillator) return;
    const base = NOTE_FREQUENCIES.low[this.station];
    const now = this.context.currentTime;
    this.droneOscillator.frequency.cancelScheduledValues(now);
    this.droneOscillator.frequency.setTargetAtTime(base, now, 0.45);
    this.blip('radio');
  }

  setMuted(value) {
    this.muted = Boolean(value);
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(this.muted ? 0 : 0.18, this.context.currentTime, 0.08);
    }
  }

  setPaused(value) {
    if (!this.ambient || !this.context) return;
    this.ambient.gain.setTargetAtTime(value ? 0.025 : 0.08, this.context.currentTime, 0.24);
  }

  update(elapsed) {
    if (!this.context || !this.ambient || elapsed < this.nextNoteAt) return;
    this.nextNoteAt = elapsed + 3.8;
    this.noteIndex = (this.noteIndex + 1) % NOTE_FREQUENCIES.shimmer.length;
    const now = this.context.currentTime;
    const note = this.context.createOscillator();
    const envelope = this.context.createGain();
    note.type = 'sine';
    note.frequency.value = NOTE_FREQUENCIES.shimmer[(this.noteIndex + this.station) % NOTE_FREQUENCIES.shimmer.length];
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(this.muted ? 0.0001 : 0.018, now + 0.8);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
    note.connect(envelope);
    envelope.connect(this.ambient);
    note.start(now);
    note.stop(now + 3.55);
  }
}

// The synth is a restrained tone bed; no outside audio, assets or font files load.
