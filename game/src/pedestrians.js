import { makePerson } from './city.js';
import { TUNING } from './config.js';

// Walkers keep their own origin and role so a crowded plaza still reads like a
// neighborhood rather than a set of identical figures moving on one loop.
const WALKER_RECORDS = [
  ['Nia Bell', 'commuter', 'Civic Sun', 'I am late, but the cake is still level.'],
  ['Tomas Reed', 'commuter', 'Luna Pier', 'The ferry always leaves just as I arrive.'],
  ['Mina Solis', 'fisher', 'Marina Row', 'Good light on the water today.'],
  ['Owen Pike', 'commuter', 'Glass Harbor', 'My brother is closing the shop.'],
  ['Leah Cruz', 'jogger', 'Palmetto Heights', 'One more lap before the sun gets high.'],
  ['Arlo Finch', 'fisher', 'Marina Row', 'The lee side is calm if you know where to look.'],
  ['Sami Noor', 'commuter', 'Old Quarter', 'I know a quieter way through.'],
  ['Tess Alvarez', 'jogger', 'Civic Sun', 'That car is taking the corner too fast.'],
  ['Bo Mercer', 'commuter', 'Glass Harbor', 'The tide is already turning.'],
  ['Luz Vega', 'fisher', 'Luna Pier', 'The boards are slick near the north rail.'],
  ['Milo Park', 'commuter', 'Civic Sun', 'Morning keeps moving.'],
  ['Ana Vale', 'jogger', 'Palmetto Heights', 'Watch the curb, friend.'],
  ['Jules Ferry', 'commuter', 'Marina Row', 'The next boat is the one I meant to catch.'],
  ['Mara West', 'fisher', 'Luna Pier', 'Ferro says the water will climb by lunch.'],
  ['Paco Lune', 'commuter', 'Old Quarter', 'I left the radio on at the repair shop.'],
  ['Rae Mendez', 'jogger', 'Civic Sun', 'A little shade, a little distance.'],
  ['Kit Sol', 'commuter', 'Glass Harbor', 'You can see the bay in every window.'],
  ['Inez Cole', 'fisher', 'Marina Row', 'Keep clear of the rope coil.'],
  ['Pia Lane', 'commuter', 'Palmetto Heights', 'I want to see the whole bay once.'],
  ['Noah Blue', 'jogger', 'Old Quarter', 'These shoes were not made for wet boards.'],
  ['Sol Velez', 'commuter', 'Marina Row', 'A city is a ledger with the ink still wet.'],
  ['Drew Sage', 'fisher', 'Luna Pier', 'The gulls know when the market is open.'],
  ['Mika Rain', 'commuter', 'Civic Sun', 'The fountain is louder than the traffic.'],
  ['Cami Pearl', 'jogger', 'Palmetto Heights', 'The hill makes the run count twice.'],
  ['Eli Moss', 'commuter', 'Glass Harbor', 'Careful with that engine.']
];

const CLOTHING = [0xc58365, 0x589084, 0xd1a66f, 0x5c7891, 0xc5b49a];
const DISTRICT_ORIGINS = {
  'Marina Row': { x: 4, z: 29 },
  'Glass Harbor': { x: 29, z: 7 },
  'Civic Sun': { x: 0, z: 1 },
  'Palmetto Heights': { x: -21, z: -18 },
  'Luna Pier': { x: 28, z: 35 },
  'Old Quarter': { x: -29, z: 7 }
};

export function makePedestrians(scene) {
  return WALKER_RECORDS.map(([name, role, district, bark], index) => {
    const center = DISTRICT_ORIGINS[district];
    const phase = index * 2.399;
    const radius = 1.8 + index % 4 * 0.8;
    const origin = {
      x: center.x + Math.cos(phase) * radius,
      z: center.z + Math.sin(phase) * radius
    };
    const mesh = makePerson(CLOTHING[index % CLOTHING.length]);
    mesh.position.set(origin.x, 0, origin.z);
    scene.add(mesh);
    return {
      name,
      role,
      district,
      origin,
      mesh,
      speed: role === 'jogger' ? 1.25 : role === 'fisher' ? 0.42 : 0.68,
      phase,
      bark,
      flee: 0,
      routine: routineFor(role, index),
      lastBark: -10,
      safePoint: { x: center.x + Math.cos(phase + 2) * 5, z: center.z + Math.sin(phase + 2) * 5 }
    };
  });
}

function routineFor(role, index) {
  if (role === 'jogger') return index % 2 ? 'runs the square before work' : 'loops the overlook and boulevard';
  if (role === 'fisher') return index % 2 ? 'checks the pier at low tide' : 'walks between the net rack and slips';
  return index % 2 ? 'crosses the square on a work errand' : 'keeps to the local avenue and shopfronts';
}

export function frighten(pedestrians, point) {
  const alarmed = [];
  for (const walker of pedestrians) {
    const distance = Math.hypot(walker.mesh.position.x - point.x, walker.mesh.position.z - point.z);
    if (distance > TUNING.pedestrians.shotFleeRadius) continue;
    walker.flee = Math.max(walker.flee, TUNING.pedestrians.shotFleeSeconds);
    walker.safePoint = {
      x: walker.origin.x + Math.sign(walker.origin.x - point.x) * 7,
      z: walker.origin.z + Math.sign(walker.origin.z - point.z) * 7
    };
    alarmed.push(walker);
  }
  return alarmed;
}

export function nearestBark(pedestrians, point, now) {
  const nearby = pedestrians
    .filter(walker => now - walker.lastBark > TUNING.pedestrians.voiceCooldown)
    .map(walker => ({ walker, distance: Math.hypot(walker.mesh.position.x - point.x, walker.mesh.position.z - point.z) }))
    .filter(entry => entry.distance < TUNING.pedestrians.nearbyVoiceRadius)
    .sort((a, b) => a.distance - b.distance)[0];
  if (!nearby) return null;
  nearby.walker.lastBark = now;
  return { name: nearby.walker.name, line: nearby.walker.flee ? 'Move! Get clear of the street!' : nearby.walker.bark };
}

export function updatePedestrians(pedestrians, dt) {
  for (const walker of pedestrians) {
    walker.phase += dt * (walker.flee ? 2.7 : walker.speed * 0.42);
    if (walker.flee > 0) {
      const dx = walker.safePoint.x - walker.mesh.position.x;
      const dz = walker.safePoint.z - walker.mesh.position.z;
      const length = Math.hypot(dx, dz) || 1;
      walker.mesh.position.x += dx / length * walker.speed * 3 * dt;
      walker.mesh.position.z += dz / length * walker.speed * 3 * dt;
      walker.mesh.rotation.y = Math.atan2(dx, dz);
      walker.flee = Math.max(0, walker.flee - dt);
      continue;
    }
    const radius = walker.role === 'fisher' ? 1.3 : walker.role === 'jogger' ? 3.8 : 2.7;
    walker.mesh.position.x = walker.origin.x + Math.cos(walker.phase) * radius;
    walker.mesh.position.z = walker.origin.z + Math.sin(walker.phase * 0.83) * radius;
    walker.mesh.rotation.y = -walker.phase;
  }
}

// Named commuters, joggers and fishermen scatter when shots crack nearby and return to routine.
