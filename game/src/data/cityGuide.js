import {DISTRICTS} from '../config.js';
// Pause screen uses these same named districts as the minimap and mission hints.
export const CITY_GUIDE=DISTRICTS.map((d,i)=>({name:d.name,description:d.desc,signature:['Marina bells at sunrise','blue warehouse glass','fountain spray','balcony gardens','a voice over the surf','painted awnings'][i]}));
export const districtAt=(x,z)=>CITY_GUIDE.reduce((best,d)=>{const p=DISTRICTS.find(v=>v.name===d.name);return Math.hypot(x-p.x,z-p.z)<Math.hypot(x-DISTRICTS.find(v=>v.name===best.name).x,z-DISTRICTS.find(v=>v.name===best.name).z)?d:best},CITY_GUIDE[0]);
export const CITY_LANDMARKS = [
  {name:'Marina Office',district:'Marina Row',x:2,z:31,kind:'contact',detail:'A weatherboard office under warm string lights. Sol takes meetings on the seaward side.'},
  {name:'East Slip',district:'Marina Row',x:19,z:24,kind:'job',detail:'The courier leaves a coupe here when the early ferry is in port.'},
  {name:'Civic Fountain',district:'Civic Sun',x:0,z:0,kind:'landmark',detail:'A low stone basin with a bronze compass at its center. The square is a natural meeting point.'},
  {name:'Glass Warehouse',district:'Glass Harbor',x:31,z:8,kind:'landmark',detail:'Salt-streaked windows mirror the water in the morning and the avenue at dusk.'},
  {name:'Luna Bandstand',district:'Luna Pier',x:29,z:37,kind:'contact',detail:'Luna Park sings here after dark, with the ferry lamps behind her.'},
  {name:'North Boardwalk',district:'Luna Pier',x:34,z:40,kind:'collectible route',detail:'The boards sit low over the water. At high tide, spray runs under the handrail.'},
  {name:'Old Quarter Awning',district:'Old Quarter',x:-28,z:8,kind:'neighborhood',detail:'Painted cloth shades the repair shops and narrow sidewalks.'},
  {name:'Palmetto Overlook',district:'Palmetto Heights',x:-20,z:-20,kind:'viewpoint',detail:'Balconies face the boulevard. A clear afternoon makes the bay look almost flat.'},
  {name:'West Causeway',district:'Glass Harbor',x:-38,z:0,kind:'route',detail:'The city road narrows before it reaches open water. Patrols watch the mouth.'},
  {name:'Ferro’s Net Rack',district:'Marina Row',x:8,z:34,kind:'contact',detail:'Old Man Ferro repairs nets beside the lee wall before sunrise.'},
  {name:'The Bait Shop Radio',district:'Marina Row',x:5,z:29,kind:'radio',detail:'Tide Radio broadcasts from a small upstairs room above the shop.'},
  {name:'Civic Sun Dispatch',district:'Civic Sun',x:-3,z:3,kind:'service',detail:'Marina Cole keeps the taxi board by the west walk and knows who is waiting.'},
  {name:'Ferry Ticket Window',district:'Luna Pier',x:25,z:34,kind:'service',detail:'A shuttered ticket window opens again when the last boat is called in.'},
  {name:'Hale’s Breakwater Walk',district:'Glass Harbor',x:36,z:11,kind:'patrol',detail:'Captain Hale checks the harbor from the concrete lip at the edge of the district.'}
];

export const DISTRICT_STORIES = {
  'Marina Row':{
    morning:'Ropes tap against the masts, the bait shop shutters rise, and the first ferry leaves a silver wake.',
    afternoon:'Mechanics open the slip gates while deckhands stack ice beside the fish stalls.',
    evening:'String lights turn on one by one above the marina office; the water holds their reflections.',
    local:'People here measure a day by boats coming home.'
  },
  'Glass Harbor':{
    morning:'Warehouse glass catches a pale stripe of sun. Forklifts cross the loading court slowly.',
    afternoon:'The loading doors throw long blocks of shade across the concrete.',
    evening:'The harbor patrol lights paint the windows blue and red when a radio call carries.',
    local:'The district is quiet until a crate is late.'
  },
  'Civic Sun':{
    morning:'The fountain starts before the courthouse opens. Commuters take the dry side of the basin.',
    afternoon:'Buskers share the shade with taxi drivers waiting for a dispatch.',
    evening:'Shop windows face the square and turn the paving stones amber.',
    local:'Every route in town seems to pass the fountain once.'
  },
  'Palmetto Heights':{
    morning:'Balcony plants drip from the night mist. A bakery cart turns toward the boulevard.',
    afternoon:'The palms throw striped shade across the slope above the avenue.',
    evening:'Radio music slips from open windows and disappears toward the sea.',
    local:'The view is free, but parking never is.'
  },
  'Luna Pier':{
    morning:'Fishermen work under the boardwalk while vendors rinse the salt from their tables.',
    afternoon:'The pier fills with families, gulls and the smell of orange peel.',
    evening:'Luna Park sings beneath the lamps while ferries cross the end of the bay.',
    local:'If you can hear the chorus, you are close enough to water.'
  },
  'Old Quarter':{
    morning:'Metal shutters lift beneath painted awnings and the bread delivery parks on the corner.',
    afternoon:'Repair shops keep a radio playing through the hottest part of the day.',
    evening:'The signs glow before the streetlights; shopkeepers take chairs outside.',
    local:'A stranger is recognized by the second block.'
  }
};

export const STREET_NOTES = [
  { district:'Marina Row', route:'Slip Road → Marina Office → north promenade', warning:'Pedestrians cross between boats and the fish stalls.', radio:'Mast ropes ring on a windy morning.' },
  { district:'Glass Harbor', route:'Warehouse Avenue → loading court → east wall', warning:'Trucks need the wide corner by the glass doors.', radio:'A forklift backs up under the gulls.' },
  { district:'Civic Sun', route:'Civic Avenue → fountain square → courthouse walk', warning:'The fountain stones are slick after the basin is cleaned.', radio:'A busker tunes up beside the water.' },
  { district:'Palmetto Heights', route:'Palmetto Rise → overlook → boulevard gates', warning:'The slope narrows at the upper palm row.', radio:'Balcony radios drift downhill in the evening.' },
  { district:'Luna Pier', route:'Luna Walk → bandstand → boardwalk rail', warning:'Spray leaves the north boards wet during high tide.', radio:'Luna Park warms up before the final ferry.' },
  { district:'Old Quarter', route:'Awning Street → repair shops → west market lane', warning:'Hand carts take the inside corner under the red awning.', radio:'A small radio plays behind each open shutter.' }
];

export const BAY_PROVERBS = [
  'A late ferry is still a ferry.',
  'Salt dries faster in the shade.',
  'The west road looks shorter before sunset.',
  'A quiet dock keeps the best stories.',
  'Leave one lane open for the people who live here.',
  'When the water turns copper, the day is almost over.'
];

export const CITY_BUSINESSES = [
  { name:'Blue Lantern Bait',district:'Marina Row',hours:'04:30–18:00',owner:'Mara Velasquez',detail:'Ice, line, hooks and a radio turned low enough to hear the slips.' },
  { name:'Ferro Net Repair',district:'Marina Row',hours:'before sunrise',owner:'Old Man Ferro',detail:'A bench, a spool of twine and a wall full of repaired cork floats.' },
  { name:'Slip 9 Chandlery',district:'Marina Row',hours:'08:00–17:00',owner:'Milo Reyes',detail:'Brass fittings and short lengths of rope sold by the foot.' },
  { name:'Morning Wake Coffee',district:'Marina Row',hours:'05:00–13:00',owner:'Eli Moss',detail:'A narrow window facing the ferry queue and a good view of the weather.' },
  { name:'Sun Dial Bakery',district:'Civic Sun',hours:'06:00–16:00',owner:'Nia Bell',detail:'Orange rolls, lemon cake and a flour mark on the front apron.' },
  { name:'Cole Dispatch Desk',district:'Civic Sun',hours:'07:00–22:00',owner:'Marina Cole',detail:'A map with pencil routes and a board of passengers who need a ride.' },
  { name:'Basin Flower Cart',district:'Civic Sun',hours:'09:00–17:00',owner:'Pia Lane',detail:'Buckets of bright flowers arranged in the shade of the courthouse walk.' },
  { name:'Civic Type & Copy',district:'Civic Sun',hours:'08:30–18:30',owner:'Mira Dale',detail:'A small print shop that keeps the neighborhood notices on the window.' },
  { name:'Awning Street Repairs',district:'Old Quarter',hours:'10:00–19:00',owner:'Rico Vane',detail:'Rico’s shop fixes hinges, radios and things people want to keep quiet.' },
  { name:'Red Thread Tailor',district:'Old Quarter',hours:'09:00–18:00',owner:'Sami Noor',detail:'A hand-painted sign and a spool of red thread in the doorway.' },
  { name:'West Market Produce',district:'Old Quarter',hours:'07:00–15:00',owner:'Ana Vale',detail:'A green awning over crates of pears, limes and warm tomatoes.' },
  { name:'Paper Moon Records',district:'Old Quarter',hours:'11:00–21:00',owner:'Jules Ferry',detail:'Used records in the front window and a turntable behind the counter.' },
  { name:'Palmetto Motor Court',district:'Palmetto Heights',hours:'all day',owner:'Leah Cruz',detail:'A shaded garage with a tire gauge hanging beside the work light.' },
  { name:'High Rise Laundry',district:'Palmetto Heights',hours:'06:00–23:00',owner:'Rae Mendez',detail:'A row of open windows where balcony music drifts up the hill.' },
  { name:'Overlook Juice Stand',district:'Palmetto Heights',hours:'07:00–14:00',owner:'Tess Alvarez',detail:'Cold citrus drinks and a chalkboard with the day’s running route.' },
  { name:'Luna Pier Fry Bread',district:'Luna Pier',hours:'12:00–23:30',owner:'Bo Mercer',detail:'A warm paper bag and a queue that reaches the first boardwalk lamp.' },
  { name:'Last Ferry Tickets',district:'Luna Pier',hours:'11:00–last boat',owner:'Mina Solis',detail:'A service window that stays open as long as a passenger is waiting.' },
  { name:'South Rail Photo Lab',district:'Luna Pier',hours:'10:00–20:00',owner:'Ivy Chen',detail:'A clean sink, drying clips and a wall of carefully labelled frames.' },
  { name:'Harbor Glass & Supply',district:'Glass Harbor',hours:'06:00–16:00',owner:'Arlo Finch',detail:'Window panes, work gloves and a toolbox near the loading lane.' },
  { name:'Breakwater Radio',district:'Glass Harbor',hours:'on the hour',owner:'Captain Hale',detail:'A dispatch room where the patrol log is read twice before it is filed.' }
];

export function streetNoteFor(name) {
  return STREET_NOTES.find(note => note.district === name) || STREET_NOTES[2];
}

export function proverbAt(index) {
  return BAY_PROVERBS[Math.abs(index) % BAY_PROVERBS.length];
}

export function businessesIn(district) {
  return CITY_BUSINESSES.filter(place => place.district === district);
}

export function landmarkNamed(name) {
  return CITY_LANDMARKS.find(place => place.name === name) || null;
}

// Guide text shares coordinates with the map and turns familiar places into authored stops.
