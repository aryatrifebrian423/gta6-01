// The stations use these original track names and DJ links with the synth drone mixer.
export const RADIO_SHOWS=[
  {
    name:'Palm FM',
    frequency:'88.4',
    dj:'Mira Sol',
    format:'sunshine soul and boulevard pop',
    color:'#f4b56d',
    tracks:[
      'Sun on Glass', 'Blue Hour Bicycle', 'Avenue Without End', 'Warm Concrete',
      'Window Seat to the Sea', 'Orange Line Home', 'Slow Lane Summer', 'Marina Morning',
      'Paper Cup Parade', 'Hotel Balcony', 'All the Way to Civic Sun', 'Light Through Palms'
    ],
    lines:[
      'Bright side of the water, friends.',
      'A little shade, a little bass, and an open road.',
      'Mira here on Palm FM. The eastern avenue is clear and the air smells like oranges.',
      'A small reminder from the boardwalk: the best detour is the one with a view.',
      'If you are stopped at Civic Sun, the fountain is throwing a little extra light today.',
      'This next song goes out to every driver who let someone merge without a horn.',
      'The ferry is running late, which means the pier has time for one more chorus.',
      'Keep your windows down. The bay is doing the mixing for us.'
    ],
    bulletins:[
      'Civic Sun dispatch says Nia Bell is waiting by the west fountain walk.',
      'A small sailing class is returning to Marina Row before the noon ferry.',
      'The Palm Street bakery has put orange rolls on the cooling rack.',
      'The boulevard is moving at a steady pace between Civic Sun and the overlook.',
      'The pier bandstand is setting up under the red canopy for tonight’s set.',
      'A lost canvas hat is waiting at the ferry window. It has a blue pin.'
    ],
    signoff:'Palm FM: take the bright road and bring somebody along.'
  },
  {
    name:'Tide Radio',
    frequency:'101.2',
    dj:'Gabe Current',
    format:'harbor folk, field recordings and local notices',
    color:'#83d4cc',
    tracks:[
      'Low Water Hymn', 'Slip Number Nine', 'Ferry Lights', 'Salt in the Speaker',
      'Net Mender Waltz', 'Channel Marker', 'The Lee Side', 'Tin Roof Rain',
      'Two Bells at Dawn', 'Blue Rope', 'Last Boat Back', 'A Map of the Wind'
    ],
    lines:[
      'The tide says take your time; traffic says otherwise.',
      'For folks who hear the harbor before they see it.',
      'Gabe at the desk. Water is easing off the northern wall; keep an eye on the lower steps.',
      'Old Man Ferro says the fish are under the pilings. He says that every day, so take it as a welcome.',
      'The breakwater bell is a little slow tonight. The boats know what it means anyway.',
      'Our harbor note today: the small boats are coming home before the light goes copper.',
      'You are listening to Tide Radio, from the room above the bait shop.',
      'A quiet road can still be a good road. Leave some space for the sound of the water.'
    ],
    bulletins:[
      'Old Man Ferro has mended the net along the eastern lee wall.',
      'The north boardwalk is damp where the high water reached the lower boards.',
      'A work skiff is tied at slip number nine until the afternoon tide.',
      'Captain Hale’s morning walk ended at the west causeway marker.',
      'The fish market closes early when the last blue cooler is empty.',
      'A line of small boats is returning behind the breakwater.'
    ],
    signoff:'Tide Radio: listen for the bell before you choose the next street.'
  },
  {
    name:'Night Drive',
    frequency:'104.7',
    dj:'June Meridian',
    format:'after-hours synth, slow drums and city stories',
    color:'#c3a3f2',
    tracks:[
      'After the Causeway', 'Neon Palms', 'Last Window Lit', 'Quiet Receiver',
      'Avenue in Violet', 'One More Block', 'Static on the Shore', 'Midnight Ferry',
      'The Long Green Light', 'Room Above the Laundromat', 'Sleepy Signal', 'Turn Down the Dash'
    ],
    lines:[
      'Leave room between the siren and the song.',
      'The night is wide enough for one more good decision.',
      'June Meridian here. If the street looks empty, it is still listening.',
      'This one is for the windows that keep a square of light on after midnight.',
      'There is a long green light near the old quarter. Take it easy through the crossing.',
      'The causeway has a way of making every thought sound like an ending.',
      'Night Drive is a small station with the whole city for an antenna.',
      'If you have made it this far, there is probably a cup of coffee somewhere with your name on it.'
    ],
    bulletins:[
      'The glass warehouse lamps are coming on one row at a time.',
      'Luna Park has one more song before the last ferry horn.',
      'The west road is clear up to the causeway, but the channel is dark.',
      'A late taxi is crossing the square with its roof light on.',
      'The night shift at the bait shop has left the radio playing softly.',
      'The palms make a long shadow on the boulevard tonight.'
    ],
    signoff:'Night Drive: let the city get smaller in the mirror.'
  }
];

// A single authored station record drives the HUD readout and the on-air scheduler.
// The track names are deliberately local to this fictional city and contain no licensed audio.
export const stationByName = (name) => RADIO_SHOWS.find(show => show.name === name) || RADIO_SHOWS[0];
