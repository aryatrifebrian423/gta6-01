import { CHARACTERS } from './characters.js';
import { DIALOGUE } from './data/dialogue.js';
import { CITY_GUIDE, DISTRICT_STORIES, streetNoteFor, businessesIn } from './data/cityGuide.js';
import { MISSIONS } from './missions.js';

export const INTRO = 'Rook comes to Sunward Bay with one bag and a borrowed name. Sol Velez offers a first job at the marina; the rest of the city offers its own terms.';
export const OUTRO = 'The causeway falls behind and the water opens wide. Sol keeps the radio low. Rook has a name now, and the city can keep the old one.';

export const STORY_BEATS = DIALOGUE.map((dialogue, index) => {
  const mission = MISSIONS[index];
  const giver = CHARACTERS.find(person => person.name === mission.giver);
  return {
    mission: index + 1,
    title: mission.name,
    giver: giver?.name || mission.giver,
    district: mission.kind === 'race' ? 'Palmetto Heights' : mission.kind === 'collect' ? 'Luna Pier' : 'Sunward Bay',
    line: mission.briefing,
    exchange: dialogue.brief,
    update: dialogue.updates,
    payoff: dialogue.done
  };
});

export const INTRO_SCENE = [
  { image: 'marina morning', voice: 'Rook', line: 'The bus stopped where the road ran out.' },
  { image: 'blue water and slips', voice: 'Rook', line: 'I had one bag, a new name and no plan for the afternoon.' },
  { image: 'Sol beneath the marina lights', voice: 'Sol Velez', line: 'You look like somebody who can finish a small job.' },
  { image: 'the city road grid', voice: 'Rook', line: 'That was how Sunward Bay let me in.' }
];

export const ENDING_SCENE = [
  { image: 'west causeway', voice: 'Sol Velez', line: 'The water is wider than it looked from the pier.' },
  { image: 'harbor lights in the distance', voice: 'Rook', line: 'The city will tell its own version.' },
  { image: 'open channel', voice: 'Sol Velez', line: 'Let it. We know what we carried out.' }
];

export const pauseCopy = () => ({
  intro: INTRO,
  outro: OUTRO,
  contacts: CHARACTERS,
  districts: CITY_GUIDE.map(district => ({
    ...district,
    dayNotes: DISTRICT_STORIES[district.name],
    streets: streetNoteFor(district.name),
    businesses: businessesIn(district.name),
    contact: CHARACTERS.find(person => person.district === district.name)?.name || 'neighbors'
  })),
  beats: STORY_BEATS,
  scenes: { opening: INTRO_SCENE, ending: ENDING_SCENE }
});

export function nextStoryLine(missionIndex, beatIndex = 0) {
  const beat = STORY_BEATS[Math.min(missionIndex, STORY_BEATS.length - 1)];
  if (!beat) return OUTRO;
  const exchange = beat.exchange;
  return exchange[beatIndex % exchange.length];
}

// The pause guide connects the main story, contact schedules and neighborhood notes.
