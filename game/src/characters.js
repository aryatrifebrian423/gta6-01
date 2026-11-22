// Eight contacts have distinct voices, home districts and schedules that anchor the city.
export const CHARACTERS=[
{name:'Sol Velez',role:'fixer',district:'Marina Row',routine:'checks slips at dawn, takes calls at the bait shop after dark',lines:['A city is a ledger with the ink still wet.','You got here before the heat. That counts.','No heroics, Rook. Just get home with the whole story.']},
{name:'Marina Cole',role:'taxi dispatcher',district:'Civic Sun',routine:'dispatches morning fares, walks the fountain at noon',lines:['Keep the meter fair and the wheels out of the water.','My people remember every driver who gets them there.','Sunward is three blocks wide when you know the lights.']},
{name:'Dante Rook',role:'street racer',district:'Palmetto Heights',routine:'tunes before sunrise, races the boulevard at dusk',lines:['First through the arch wins. No excuses, no elbows.','A clean line feels faster than a loud motor.','Let’s see if your tires know your name.']},
{name:'Ivy Chen',role:'photographer',district:'Luna Pier',routine:'shoots water at first light, edits at the pier cafe',lines:['The bay changes color every five minutes.','Bring me proof, not another story about light.','The best frame is the one you almost missed.']},
{name:'Rico Vane',role:'fence',district:'Old Quarter',routine:'opens his repair shop at ten, closes when lamps come on',lines:['A camera makes a memory. A witness makes a problem.','Keep your hands visible and promises smaller.','I know a buyer for anything that fits a glovebox.']},
{name:'Luna Park',role:'pier singer',district:'Luna Pier',routine:'sings late by the ferris wheel, sleeps through lunch',lines:['The tide keeps better time than my drummer.','If you hear the chorus, you made it to the water.','This town hums in a key only the tired can hear.']},
{name:'Captain Hale',role:'harbor police chief',district:'Glass Harbor',routine:'walks the breakwater at dawn, reviews radio logs at midnight',lines:['Patrol is a promise to get people home.','Don’t make me bring the whole bay for one car.','The siren is a request before it becomes a warning.']},
{name:'Old Man Ferro',role:'fisherman',district:'Marina Row',routine:'mends nets before sunup, fishes the lee side at low tide',lines:['Low tide shows you what high water hides.','That pier has heard worse plans than yours.','The fish don’t care whose car that is.']}];
export const CHARACTER_DETAILS = {
  'Sol Velez': {
    introduction:'Sol keeps a folding chair outside the marina office and a second phone in the bait shop.',
    route:['Marina Office','East Slip','Ferro’s Net Rack'],
    hours:'05:30–09:00 marina walk · noon at the bait shop · after dusk by the office',
    tells:['sets his watch three minutes fast','knows which ferries are running late','never asks twice for the same favor']
  },
  'Marina Cole': {
    introduction:'Marina runs the taxi dispatch board with a pencil, a paper map and a very exact clock.',
    route:['Civic Sun Dispatch','Civic Fountain','Old Quarter Awning'],
    hours:'07:00–11:00 dispatch desk · lunch at the fountain · evening fare board',
    tells:['writes the passenger’s name before the address','knows every pothole by its sound','pays the full fare when a ride goes wrong']
  },
  'Dante Rook': {
    introduction:'Dante tunes an old roadster in a shaded court above the boulevard.',
    route:['Palmetto Overlook','Palms Gate','Marina Arch'],
    hours:'04:30 garage lights · late afternoon boulevard laps · sunset at the arch',
    tells:['checks tire pressure by hand','keeps a spare map in the glove box','will race anyone who asks with respect']
  },
  'Ivy Chen': {
    introduction:'Ivy carries two cameras, one dry bag and a notebook filled with changing tide marks.',
    route:['Luna Bandstand','North Boardwalk','Glass Warehouse'],
    hours:'05:00 shoreline light · midday edits at the pier cafe · blue hour on the boardwalk',
    tells:['waits for the wind to settle','labels each frame with its direction','never photographs a face without asking']
  },
  'Rico Vane': {
    introduction:'Rico trades in repaired tools, rumors and things that fit in a coat pocket.',
    route:['Old Quarter Awning','Civic Sun Dispatch','Glass Warehouse'],
    hours:'10:00 repair shutters up · 15:00 supply walk · closes when the street lamps warm',
    tells:['keeps receipts in a biscuit tin','knows who owns every workshop key','asks what a picture proves before asking who took it']
  },
  'Luna Park': {
    introduction:'Luna sings old harbor songs with new verses whenever the ferry schedule changes.',
    route:['Luna Bandstand','Ferry Ticket Window','North Boardwalk'],
    hours:'Late morning sleep · sound check at sunset · sets until the last ferry horn',
    tells:['sings the tide table as a warm-up','remembers a listener by their shoes','keeps a spare string in her jacket']
  },
  'Captain Hale': {
    introduction:'Hale has spent enough mornings on the breakwater to recognize every patrol engine.',
    route:['Hale’s Breakwater Walk','Glass Warehouse','West Causeway'],
    hours:'06:00 harbor walk · noon desk briefing · midnight radio review',
    tells:['asks for a safe road before a fast one','keeps patrol notes in a pocket notebook','lets a warning stand if the street listens']
  },
  'Old Man Ferro': {
    introduction:'Ferro can tell the tide by the sound of a chain on the eastern pilings.',
    route:['Ferro’s Net Rack','East Slip','North Boardwalk'],
    hours:'Before dawn at the net rack · low tide on the lee wall · home after the last fish market cart',
    tells:['mends nets while he talks','knows which board creaks in wet weather','gives directions in boat lengths']
  }
};

export const characterNamed = (name) => CHARACTERS.find(person => person.name === name) || null;

export function contactLine(name, index = 0) {
  const person = characterNamed(name);
  if (!person) return 'The city is quiet for a moment.';
  return person.lines[Math.abs(index) % person.lines.length];
}

export function dailyRoute(name) {
  return CHARACTER_DETAILS[name]?.route || [];
}

// The biographies make familiar faces feel like neighbors with an actual working day.
