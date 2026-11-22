import { VEHICLES } from './vehicles.js';
import { TUNING } from './config.js';
import { makeCar } from './city.js';

// Traffic lanes alternate direction so each avenue reads as two-way, with a
// continuous loop at both ends of the compact map.
const AVENUES = TUNING.traffic.avenues;
const ROAD_END = TUNING.traffic.roadEnd;
const ROAD_START = TUNING.traffic.roadStart;
const TRAFFIC_COUNT = TUNING.traffic.count;
const CIVILIAN_MODELS = VEHICLES.filter(vehicle => vehicle.name !== 'Harbor Patrol interceptor');

export function makeTraffic(scene) {
  return Array.from({ length: TRAFFIC_COUNT }, (_, index) => {
    const model = CIVILIAN_MODELS[index % CIVILIAN_MODELS.length];
    const axis = index % 2 ? 'x' : 'z';
    const avenue = AVENUES[Math.floor(index / (TRAFFIC_COUNT / AVENUES.length))];
    const direction = index % 4 < 2 ? 1 : -1;
    const mesh = makeCar(model.color, false, model.class);
    const phase = ROAD_START + index * 7.1;
    scene.add(mesh);
    const car = {
      mesh,
      model,
      axis,
      avenue,
      lane: avenue,
      direction,
      speed: 5 + index % 5,
      phase,
      stopped: 0,
      honkCooldown: 0,
      routeName: `${axis === 'x' ? 'Boulevard' : 'Avenue'} ${String(Math.abs(avenue)).padStart(2, '0')}`,
      driverLine: index % 2 ? 'left lane is clear' : 'watching the cross street'
    };
    placeAtLane(car);
    return car;
  });
}

function placeAtLane(car) {
  if (car.axis === 'x') {
    car.mesh.position.set(car.phase, 0, car.avenue + (car.direction > 0 ? 1.4 : -1.4));
    car.mesh.rotation.y = car.direction > 0 ? Math.PI / 2 : -Math.PI / 2;
  } else {
    car.mesh.position.set(car.avenue + (car.direction > 0 ? -1.4 : 1.4), 0, car.phase);
    car.mesh.rotation.y = car.direction > 0 ? 0 : Math.PI;
  }
}

export function updateTraffic(cars, dt) {
  for (const car of cars) {
    if (car.playerControlled) continue;
    if (car.stopped > 0) {
      car.stopped = Math.max(0, car.stopped - dt);
      continue;
    }
    car.phase += dt * car.speed * car.direction;
    car.honkCooldown = Math.max(0, car.honkCooldown - dt);
    if (car.phase > ROAD_END) car.phase = ROAD_START;
    if (car.phase < ROAD_START) car.phase = ROAD_END;
    placeAtLane(car);
  }
}

export function nearestTraffic(cars, point, radius = 5) {
  return cars
    .map(car => ({ car, distance: Math.hypot(car.mesh.position.x - point.x, car.mesh.position.z - point.z) }))
    .filter(entry => entry.distance < radius)
    .sort((left, right) => left.distance - right.distance)[0] || null;
}

export function stopTraffic(car, seconds = 1.4) {
  if (!car) return false;
  car.stopped = Math.max(car.stopped, seconds);
  return true;
}

export function trafficDescription(car) {
  return `${car.model.name} · ${car.routeName} · ${car.driverLine}`;
}

// Twelve cars and seven civilian models cycle through all four avenues in both directions.
