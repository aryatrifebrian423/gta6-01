import { DISTRICTS } from './config.js';

// The circular map rotates the avenue grid to keep the player pointing north.
// It draws from live world positions so traffic and patrols stay in sync.
const SIZE = 380;
const CENTER = SIZE / 2;
const WORLD_SCALE = SIZE / 100;
const ROAD_MARKS = [-30, -10, 10, 30];

export class BayMinimap {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.lastTargetDistance = 0;
    this.currentDistrict = DISTRICTS[0].name;
  }

  draw(player, cars, police, target) {
    const context = this.context;
    context.clearRect(0, 0, SIZE, SIZE);
    this.clipCircle(context);
    this.paintWater(context);
    this.paintRoads(context);

    context.translate(CENTER, CENTER);
    context.rotate(-player.yaw);
    context.scale(WORLD_SCALE, WORLD_SCALE);
    context.translate(-player.x, -player.z);

    this.paintDistricts(context);
    if (target) this.paintObjective(context, target);
    this.paintTraffic(context, cars);
    this.paintPolice(context, police);
    this.paintPlayer(context, player);
    context.restore();

    this.paintFrame(context);
    this.paintReadout(context, player, target);
  }

  clipCircle(context) {
    context.save();
    context.beginPath();
    context.arc(CENTER, CENTER, 183, 0, Math.PI * 2);
    context.clip();
    context.fillStyle = '#173a42';
    context.fillRect(0, 0, SIZE, SIZE);
  }

  paintWater(context) {
    context.fillStyle = '#287983';
    context.fillRect(0, 42, SIZE, 68);
    context.strokeStyle = 'rgba(174,221,210,.3)';
    context.lineWidth = 1;
    for (let row = 0; row < 8; row += 1) {
      context.beginPath();
      context.moveTo(0, 45 + row * 8);
      context.lineTo(SIZE, 45 + row * 8);
      context.stroke();
    }
  }

  paintRoads(context) {
    context.fillStyle = '#68716a';
    for (const lane of ROAD_MARKS) {
      context.fillRect(0, CENTER + lane * WORLD_SCALE - 3.5 * WORLD_SCALE, SIZE, 7 * WORLD_SCALE);
      context.fillRect(CENTER + lane * WORLD_SCALE - 3.5 * WORLD_SCALE, 0, 7 * WORLD_SCALE, SIZE);
    }
    context.strokeStyle = 'rgba(244,223,183,.5)';
    context.lineWidth = 1;
    for (let offset = -45; offset <= 45; offset += 8) {
      context.beginPath();
      context.moveTo(CENTER + offset * WORLD_SCALE, 0);
      context.lineTo(CENTER + offset * WORLD_SCALE, SIZE);
      context.stroke();
    }
  }

  paintDistricts(context) {
    context.fillStyle = 'rgba(239,224,190,.66)';
    context.font = '1.35px sans-serif';
    for (const district of DISTRICTS) {
      context.fillText(district.name.toUpperCase(), district.x - 3, district.z - 3);
    }
  }

  paintObjective(context, target) {
    context.fillStyle = '#ffd17b';
    context.strokeStyle = 'rgba(255,209,123,.8)';
    context.lineWidth = 0.35;
    context.beginPath();
    context.arc(target.x, target.z, 2.4, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.arc(target.x, target.z, 4.2, 0, Math.PI * 2);
    context.stroke();
  }

  paintTraffic(context, cars) {
    context.fillStyle = '#dfb984';
    for (const traffic of cars) {
      const position = traffic.mesh.position;
      context.fillRect(position.x - 0.8, position.z - 0.45, 1.6, 0.9);
    }
  }

  paintPolice(context, units) {
    context.fillStyle = '#ff5d5d';
    for (const unit of units) {
      if (!unit.active) continue;
      const position = unit.mesh.position;
      context.fillRect(position.x - 1, position.z - 0.55, 2, 1.1);
    }
  }

  paintPlayer(context, player) {
    context.fillStyle = '#fff4d9';
    context.beginPath();
    context.moveTo(player.x, player.z - 1.5);
    context.lineTo(player.x - 1, player.z + 1);
    context.lineTo(player.x + 1, player.z + 1);
    context.closePath();
    context.fill();
  }

  paintFrame(context) {
    context.strokeStyle = '#f8d99e';
    context.lineWidth = 5;
    context.beginPath();
    context.arc(CENTER, CENTER, 183, 0, Math.PI * 2);
    context.stroke();
  }

  paintReadout(context, player, target) {
    context.fillStyle = '#fff1d0';
    context.font = 'bold 18px sans-serif';
    context.textAlign = 'center';
    context.fillText(target ? `${Math.round(Math.hypot(target.x - player.x, target.z - player.z))}m` : 'CITY', CENTER, 360);
    context.font = '11px sans-serif';
    context.fillStyle = '#c8d6c8';
    context.fillText(this.findDistrict(player).toUpperCase(), CENTER, 24);
  }

  findDistrict(player) {
    const nearest = DISTRICTS.map(district => ({
      district,
      distance: Math.hypot(player.x - district.x, player.z - district.z)
    })).sort((a, b) => a.distance - b.distance)[0];
    this.currentDistrict = nearest?.district.name || 'Sunward Bay';
    return this.currentDistrict;
  }
}

// The map readout includes a live objective distance and nearby district label.
