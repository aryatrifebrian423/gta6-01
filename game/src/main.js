import { CONFIG, TUNING, clamp, distance } from './config.js';
import { buildCity, makePerson } from './city.js';
import { makeTraffic, updateTraffic, nearestTraffic } from './traffic.js';
import { makePedestrians, updatePedestrians, frighten, nearestBark } from './pedestrians.js';
import { createPolice, updatePolice, activePatrols } from './police.js';
import { WantedSystem } from './wanted.js';
import { MISSIONS, currentMission } from './missions.js';
import { ActivityBook, FARES, RACE, COINS, PHOTO_STOPS } from './activities.js';
import { vehicleFor, steeringRate, accelerationFor } from './vehicles.js';
import { fireShot, makeCrew, exposeCrew, hideCrew, crewAttack, crewStatus } from './combat.js';
import { BayHud } from './hud.js';
import { BayMinimap } from './minimap.js';
import { BayCamera } from './camera.js';
import { BayEffects } from './effects.js';
import { BayAudio } from './audio.js';
import { BayRadio } from './radio.js';
import { BayWeather } from './weather.js';
import { INTRO, OUTRO, pauseCopy } from './story.js';
import { readSave, writeSave } from './save.js';

// All simulation and art assets are local. Three.js is the only bundled engine.
const canvas = document.querySelector('#world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9d8d84);
scene.fog = new THREE.Fog(0x9d8d84, 30, 105);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 180);
scene.add(camera);
scene.add(new THREE.HemisphereLight(0xffe6c0, 0x3b5860, 1.25));
const sun = new THREE.DirectionalLight(0xffd0a0, 1.45);
sun.position.set(-30, 40, 20);
scene.add(sun);
scene.userData.sun = sun;

const city = buildCity(scene);
const traffic = makeTraffic(scene);
const pedestrians = makePedestrians(scene);
const police = createPolice(scene);
const crew = makeCrew(scene);
const player = {
  x: CONFIG.playerStart.x,
  y: 0,
  z: CONFIG.playerStart.z,
  yaw: 0,
  car: null,
  mesh: makePerson(0x326b6a),
  lastImpact: -1
};
scene.add(player.mesh);

const hud = new BayHud();
const map = new BayMinimap(document.querySelector('#minimap'));
const wanted = new WantedSystem();
const activities = new ActivityBook();
const audio = new BayAudio();
const radio = new BayRadio(audio);
const weather = new BayWeather(city, scene);
const cameraRig = new BayCamera(camera);
const effects = new BayEffects(scene, canvas);
const stored = readSave();

let mission = stored?.mission ?? 0;
let cash = stored?.cash ?? 250;
let health = stored?.health ?? 100;
let time = 0;
let paused = true;
let dialogueBeat = 0;
let prompt = '';
let fare = null;
let raceActive = false;
let shotAt = -20;
let lastAmbientLine = 0;
const keys = new Set();

const parcels = createParcels();
const coins = createCoins();
const marker = new THREE.Group();
scene.add(marker);
let ring = null;
let beam = null;

function createParcels() {
  return Array.from({ length: 6 }, (_, index) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.45, 0.6),
      new THREE.MeshStandardMaterial({ color: 0xe6c47b, emissive: 0x745123, emissiveIntensity: 0.5 })
    );
    mesh.position.set(25 + index % 3 * 3, 0.35, 35 + Math.floor(index / 3) * 2.2);
    scene.add(mesh);
    return { mesh, id: index, taken: false };
  });
}

function createCoins() {
  return COINS.map((coin, index) => {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.42, 0.12, 8, 18),
      new THREE.MeshStandardMaterial({ color: 0xffd77d, emissive: 0x8f5f20, emissiveIntensity: 0.9 })
    );
    mesh.position.set(coin.x, 0.9, coin.z);
    mesh.rotation.x = Math.PI / 2;
    scene.add(mesh);
    return { coin, mesh, phase: index };
  });
}

function currentObjective() {
  if (fare) return fare.onboard ? fare.destination : fare.pickup;
  const job = currentMission(mission);
  if (job.kind === 'race') return RACE.gates[activities.raceGate % RACE.gates.length];
  if (job.kind === 'collect') return parcels.find(parcel => !parcel.taken)?.mesh.position || job;
  if (job.kind === 'photo') return PHOTO_STOPS.find(stop => !activities.photos.has(stop.label)) || job;
  return job;
}

function rebuildMarker() {
  marker.clear();
  const location = currentObjective();
  if (!location) return;
  ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.09, 10, 48),
    new THREE.MeshBasicMaterial({ color: 0xffd075 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(location.x, 0.16, location.z);
  marker.add(ring);

  beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.85, 7, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffd075, transparent: true, opacity: 0.15, side: THREE.DoubleSide })
  );
  beam.position.set(location.x, 3.5, location.z);
  marker.add(beam);
}

const toast = (message, seconds = 3) => {
  hud.flash(message, time, seconds);
  audio.blip('mission');
};

const save = () => writeSave({ mission, cash, health });
const crime = (amount = 1) => {
  wanted.crime(time, amount);
  audio.blip('crime');
};
const near = (point, radius = 4) => distance(player, point) < radius;

function completeMission() {
  if (mission >= MISSIONS.length) return;
  const job = currentMission(mission);
  cash += job.reward;
  mission += 1;
  hideCrew(crew);
  dialogueBeat = 0;
  if (mission === 4) wanted.level = 0;
  rebuildMarker();
  cameraRig.frameMission();
  toast(`${job.name} COMPLETE · +$${job.reward} · ${job.dialogue.done}`, 5);
  save();
  if (mission === 10) {
    hud.show('LAST SUNSET<br><span style="color:#ffd286">HIGH WATER</span>', OUTRO, 'CONTINUE FREE ROAM');
  }
}

function borrowOrExitVehicle() {
  if (player.car) {
    const vehicle = player.car;
    vehicle.playerControlled = false;
    vehicle.phase = vehicle.axis === 'x' ? vehicle.mesh.position.x : vehicle.mesh.position.z;
    vehicle.stopped = 0.9;
    player.x = clamp(vehicle.mesh.position.x + 2.5, -43, 43);
    player.z = vehicle.mesh.position.z;
    player.yaw = vehicle.mesh.rotation.y;
    player.car = null;
    player.mesh.visible = true;
    toast('ON FOOT · KEEP TO THE WALK');
    return;
  }

  const closest = nearestTraffic(traffic, player, 5);
  if (!closest) {
    prompt = 'Find a car to borrow';
    return;
  }
  player.car = closest.car;
  player.car.speed = 0;
  player.car.playerControlled = true;
  player.mesh.visible = false;
  crime();
  audio.blip('engine');
  toast(`${player.car.model.name} · THE CITY NOTICED`);
}

function startDialogue(job) {
  cameraRig.frameMission();
  const exchange = dialogueBeat === 0 ? job.beats?.[0] || job.dialogue.brief : job.crossTalk;
  const line = exchange[dialogueBeat % exchange.length];
  dialogueBeat += 1;
  hud.flash(line, time, 4);
  audio.blip('click');
  return line;
}

function beginFare() {
  fare = { ...FARES[activities.fareIndex % FARES.length], onboard: false };
  toast(`${fare.name} · ${fare.line}`, 4);
  rebuildMarker();
}

function startInteraction() {
  const job = currentMission(mission);
  if (player.car && !near(job, CONFIG.objectiveRadius)) {
    borrowOrExitVehicle();
    return;
  }
  if (near(job, CONFIG.objectiveRadius)) {
    if (job.needs === 'car' && !player.car) {
      prompt = 'A car is needed for this job';
      return;
    }
    if (job.kind === 'meet') {
      startDialogue(job);
      completeMission();
      return;
    }
    if (job.kind === 'crew') {
      exposeCrew(crew);
      crime();
      startDialogue(job);
      toast('GLASS HARBOR · FOUR CREW MEMBERS · SPACE TO FIRE', 4);
      return;
    }
    if (job.kind === 'race') {
      if (!player.car) {
        prompt = 'Dante’s circuit needs a car';
        return;
      }
      raceActive = true;
      activities.beginRace();
      startDialogue(job);
      rebuildMarker();
      toast(`${RACE.name.toUpperCase()} · ${RACE.rivals.join(' / ')}`, 4);
      return;
    }
    if (job.kind === 'collect') return;
    if (job.kind === 'photo') {
      photographNearbyStop();
      return;
    }
    if (job.kind === 'fare' && !fare) {
      beginFare();
      return;
    }
    if (job.kind === 'drive' || job.kind === 'escape') {
      startDialogue(job);
      completeMission();
      return;
    }
  }

  interactWithPickup();
}

function interactWithPickup() {
  if (fare && !fare.onboard && near(fare.pickup, 5)) {
    fare.onboard = true;
    toast(`${fare.name} ABOARD · ${fare.line}`, 4);
    rebuildMarker();
    return;
  }
  if (fare?.onboard && near(fare.destination, 5)) {
    completeFare();
    return;
  }
  const nextFare = FARES[activities.fareIndex % FARES.length];
  if (!fare && near(nextFare.pickup, 4)) {
    beginFare();
    return;
  }

  if (mission === 8) {
    photographNearbyStop();
    return;
  }
  if (!player.car) borrowOrExitVehicle();
}

function completeFare() {
  cash += fare.fare;
  activities.finishFare();
  toast(`FARE COMPLETE · ${fare.name} · +$${fare.fare}`, 4);
  fare = null;
  rebuildMarker();
  if (mission === 5) completeMission();
  else save();
}

function photographNearbyStop() {
  const stop = PHOTO_STOPS.find(place => !activities.photos.has(place.label) && near(place, 5));
  if (!stop) {
    prompt = 'Find a landmark and press E to frame it';
    return;
  }
  activities.photos.add(stop.label);
  toast(`FRAME SAVED · ${stop.label} · ${activities.photos.size}/4`);
  rebuildMarker();
  if (activities.photos.size === PHOTO_STOPS.length) completeMission();
}

function collectParcel(parcel) {
  if (parcel.taken) return false;
  parcel.taken = true;
  parcel.mesh.visible = false;
  const recovered = parcels.filter(item => item.taken).length;
  toast(`CASE RECOVERED · ${recovered}/6`, 2.5);
  const updateExchange = currentMission(mission).beats?.[1];
  if (recovered === 3 && updateExchange?.length) hud.flash(updateExchange[0], time, 3.5);
  rebuildMarker();
  if (recovered === parcels.length) completeMission();
  return true;
}

function handleKeyDown(event) {
  if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) event.preventDefault();
  if (keys.has(event.code)) return;
  keys.add(event.code);

  if (event.code === 'Escape') {
    if (!hud.el.screen.classList.contains('hidden')) {
      hud.hide();
      paused = false;
      audio.setPaused(false);
    } else {
      paused = true;
      audio.setPaused(true);
      const guide = pauseCopy();
      const neighborhoods = guide.districts.map(district => `${district.name}: ${district.description} ${district.dayNotes.local} Route: ${district.streets.route}.`).join('\n');
      const operation = currentMission(mission).intel;
      hud.show('SUNWARD BAY<br><span style="color:#ffd286">PAUSED</span>', `${INTRO}\n\nCURRENT LEAD · ${operation.route}\nCLUE · ${operation.clue}\n\n${neighborhoods}\n\n${weather.note}`, 'RETURN TO THE BAY');
    }
  }

  if (event.code === 'KeyE' && !paused) startInteraction();
  if (event.code === 'KeyR' && !paused) toast(radio.next(), 2);
  if (event.code === 'Enter' && !paused) startInteraction();
  if (event.code === 'Space' && !paused && !player.car) firePlayerShot();
}

function firePlayerShot() {
  audio.blip('shot');
  crime();
  frighten(pedestrians, player);
  shotAt = time;
  const muzzleX = player.x + Math.sin(player.yaw);
  const muzzleZ = player.z + Math.cos(player.yaw);
  effects.muzzle(muzzleX, 1.3, muzzleZ);
  if (fireShot(player, crew)) {
    const status = crewStatus(crew);
    if (status.cleared) completeMission();
    else hud.flash(status.label, time, 1.8);
  }
}

window.addEventListener('keydown', handleKeyDown);
window.addEventListener('keyup', event => keys.delete(event.code));
document.querySelector('#startButton').addEventListener('click', () => {
  audio.start();
  audio.setPaused(false);
  paused = false;
  hud.hide();
  if (mission === 0) hud.flash(INTRO, time, 4);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
});

function stageScreenshot() {
  const shot = new URLSearchParams(window.location.search).get('shot');
  if (!shot) return;
  paused = false;
  hud.hide();
  audio.start();

  if (shot === 'chase') {
    cameraRig.setLookBack(true);
    player.car = traffic[2];
    player.car.playerControlled = true;
    player.car.speed = 15;
    player.car.mesh.position.set(-35, 0, 30);
    player.car.mesh.rotation.y = Math.PI / 2;
    player.x = -35;
    player.z = 30;
    player.yaw = Math.PI / 2;
    mission = 9;
    wanted.crime(time, 3);
    cash = 6240;
    health = 74;
    police.forEach((unit, index) => {
      unit.active = true;
      unit.mesh.visible = true;
      unit.mesh.position.set(-42 - index * 3, 0, 30 + (index % 2) * 2.5);
    });
  } else if (shot === 'driving') {
    player.car = traffic[4];
    player.car.speed = 19;
    player.car.mesh.position.set(4, 0, -8);
    player.x = 4;
    player.z = -8;
    player.yaw = Math.PI / 2;
    mission = 5;
    cash = 1840;
  } else if (shot === 'onfoot') {
    player.x = -3;
    player.z = 4;
    player.yaw = Math.PI / 2;
    mission = 2;
    cash = 1090;
  } else if (shot === 'mission') {
    mission = 2;
    player.x = 24;
    player.z = 35;
    player.yaw = Math.PI / 2;
    cash = 2150;
  }
  player.mesh.position.set(player.x, 0, player.z);
  rebuildMarker();
}

stageScreenshot();
let previousFrame = performance.now();
requestAnimationFrame(function renderFrame(now) {
  requestAnimationFrame(renderFrame);
  const dt = Math.min(0.045, (now - previousFrame) / 1000);
  previousFrame = now;
  if (!paused) {
    time += dt;
    updateGame(dt);
  }
  renderer.render(scene, camera);
});

function readControls() {
  return {
    forward: keys.has('KeyW') || keys.has('ArrowUp'),
    reverse: keys.has('KeyS') || keys.has('ArrowDown'),
    left: keys.has('KeyA') || keys.has('ArrowLeft'),
    right: keys.has('KeyD') || keys.has('ArrowRight'),
    sprint: keys.has('ShiftLeft') || keys.has('ShiftRight')
  };
}

function driveVehicle(dt, controls) {
  const car = player.car;
  const model = vehicleFor(car.model.name);
  const wetGrip = weather.roadCondition.grip;
  if (controls.forward) car.speed = Math.min(model.topSpeed, car.speed + accelerationFor(model, wetGrip) * dt);
  else if (controls.reverse) car.speed = Math.max(-model.topSpeed * 0.42, car.speed - model.accel * dt);
  else car.speed *= Math.pow(0.18, dt);

  const steering = Number(controls.right) - Number(controls.left);
  car.mesh.rotation.y += steering * dt * (1.8 + Math.abs(car.speed) * 0.035) * steeringRate(model, car.speed, wetGrip) * (car.speed >= 0 ? 1 : -1);
  car.mesh.position.x = clamp(car.mesh.position.x + Math.sin(car.mesh.rotation.y) * car.speed * dt * wetGrip, -44, 44);
  car.mesh.position.z = clamp(car.mesh.position.z + Math.cos(car.mesh.rotation.y) * car.speed * dt * wetGrip, -44, 44);
  Object.assign(player, { x: car.mesh.position.x, z: car.mesh.position.z, yaw: car.mesh.rotation.y });
}

function walkPlayer(dt, controls) {
  const movement = Number(controls.forward) - Number(controls.reverse);
  const turning = Number(controls.right) - Number(controls.left);
  player.yaw += turning * dt * 2.3;
  const pace = CONFIG.playerSpeed * (controls.sprint ? CONFIG.sprint : 1);
  player.x = clamp(player.x + Math.sin(player.yaw) * movement * pace * dt, -44, 44);
  player.z = clamp(player.z + Math.cos(player.yaw) * movement * pace * dt, -44, 44);
  player.mesh.position.set(player.x, 0, player.z);
  player.mesh.rotation.y = player.yaw;
}

function updateCollectibles(dt) {
  for (const collectible of coins) {
    collectible.mesh.rotation.z += dt;
    if (activities.coins.has(collectible.coin.id)) continue;
    if (distance(player, collectible.coin) >= CONFIG.coinRadius) continue;
    if (!activities.collectCoin(collectible.coin.id)) continue;
    collectible.mesh.visible = false;
    cash += collectible.coin.value;
    audio.blip('coin');
    hud.flash(`PALM COIN · ${activities.coins.size}/12 · +$${collectible.coin.value} · ${collectible.coin.hint}`, time, 4);
    save();
  }

  if (mission === 7) {
    const parcel = parcels.find(item => !item.taken && distance(player, item.mesh.position) < 2.4);
    if (parcel) collectParcel(parcel);
  }
}

function updateRace(dt) {
  if (!raceActive || mission !== 6) return;
  const gate = activities.advanceRace(dt).gate;
  if (!gate || distance(player, gate) >= 4) return;
  const outcome = activities.crossRaceGate();
  if (outcome.complete) {
    raceActive = false;
    toast(`REDLINE FINISH · ${outcome.seconds.toFixed(1)} SECONDS`, 4);
    completeMission();
  } else {
    rebuildMarker();
    const updateExchange = currentMission(mission).beats?.[1];
    if (updateExchange?.length) hud.flash(updateExchange[0], time, 3.5);
    toast(`${gate.label} · NEXT ${outcome.next.label}`);
  }
}

function updateFareDelivery() {
  if (!fare?.onboard || distance(player, fare.destination) >= 4) return;
  completeFare();
}

function clinicRespawn() {
  const result = wanted.bust(cash);
  cash = result.cash;
  health = result.health;
  player.car = null;
  player.mesh.visible = true;
  player.x = CONFIG.clinic.x;
  player.z = CONFIG.clinic.z;
  player.mesh.position.set(player.x, 0, player.z);
  toast(`BUSTED · CLINIC RESPAWN · FINE $${result.fine}`, 4);
  save();
}

function updateContactDamage(dt) {
  const nearby = activePatrols(police).filter(unit => distance(player, unit.mesh.position) < 2.5).length;
  if (nearby) health = Math.max(0, health - nearby * TUNING.police.damagePerSecond * dt);
  if (mission === 3 && time - shotAt > 2) health = Math.max(0, health - crewAttack(crew, player, dt));
  const patrolsAtArrestDistance = activePatrols(police).filter(unit => distance(player, unit.mesh.position) < TUNING.police.arrestRadius).length;
  if (health <= 0 || wanted.shouldBeBusted(patrolsAtArrestDistance)) clinicRespawn();
}

function updateVehicleImpacts() {
  if (!player.car || time - player.lastImpact < 1) return;
  const collision = traffic.find(car => car !== player.car && distance(player, car.mesh.position) < TUNING.driving.crashRadius);
  if (!collision) return;
  if (Math.abs(player.car.speed) > TUNING.driving.crashSpeed) {
    health = Math.max(0, health - Math.min(16, Math.abs(player.car.speed) * 0.32));
    player.car.speed *= -0.22;
    effects.crash(player.x, 0.8, player.z);
    audio.blip('damage');
    player.lastImpact = time;
  }
}

function updatePrompts() {
  const nearbyVehicle = !player.car && nearestTraffic(traffic, player, 4);
  if (nearbyVehicle) prompt = `E · BORROW ${nearbyVehicle.car.model.name.toUpperCase()}`;
  else if (player.car) prompt = 'E · EXIT VEHICLE';
  else if (near(currentMission(mission), CONFIG.objectiveRadius)) prompt = 'E · TALK / START JOB';
  else if (fare) prompt = fare.onboard ? `${fare.name.toUpperCase()} · DESTINATION` : `E · PICK UP ${fare.name.toUpperCase()}`;
  else prompt = '';
}

function updateGame(dt) {
  const controls = readControls();
  prompt = '';
  if (player.car) driveVehicle(dt, controls);
  else walkPlayer(dt, controls);

  updateTraffic(traffic, dt);
  updatePedestrians(pedestrians, dt);
  if (time - lastAmbientLine > 12) {
    const bark = nearestBark(pedestrians, player, time);
    if (bark) {
      lastAmbientLine = time;
      hud.flash(`${bark.name}: ${bark.line}`, time, 2.8);
    }
  }
  weather.update(dt, time);
  const onAir = radio.update(time);
  if (onAir) hud.flash(`${radio.show.dj}: ${onAir}`, time, 4);
  audio.update(time);
  updatePolice(police, wanted, player, dt);
  updateCollectibles(dt);
  updateRace(dt);
  updateFareDelivery();
  updateVehicleImpacts();
  if (mission === 9 && wanted.level < 3) wanted.level = 3;
  wanted.update(time);
  updateContactDamage(dt);
  updatePrompts();

  const objective = currentObjective();
  if (ring) ring.rotation.z += dt * 0.5;
  if (beam) beam.material.opacity = 0.12 + Math.sin(time * 2) * 0.05;
  cameraRig.update(player, dt);
  effects.update(dt, Math.abs(player.car?.speed || 0), health, player.yaw, player);
  map.draw(player, traffic, police, objective);
  hud.update({ mission, cash, health, player, wanted, activities, weather, radio, prompt }, time);
}

// A private query flag exposes deterministic controls for the local playtest.
// Ordinary pages receive no debug panel and use the same gameplay functions below.
if (new URLSearchParams(window.location.search).get('test') === '1') {
  window.__sunwardBayTest = {
    state: () => ({ mission, cash, health, wanted: wanted.level, patrols: activePatrols(police).length, fares: activities.fares, coins: activities.coins.size, car: player.car?.model.name || null }),
    teleport: (x, z) => {
      player.x = x;
      player.z = z;
      player.mesh.position.set(x, 0, z);
      if (player.car) player.car.mesh.position.set(x, 0, z);
      rebuildMarker();
    },
    setMission: index => {
      mission = clamp(index, 0, MISSIONS.length - 1);
      fare = null;
      raceActive = false;
      activities.raceGate = 0;
      activities.photos.clear();
      parcels.forEach(parcel => { parcel.taken = false; parcel.mesh.visible = true; });
      rebuildMarker();
    },
    borrow: () => {
      if (!nearestTraffic(traffic, player, 5)) traffic[0].mesh.position.set(player.x + 1, 0, player.z);
      borrowOrExitVehicle();
    },
    exit: borrowOrExitVehicle,
    interact: startInteraction,
    update: dt => updateGame(Math.max(0.01, Math.min(dt, 0.25))),
    collectCoin: id => {
      const collectible = coins.find(item => item.coin.id === id);
      if (!collectible) return false;
      player.x = collectible.coin.x;
      player.z = collectible.coin.z;
      updateCollectibles(0.01);
      return activities.coins.has(id);
    },
    collectParcel: id => {
      const parcel = parcels.find(item => item.id === id);
      if (!parcel) return false;
      player.x = parcel.mesh.position.x;
      player.z = parcel.mesh.position.z;
      return collectParcel(parcel);
    },
    crossGate: index => {
      const gate = RACE.gates[index];
      if (!gate) return false;
      player.x = gate.x;
      player.z = gate.z;
      updateRace(0.01);
      return activities.raceGate;
    },
    arriveAtFare: (x, z) => {
      player.x = x;
      player.z = z;
      if (fare && !fare.onboard) startInteraction();
      else updateFareDelivery();
      return activities.fares;
    }
  };
}

rebuildMarker();
