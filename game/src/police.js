import { makeCar } from './city.js';
import { WANTED_TIERS } from './wanted.js';
import { TUNING } from './config.js';

// Harbor Patrol units stay parked out of sight at zero heat, then use the
// current player position to pursue through the same bounded city streets.
export function createPolice(scene) {
  return Array.from({ length: TUNING.police.units }, (_, index) => {
    const mesh = makeCar(0x243d4c, true);
    mesh.visible = false;
    scene.add(mesh);
    return {
      mesh,
      index,
      active: false,
      speed: 7 + index * 0.4,
      sirenPhase: index * 0.6,
      targetLag: 0,
      lastPosition: new THREE.Vector3(),
      status: 'standby'
    };
  });
}

function responsePoint(player, unit, index) {
  const side = index % 2 ? 1 : -1;
  const angle = player.yaw + Math.PI + side * 0.22;
  const distance = 8 + index * 5;
  return {
    x: player.x + Math.sin(angle) * distance,
    z: player.z + Math.cos(angle) * distance
  };
}

export function updatePolice(units, wanted, player, dt) {
  const dutyCount = WANTED_TIERS[wanted.level].units;
  for (const unit of units) {
    const shouldDeploy = unit.index < dutyCount;
    if (!shouldDeploy) {
      unit.active = false;
      unit.status = 'standby';
      unit.mesh.visible = false;
      continue;
    }

    unit.active = true;
    unit.mesh.visible = true;
    unit.sirenPhase += dt * 9;
    const distanceToPlayer = Math.hypot(player.x - unit.mesh.position.x, player.z - unit.mesh.position.z);
    if (distanceToPlayer > TUNING.police.spawnDistance) {
      const spawn = responsePoint(player, unit, unit.index);
      unit.mesh.position.set(spawn.x, 0, spawn.z);
      unit.status = 'closing in';
    } else {
      unit.status = distanceToPlayer < 10 ? 'contact' : 'pursuit';
    }

    const dx = player.x - unit.mesh.position.x;
    const dz = player.z - unit.mesh.position.z;
    const length = Math.hypot(dx, dz) || 1;
    const targetAngle = Math.atan2(dx, dz);
    const turnDelta = Math.atan2(Math.sin(targetAngle - unit.mesh.rotation.y), Math.cos(targetAngle - unit.mesh.rotation.y));
    unit.mesh.rotation.y += Math.max(-2.2 * dt, Math.min(2.2 * dt, turnDelta));

    // Pursuit speeds rise slightly with heat, but never outrun the fastest player car.
    const pursuitSpeed = unit.speed + wanted.level * 0.5;
    unit.mesh.position.x += dx / length * pursuitSpeed * dt;
    unit.mesh.position.z += dz / length * pursuitSpeed * dt;
    unit.lastPosition.set(unit.mesh.position.x, 0, unit.mesh.position.z);
    pulseLightbar(unit.mesh, unit.sirenPhase);
  }
}

function pulseLightbar(mesh, phase) {
  const bar = mesh.children.filter(child => child.userData?.isLightbar);
  if (bar.length < 2) return;
  const left = Math.sin(phase) > 0;
  bar[0].material.emissiveIntensity = left ? 0.8 : 0.12;
  bar[1].material.emissiveIntensity = left ? 0.12 : 0.8;
}

export function activePatrols(units) {
  return units.filter(unit => unit.active);
}

// At higher heat, more units deploy and their approach lights alternate blue and red.
