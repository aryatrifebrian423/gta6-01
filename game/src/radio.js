import { RADIO_SHOWS } from './data/radioShows.js';

// The R key cycles three original shows; every station owns its DJ, track list
// and scripted on-air lines in the data module.
export class BayRadio {
  constructor(audio) {
    this.audio = audio;
    this.index = 0;
    this.track = 0;
    this.lastLine = 0;
    this.startedAt = 0;
    this.lineIndex = 0;
    this.bulletinIndex = 0;
    this.trackStarted = 0;
    this.onAir = '';
  }

  next() {
    this.index = (this.index + 1) % RADIO_SHOWS.length;
    this.track = 0;
    this.lineIndex = 0;
    this.onAir = this.show.lines[0];
    this.audio.switchStation(this.index);
    return this.readout;
  }

  previous() {
    this.index = (this.index + RADIO_SHOWS.length - 1) % RADIO_SHOWS.length;
    this.track = 0;
    this.audio.switchStation(this.index);
    return this.readout;
  }

  update(elapsed) {
    const show = this.show;
    if (elapsed - this.lastLine > 34) {
      this.lastLine = elapsed;
      this.lineIndex = (this.lineIndex + 1) % show.lines.length;
      this.bulletinIndex = (this.bulletinIndex + 1) % show.bulletins.length;
      this.onAir = this.lineIndex % 2 ? show.lines[this.lineIndex] : show.bulletins[this.bulletinIndex];
      return this.onAir;
    }
    if (elapsed - this.trackStarted > 82) {
      this.track = (this.track + 1) % show.tracks.length;
      this.trackStarted = elapsed;
    }
    return '';
  }

  get show() {
    return RADIO_SHOWS[this.index];
  }

  get readout() {
    return `${this.show.name.toUpperCase()} ${this.show.frequency} · ${this.show.dj.toUpperCase()} · ${this.show.tracks[this.track].toUpperCase()}`;
  }

  get detail() {
    return `${this.show.frequency} FM · ${this.show.format} · ${this.show.dj}`;
  }

  get announcement() {
    return this.onAir || this.show.signoff;
  }
}

// Radio remains available in the car and on foot as part of the city's ambient sound.
