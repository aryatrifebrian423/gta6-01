import { currentMission } from './missions.js';
import { vehicleFor, speedInKilometersPerHour } from './vehicles.js';
import { CHARACTERS, CHARACTER_DETAILS } from './characters.js';
import { districtAt } from './data/cityGuide.js';

// The DOM layer keeps story, heat, mode, health and activity totals readable.
const HUD_IDS = [
  'chapter', 'objective', 'hint', 'cash', 'wanted', 'mode', 'clock', 'radioLine',
  'counts', 'healthText', 'healthFill', 'prompt', 'toast', 'screen', 'screenTitle',
  'screenCopy', 'contacts', 'startButton'
];

function contactCard(character) {
  const detail = CHARACTER_DETAILS[character.name];
  return `<article class="contact" data-contact="${character.name}">
    <b>${character.name} · ${character.role}</b>
    <span>${detail.introduction}<br>
      <i>“${character.lines[0]}”<br>“${character.lines[1]}”<br>“${character.lines[2]}”</i><br>
      ${character.district} · ${character.routine}<br>
      ROUTE · ${detail.route.join(' → ')}<br>
      HOURS · ${detail.hours}
    </span>
  </article>`;
}

export class BayHud {
  constructor() {
    this.el = Object.fromEntries(HUD_IDS.map(id => [id, document.getElementById(id)]));
    this.until = 0;
    this.lastAnnouncement = '';
    this.el.contacts.innerHTML = CHARACTERS.map(contactCard).join('');
    this.el.healthFill.setAttribute('role', 'meter');
    this.el.healthFill.setAttribute('aria-label', 'Player health');
    this.el.prompt.setAttribute('role', 'status');
  }

  show(title, copy, button = 'RETURN TO THE BAY') {
    this.el.screenTitle.innerHTML = title;
    this.el.screenCopy.textContent = copy;
    this.el.startButton.textContent = button;
    this.el.screen.classList.remove('hidden');
    this.el.screen.setAttribute('aria-hidden', 'false');
    this.el.startButton.focus({ preventScroll: true });
  }

  hide() {
    this.el.screen.classList.add('hidden');
    this.el.screen.setAttribute('aria-hidden', 'true');
  }

  flash(message, simulationTime, duration = 3) {
    this.lastAnnouncement = String(message);
    this.el.toast.textContent = this.lastAnnouncement;
    this.el.toast.classList.add('visible');
    this.el.toast.setAttribute('aria-live', 'assertive');
    this.until = simulationTime + duration;
  }

  update(game, simulationTime) {
    const job = currentMission(game.mission);
    const elements = this.el;
    const district = districtAt(game.player.x, game.player.z);
    const chapter = Math.min(game.mission + 1, 10);

    elements.chapter.textContent = `CHAPTER ${String(chapter).padStart(2, '0')} · ${job.name}`;
    elements.objective.textContent = job.title;
    elements.hint.textContent = `${job.hint} · ${district.name} · ${game.weather.note}`;
    elements.hint.title = `${job.intel.route} ${job.intel.clue} ${job.intel.pressure}`;
    elements.hint.setAttribute('aria-label', `${job.hint} ${job.intel.route} ${job.intel.clue}`);
    elements.cash.textContent = `$${game.cash.toLocaleString('en-US')}`;
    elements.wanted.textContent = game.wanted.stars();
    elements.wanted.setAttribute('aria-label', `${game.wanted.level} wanted stars: ${game.wanted.tier.name}`);
    elements.wanted.title = game.wanted.statusLine;
    elements.mode.textContent = this.modeLine(game.player);
    elements.clock.textContent = `${game.weather.clock} · ${game.weather.phaseName.toUpperCase()}`;
    elements.radioLine.textContent = game.radio.readout;
    elements.counts.textContent = `${game.activities.progressLine(game.mission)} · $${game.cash.toLocaleString('en-US')} · WANTED ${game.wanted.stars()}`;
    elements.healthText.textContent = Math.ceil(game.health);
    elements.healthFill.style.width = `${game.health}%`;
    elements.healthFill.setAttribute('aria-valuenow', String(Math.ceil(game.health)));
    elements.prompt.textContent = game.prompt;
    elements.prompt.classList.toggle('visible', Boolean(game.prompt));

    if (simulationTime > this.until) elements.toast.classList.remove('visible');
  }

  modeLine(player) {
    if (!player.car) return 'ON FOOT · ROOK';
    const model = vehicleFor(player.car.model.name);
    const speed = speedInKilometersPerHour(player.car.speed);
    const topSpeed = speedInKilometersPerHour(model.topSpeed);
    return `${model.name.toUpperCase()} · ${speed} KM/H · TOP ${topSpeed}`;
  }
}

// The pause panel lists contact lines and schedules; the HUD remains concise in play.
