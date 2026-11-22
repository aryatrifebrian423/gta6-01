import { clamp, TUNING } from './config.js';

// Daylight, tide height and road grip share the simulation clock. That keeps the
// sky and driving response deterministic for play, screenshots and saved replays.
const DAY_LENGTH = 24;
const DAWN_HOUR = 5.3;
const SUNSET_HOUR = 18.2;

const daylightAt = (hour) => {
  const phase = ((hour - 6) / 12) * Math.PI;
  return clamp(Math.sin(phase), 0.16, 1);
};

const seaTintAt = (hour) => {
  if (hour < 6 || hour > 20) return { hue: 0.58, saturation: 0.34, base: 0.12 };
  if (hour > 16.4 && hour < 19.8) return { hue: 0.04, saturation: 0.43, base: 0.2 };
  return { hue: 0.54, saturation: 0.3, base: 0.17 };
};

export class BayWeather {
  constructor(city, scene) {
    this.city = city;
    this.scene = scene;
    this.day = 7.7;
    this.tide = 0;
    this.grip = 1;
    this.glare = 0;
    this.light = 0.6;
    this.phaseName = 'morning';
    this.wind = 0.35;
    this.lastNote = '';
  }

  update(dt, elapsed) {
    // A full twenty-four hour cycle takes just under nine minutes of play.
    this.day = (this.day + dt * 0.045) % DAY_LENGTH;
    this.light = daylightAt(this.day);
    this.phaseName = this.describePhase();
    this.glare = clamp(1 - Math.abs(this.day - SUNSET_HOUR) / 1.7, 0, 1);
    this.tide = (Math.sin(elapsed * 0.025) + 1) / 2;
    this.grip = this.tide > 0.78 ? TUNING.driving.wetGrip : 1;
    this.wind = 0.25 + Math.sin(elapsed * 0.08) * 0.14;

    this.paintSky();
    this.moveWater();
    return this.note;
  }

  paintSky() {
    const tint = seaTintAt(this.day);
    const color = new THREE.Color().setHSL(
      tint.hue,
      tint.saturation,
      tint.base + this.light * 0.22
    );
    this.scene.background.copy(color);
    this.scene.fog.color.copy(color);
    this.scene.fog.near = 30;
    this.scene.fog.far = 105 - this.glare * 7;

    const sun = this.scene.userData.sun;
    if (!sun) return;
    const angle = (this.day / DAY_LENGTH) * Math.PI * 2 - Math.PI / 2;
    sun.intensity = 0.35 + this.light * 1.5;
    sun.color.setHSL(0.1 + this.glare * 0.025, 0.64, 0.55 + this.glare * 0.08);
    sun.position.set(Math.cos(angle) * 55, 14 + this.light * 30, Math.sin(angle) * 45);
  }

  moveWater() {
    // The water remains a visible landmark while the tide shifts its shoreline edge.
    if (this.city.water) this.city.water.position.y = -0.1 + this.tide * 0.24;
  }

  describePhase() {
    if (this.day < DAWN_HOUR) return 'night';
    if (this.day < 10) return 'morning';
    if (this.day < 15.7) return 'afternoon';
    if (this.day < 20.2) return 'sunset';
    return 'night';
  }

  get clock() {
    const hour = Math.floor(this.day);
    const minute = Math.floor((this.day - hour) * 60);
    return `${String(hour % 12 || 12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${hour < 12 ? 'AM' : 'PM'}`;
  }

  get note() {
    if (this.tide > 0.78) return 'HIGH TIDE · ROAD GRIP SOFT';
    if (this.glare > 0.45) return 'SUN GLARE · WATCH WEST';
    if (this.phaseName === 'night') return 'NIGHT AIR · HARBOR LIGHTS';
    return 'SEA BREEZE · DRY ASPHALT';
  }

  get roadCondition() {
    return {
      grip: this.grip,
      label: this.tide > 0.78 ? 'wet edge' : 'dry road',
      steerAssist: this.tide > 0.78 ? 0.9 : 1,
      glare: this.glare,
      description: this.note
    };
  }
}

// The HUD reads clock and note, while driving samples grip on every acceleration.
