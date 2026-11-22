// Briefings, live updates and completion dialogue shown when story objectives advance.
export const DIALOGUE=[
{brief:['Sol: You picked the right morning to arrive.','Rook: I picked the only bus that came.','Sol: Then let’s turn bad timing into a start.'],updates:['Sol: The marina office is just past the blue skiff.'],done:'Sol: You showed up. That is how a city starts trusting you.'},
{brief:['Sol: A courier left his coupe on the east walk.','Rook: Borrowed?','Sol: For the length of one honest errand.'],updates:['Sol: Keep the engine cool; the docks are watching.'],done:'Sol: Keys back in your pocket. Now we have options.'},
{brief:['Sol: A parcel has to reach Luna Pier before the band packs up.','Rook: What’s inside?','Sol: A promise. Keep it dry.'],updates:['Sol: Stay on bright roads until the pier lights take over.'],done:'Sol: The right person got the package. You made the night easier.'},
{brief:['Sol: Four dockside faces are leaning on a bad deal.','Rook: And I’m meant to interrupt?','Sol: Make enough noise for them to leave.'],updates:['Sol: Two down. Keep the pier behind you.'],done:'Sol: The harbor can breathe again. Get patched up.'},
{brief:['Sol: I have a boat out past the channel marker.','Rook: You’re coming too.','Sol: I was hoping you’d say that.'],updates:['Sol: The road west is open. Do not look back.'],done:'Sol: At the edge of the bay, every ending looks like a beginning.'},
{brief:['Marina: Passenger is Nia Bell at Civic Sun.','Rook: Meter running.','Marina: Fair ride, fair fare.'],updates:['Nia: The old quarter awnings, please.'],done:'Marina: Another safe arrival. The dispatch board remembers.'},
{brief:['Dante: Three gates around the boulevard. Beat me clean.','Rook: Try to keep up.','Dante: That is the idea.'],updates:['Dante: Second gate. The marina arch is your finish.'],done:'Dante: I owe you a rematch and a tire shop.'},
{brief:['Ivy: Six sealed cases slid under the pier boards.','Rook: Before the water rises?','Ivy: Before the pier turns into a mirror.'],updates:['Ivy: The tide is at your ankles. One more row.'],done:'Ivy: Every case made it back. The frame is yours.'},
{brief:['Rico: Four landmarks, four frames, all before the lamps.','Rook: What makes them worth a look?','Rico: They are still here. That is enough.'],updates:['Rico: Get the fountain from its eastern side.'],done:'Rico: The city looks different when you prove it.'},
{brief:['Sol: Harbor Patrol is already looking for us.','Rook: Then let’s give them a view of the sunset.','Sol: West causeway. Meet me beyond the channel.'],updates:['Sol: Keep moving. The lights are closing behind us.'],done:'Sol: There you are. We leave the old tide to itself.'}];
// Follow-up exchanges are triggered by objective milestones, not elapsed wall time.
// Each update gives the player a useful cue while keeping the cast in conversation.
export const MISSION_BEATS = [
  [
    ['Sol: The blue skiff is yours to pass. Look for my yellow jacket.', 'Rook: I can see the marina office from here.', 'Sol: Good. Remember the view; it changes after a bad decision.'],
    ['Sol: The first job is done. You can breathe for a minute.', 'Rook: I was trying to look like I belonged.', 'Sol: Nobody belongs here. Some people just know where to stand.']
  ],
  [
    ['Sol: The coupe is on the east walk. The owner left it unlocked.', 'Rook: That sounds a lot like stealing.', 'Sol: Call it a loan with a very short due date.'],
    ['Sol: The marina office saw you take the wheel.', 'Rook: They saw a car leave.', 'Sol: In this town, a car leaving is a whole conversation.'],
    ['Sol: Keep the paint clean. The courier knows every scratch.', 'Rook: Then he can meet me at the next light.', 'Sol: You are learning to negotiate.']
  ],
  [
    ['Sol: Parcel is sealed. The destination is the bandstand at Luna Pier.', 'Rook: Is it fragile?', 'Sol: Only if you make it a story.'],
    ['Luna: The drummer is packing up. Your headlights are right on time.', 'Rook: I brought the parcel, not a request.', 'Luna: Around here, those are often the same thing.'],
    ['Sol: The pier has it. Keep the receipt in your memory.', 'Rook: There was no receipt.', 'Sol: Exactly.']
  ],
  [
    ['Sol: Four people are turning a dockside favor into a threat.', 'Rook: I only have one set of hands.', 'Sol: You only need enough room for people to walk away.'],
    ['Captain Hale: We have calls from the east slips. Clear the walkway.', 'Rook: They can leave on their own.', 'Captain Hale: Then give them a reason to choose that.'],
    ['Sol: The last one is gone. Get out of the open.', 'Rook: They were not expecting company.', 'Sol: Nobody is, until they are.']
  ],
  [
    ['Sol: The west road reaches the causeway. I have a boat waiting.', 'Rook: You are coming with me.', 'Sol: I packed before you asked.'],
    ['Sol: The patrol lights are behind the palms now.', 'Rook: I can still hear them.', 'Sol: Then keep the radio low and the wheels straight.'],
    ['Sol: The channel is clear. We have a little time.', 'Rook: What happens after the water?', 'Sol: We decide while we are moving.']
  ],
  [
    ['Marina: Nia is waiting by the fountain. She has a paper bag and no patience.', 'Nia: Please take the avenue; the paving stones bounce the cake.', 'Rook: I will keep the corners gentle.'],
    ['Nia: That is the old quarter sign. You did not miss it.', 'Rook: I try to keep my promises small.', 'Nia: Small promises are the ones people remember.'],
    ['Marina: Fare posted and passenger delivered. Good work.', 'Nia: The icing survived. That is a five-star ride.', 'Rook: I will put that on the door.']
  ],
  [
    ['Dante: Three gates, one clean lap. Your car can make it.', 'Rook: And if your car can?', 'Dante: I will buy the first round.'],
    ['Dante: The glass gate is yours. The arch decides it.', 'Rook: You sound worried.', 'Dante: I sound like someone who knows the route.'],
    ['Dante: You held the line through all three.', 'Rook: You said clean. I heard you.', 'Dante: Rematch at sunset. Same road, better tires.']
  ],
  [
    ['Ivy: The pier boards have six cases tucked under the rail.', 'Rook: Who left them there?', 'Ivy: The tide did. It returns everything eventually.'],
    ['Old Man Ferro: Water is climbing under the east pilings.', 'Rook: I can still reach the last row.', 'Old Man Ferro: You can reach it if you stop looking at the clock.'],
    ['Ivy: Six frames, six cases. You made the pier look generous.', 'Rook: It was the tide doing the work.', 'Ivy: The tide never signs a picture.']
  ],
  [
    ['Rico: The fountain, the slips, the pier and the warehouse. Four frames.', 'Rook: Anything special about the light?', 'Rico: The truth looks best before the lamps come on.'],
    ['Rico: Turn east of the basin. The spray catches the sun there.', 'Rook: You know the exact angle?', 'Rico: I know who owns the only dry wall nearby.'],
    ['Rico: They are good frames. I can tell the city was awake.', 'Rook: I was there for all of it.', 'Rico: That is why they look like evidence.']
  ],
  [
    ['Sol: Three stars means every patrol has our direction.', 'Rook: I can hear the radios.', 'Sol: Stay on the west avenue and do not stop for a light.'],
    ['Captain Hale: Units, keep the causeway mouth clear.', 'Sol: That is our road.', 'Rook: Then they can watch us take it.'],
    ['Sol: You got us through the waterline.', 'Rook: The city is still on the other side.', 'Sol: It always will be. That is why we leave.']
  ]
];

// Every job has a distinct opener, several milestone exchanges and a payoff.
// This lookup lets the simulation select a beat without duplicating dialogue.
export function dialogueForMission(index) {
  return MISSION_BEATS[Math.max(0, Math.min(MISSION_BEATS.length - 1, index))];
}

export const MISSION_CROSS_TALK = [
  [
    ['Sol: You keep looking at the water.', 'Rook: I have not seen this much of it before.', 'Sol: Give it a day. It will start looking back.'],
    ['Rook: Do people always meet by the boats?', 'Sol: Boats leave. It gives people a reason to say something before they go.', 'Rook: And if they stay?', 'Sol: Then you bring them a chair.']
  ],
  [
    ['Courier: That coupe has a scuff above the rear wheel.', 'Rook: I did not put it there.', 'Courier: I know. I was checking if you knew the difference.'],
    ['Rook: How long is a short loan?', 'Sol: Long enough to learn where the brakes are.', 'Rook: And after that?', 'Sol: Long enough to learn where the cameras are.']
  ],
  [
    ['Luna: The parcel made it dry.', 'Rook: The ride was smoother than it looked.', 'Luna: That is a useful skill around here.'],
    ['Rook: The pier is louder than the avenue.', 'Luna: People come here to hear each other over the water.', 'Rook: Does it work?', 'Luna: Sometimes the chorus does.']
  ],
  [
    ['Captain Hale: I heard the dock went quiet.', 'Rook: Nobody needed a hospital.', 'Captain Hale: That is still the best report I get all day.'],
    ['Rook: They were running a bad deal.', 'Sol: A bad deal can turn into a bad night for everyone.', 'Rook: I kept it from spreading.', 'Sol: Then call that the job.']
  ],
  [
    ['Rook: You have been packed for a while.', 'Sol: I never unpacked after the last storm season.', 'Rook: Was that a warning?', 'Sol: It was just the weather.'],
    ['Sol: There are lights on the other side of the channel.', 'Rook: We can see them from the boat.', 'Sol: That is far enough for tonight.']
  ],
  [
    ['Nia: I know the way, but I would rather look out the window.', 'Rook: I can take the long avenue.', 'Nia: That is why I called the dispatch board.'],
    ['Marina: Passenger got home and the cake stayed upright.', 'Rook: Does that happen often?', 'Marina: Only when the driver remembers there is a passenger.']
  ],
  [
    ['Tess: Dante says you use the whole road.', 'Rook: He said clean, not narrow.', 'Tess: Fair answer. I will watch the next lap.'],
    ['Bo: You kept the line through the glass turn.', 'Rook: I looked where I wanted to go.', 'Bo: That is better than looking at the wall.']
  ],
  [
    ['Ivy: The pier keeps a little of everything that falls through.', 'Rook: The tide gave the cases back.', 'Ivy: The tide gives the shape back. The rest is your work.'],
    ['Old Man Ferro: Water is at the low mark.', 'Rook: I have the last package.', 'Old Man Ferro: Then the pier can start forgetting the footprints.']
  ],
  [
    ['Rico: A picture can make a place look empty.', 'Rook: These did not.', 'Rico: That is why I can use them.'],
    ['Ivy: You framed the fountain without making it look like a postcard.', 'Rook: I did not know that was the assignment.', 'Ivy: It was not. Keep that accident.']
  ],
  [
    ['Sol: I can hear the patrol radio over the engine.', 'Rook: I thought the water would cover it.', 'Sol: The water carries every sound when the wind turns.'],
    ['Rook: The road ends at the channel.', 'Sol: Roads are allowed to end.', 'Rook: People?', 'Sol: People can keep going.']
  ]
];

export function crossTalkForMission(index, sequence = 0) {
  const conversations = MISSION_CROSS_TALK[Math.max(0, Math.min(MISSION_CROSS_TALK.length - 1, index))];
  return conversations[Math.abs(sequence) % conversations.length];
}
