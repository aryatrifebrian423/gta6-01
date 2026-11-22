// Eight original models use small, readable arcade-tuning differences.
export const VEHICLES = [
  { name: 'Mistral S2', topSpeed: 43, accel: 17, grip: 1.02, handling: 'quick nose, light rear', color: 0xd88c68, desc: 'A tidy coupe built for the long avenue.', class: 'sport', seats: 2, weight: 1.04 },
  { name: 'Cayo 4x4', topSpeed: 34, accel: 12, grip: 1.24, handling: 'steady over rough ground', color: 0xd6bd7b, desc: 'A sun-faded utility wagon with honest suspension.', class: 'utility', seats: 4, weight: 1.18 },
  { name: 'Solace GT', topSpeed: 49, accel: 19, grip: 0.92, handling: 'fast, needs room to turn', color: 0x65b9b7, desc: 'A grand tourer humming below the sea wall.', class: 'grand tourer', seats: 2, weight: 1.08 },
  { name: 'Marina Compact', topSpeed: 29, accel: 11, grip: 1.3, handling: 'short wheelbase, easy parking', color: 0xf0c77b, desc: 'A little hatchback with a large glovebox.', class: 'compact', seats: 4, weight: 0.82 },
  { name: 'Harbor Patrol interceptor', topSpeed: 42, accel: 18, grip: 1.18, handling: 'stable pursuit chassis', color: 0x233c48, desc: 'A harbor unit with an old-school light bar.', class: 'patrol', seats: 4, weight: 1.12 },
  { name: 'Vela Roadster', topSpeed: 45, accel: 20, grip: 0.9, handling: 'open top, eager steering', color: 0xe77f65, desc: 'Two seats, canvas roof, no excuse to dawdle.', class: 'roadster', seats: 2, weight: 0.94 },
  { name: 'Palms Cruiser', topSpeed: 36, accel: 14, grip: 1.12, handling: 'smooth and broad', color: 0x88a98c, desc: 'A roomy city sedan for warm evenings.', class: 'sedan', seats: 5, weight: 1.1 },
  { name: 'Dune Buggy', topSpeed: 38, accel: 16, grip: 1.38, handling: 'bouncy, excellent on sand', color: 0xd9a95d, desc: 'A noisy escape route with knobby tires.', class: 'off-road', seats: 2, weight: 0.78 }
];

export const vehicleFor = name => VEHICLES.find(vehicle => vehicle.name === name) || VEHICLES[0];

export function accelerationFor(vehicle, wetGrip = 1) {
  return vehicle.accel * vehicle.weight * wetGrip;
}

export function steeringRate(vehicle, speed, wetGrip = 1) {
  const speedPenalty = Math.min(0.55, Math.abs(speed) / Math.max(vehicle.topSpeed, 1) * 0.48);
  return Math.max(0.55, vehicle.grip * wetGrip * (1 - speedPenalty));
}

export function speedInKilometersPerHour(speed) {
  return Math.round(Math.abs(speed) * 3.6);
}

export function vehicleCard(vehicle) {
  return `${vehicle.name} · ${Math.round(vehicle.topSpeed * 3.6)} km/h · ${vehicle.handling}. ${vehicle.desc}`;
}

export function civilianVehicles() {
  return VEHICLES.filter(vehicle => vehicle.class !== 'patrol');
}

export function compareVehicles(first, second) {
  const left = vehicleFor(first);
  const right = vehicleFor(second);
  return {
    faster: left.topSpeed >= right.topSpeed ? left.name : right.name,
    quicker: left.accel >= right.accel ? left.name : right.name,
    steadier: left.grip >= right.grip ? left.name : right.name,
    comparison: `${left.name} (${left.handling}) · ${right.name} (${right.handling})`
  };
}

// Handling text is exposed to the HUD and the speed chart without changing model identity.
