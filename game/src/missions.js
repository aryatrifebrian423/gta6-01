import {DIALOGUE, dialogueForMission, crossTalkForMission} from './data/dialogue.js';
// Original story spine followed by dispatch, race, tide, photography and escape jobs.
// The ten chapter definitions are mapped below after their authored operations briefs.

export const MISSION_INTEL = [
  {
    route:'Stay on the dry stone between the fuel dock and the blue skiff. Sol waits beneath the string lights, where the marina road meets the north walk.',
    clue:'The yellow jacket is easier to spot from the promenade side.',
    pressure:'No patrol is looking for Rook yet. The only cost is time.',
    debrief:'Sol notices whether you listened before he decides what to ask next.'
  },
  {
    route:'The courier left the coupe near the east slip. The walk is narrow, so approach from the avenue and keep the water on your right.',
    clue:'The painted number on the east piling matches the courier’s note.',
    pressure:'Borrowing any civilian car adds one wanted star. Keep moving while the harbor office calls it in.',
    debrief:'The courier needs the vehicle returned with its parcel space clear.'
  },
  {
    route:'Luna Pier is beyond the fish market. Follow the avenue past the fountain, then take the boardwalk until the lamps replace the shop signs.',
    clue:'Look for the red bandstand canopy beside the ferry ticket window.',
    pressure:'The package is time-sensitive, but the road remains open if you miss a light.',
    debrief:'Luna is expecting a sealed parcel before the band packs away its stands.'
  },
  {
    route:'The deal is at Glass Harbor, beside the loading court. The four crew members hold a loose square; use the warehouse wall for cover and keep facing your target.',
    clue:'A visible crew member inside twelve metres and in front of Rook can be hit with Space.',
    pressure:'Crew members attack at close range. Patrol heat rises when a shot carries across the harbor.',
    debrief:'Clear all four without standing still in the loading lane.'
  },
  {
    route:'Sol needs the west causeway, where the avenue narrows beside the channel marker. A vehicle is the safest way to cross town.',
    clue:'The last turn is the broad road west of Civic Sun, not the lower market lane.',
    pressure:'The marina will remember which road you used, but nobody needs another fight.',
    debrief:'Sol has already packed. Reaching the causeway is the whole promise.'
  },
  {
    route:'Marina Cole’s dispatch board is beside Civic Sun. Nia waits at the fountain with a cake box; Old Quarter is the destination she gives you.',
    clue:'Pick her up where the paving rings the basin, then follow the west avenue to the painted awnings.',
    pressure:'A steady ride earns the listed fare. A rushed corner can still get the passenger there, but no one will call it good service.',
    debrief:'Nia is carrying a lemon cake to a repair shop before the morning delivery window closes.'
  },
  {
    route:'Dante starts Boulevard Three from Palmetto Heights. The route runs to Palms Gate, crosses Glass Gate and finishes at the Marina Arch.',
    clue:'The three checkpoints must be crossed in order; the gold ring marks the next one.',
    pressure:'Tess Alvarez and Bo Mercer watch the timing. The race is a friendly test, but the road is shared with traffic.',
    debrief:'The result records the elapsed run time and pays the chapter reward once.'
  },
  {
    route:'Six packages are tucked along Luna Pier. The first row sits under the north rail; the second follows the fish-market end of the boards.',
    clue:'Gold cases catch the sun, and the ring moves to the next untaken package.',
    pressure:'High tide softens road grip and begins to climb under the lowest boards.',
    debrief:'Recover all six before the water reaches the middle of the pier.'
  },
  {
    route:'Rico Vane wants four frames: Civic Fountain, Marina Slips, Luna Pier and Glass Warehouse. Each landmark is marked on the map.',
    clue:'Stand close to the gold landmark marker and press E to take a frame.',
    pressure:'The images are a record of the neighborhoods, not a race against a timer.',
    debrief:'Ivy Chen knows the light at each stop; Rico needs the places to be unmistakable.'
  },
  {
    route:'The escape road ends at the west causeway. Harbor Patrol already has a citywide search open, so keep the car pointed toward the channel.',
    clue:'Three wanted stars mean at least two units are on duty and actively following.',
    pressure:'Do not stop in the loading court. Patrols close the road when the heat climbs past three stars.',
    debrief:'Sol will meet Rook beyond the channel marker, where the city lights are behind them.'
  }
];

export const MISSIONS = [
['THE ARRIVAL','Meet Sol at the marina','Find Sol beneath the string lights at Marina Row.','Sol Velez',2,31,250,'foot','meet'],
['BORROWED LIGHT','Recover the courier’s coupe','Borrow a car and reach the east slip.','Sol Velez',19,24,400,'car','drive'],
['HOT PACKAGE','Deliver the parcel to Luna Pier','Take the parcel to the gold marker on Luna Pier.','Sol Velez',29,37,550,'car','drive'],
['GLASS HARBOR','Break up the dockside deal','Clear all four crew members near the warehouses.','Sol Velez',31,8,700,'combat','crew'],
['LAST SUNSET','Get Sol out of Sunward Bay','Reach the west causeway with Sol.','Sol Velez',-38,0,1200,'car','escape'],
['FARE PLAY','Taxi Nia Bell across town','Pick up Nia at Civic Sun and take her to Old Quarter.','Marina Cole',0,0,300,'car','fare'],
['REDLINE','Win a street race through three checkpoints','Take Dante’s Vela Roadster through the boulevard gates.','Dante Rook',-20,-20,500,'car','race'],
['LOW TIDE','Collect six packages along the pier before the tide turns','Find six gold cases before the water climbs.','Ivy Chen',34,38,450,'foot','collect'],
['STATIC','Photograph four landmarks','Frame the fountain, marina, pier and glass warehouse.','Rico Vane',0,0,350,'foot','photo'],
['HIGH WATER','Escape the city at wanted level three','Keep patrols behind you; reach the west causeway.','Sol Velez',-38,0,900,'car','escape']
].map(([name,title,hint,giver,x,z,reward,needs,kind],id)=>({
  id,
  name,
  title,
  hint,
  giver,
  x,
  z,
  reward,
  needs,
  kind,
  briefing:DIALOGUE[id].brief[0],
  dialogue:DIALOGUE[id],
  beats:dialogueForMission(id),
  crossTalk:crossTalkForMission(id),
  intel:MISSION_INTEL[id],
  objective:{x,z,kind,label:title.toLocaleUpperCase()},
  availability:id===0?'open':'complete the previous chapter'
}));
export const currentMission=i=>MISSIONS[Math.min(i,9)];
export const missionProgress=(index)=>({
  completed:Math.max(0,Math.min(index,MISSIONS.length)),
  remaining:Math.max(0,MISSIONS.length-index),
  next:currentMission(index)
});

export const MISSION_CHAPTERS = MISSIONS.map((mission, index) => ({
  number: index + 1,
  name: mission.name,
  giver: mission.giver,
  district: mission.kind === 'race' ? 'Palmetto Heights' : mission.kind === 'collect' ? 'Luna Pier' : 'Sunward Bay',
  rewardLabel: `$${mission.reward.toLocaleString('en-US')}`,
  requirement: mission.needs === 'car' ? 'Car required' : mission.needs === 'combat' ? 'Combat required' : 'On foot or by car',
  completion: mission.dialogue.done
}));

export function missionByName(name) {
  return MISSIONS.find(mission => mission.name === name) || null;
}

export function missionBriefing(index) {
  const mission = currentMission(index);
  return `${mission.giver}: ${mission.briefing}`;
}

// Mission records remain data-only; the main loop owns movement and invokes completion rewards.
// Keeping objective coordinates beside their titles makes map markers and HUD copy agree.
