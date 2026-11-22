// World units are metres; the player and traffic stay inside a compact coastal grid.
export const CONFIG={city:'Sunward Bay',bounds:46,playerSpeed:8,sprint:1.55,saveKey:'sunward-bay-save-v1',wantedDecay:17,playerStart:{x:2,z:31},walkCollisionRadius:.55,carBorrowRadius:5,objectiveRadius:5,coinRadius:1.5,clinic:{x:-4,z:-2},dayLengthSeconds:533};
export const TUNING={
 traffic:{count:12,roadStart:-46,roadEnd:46,avenues:[-30,-10,10,30],laneOffset:1.4,loopPadding:4},
 pedestrians:{count:25,shotFleeRadius:15,shotFleeSeconds:5,nearbyVoiceRadius:7,voiceCooldown:9},
 police:{units:3,spawnDistance:62,contactRadius:2.5,arrestRadius:5,damagePerSecond:20},
 activities:{coinCount:12,coinValue:25,pickupRadius:1.5,packageCount:6,photoCount:4,raceGateCount:3},
 driving:{reverseLimit:.42,idleDrag:.18,crashRadius:2.25,crashSpeed:8,wetGrip:.87},
 camera:{fieldOfView:60,near:.1,far:180,footDistance:5.1,carDistance:8.3},
 presentation:{pixelRatioLimit:1.8,toastSeconds:3,objectiveBeamHeight:7,markerRadius:1.9},
 world:{fogNear:30,fogFar:105,waterNorthEdge:39,clinicLabel:'Sunward Clinic',maxWantedStars:5},
 progression:{missionCount:10,startingCash:250,firstFare:90,firstCoin:25,clinicFinePerStar:125},
 accessibility:{keyboardRepeat:false,highContrastWanted:true,reduceMotionMediaQuery:true}
};
export const DISTRICTS=[
 {name:'Marina Row',x:0,z:30,desc:'Salt-streaked slips, late boats and first chances.',street:'Slip Road',color:'#4e8d8c',sound:'mast ropes tapping against the pier',landmark:'Marina Office',edge:'north promenade'},
 {name:'Glass Harbor',x:30,z:8,desc:'Warehouse windows catch the sun; nobody looks long.',street:'Warehouse Avenue',color:'#6b8790',sound:'loading doors and a distant gull',landmark:'Glass Warehouse',edge:'east loading court'},
 {name:'Civic Sun',x:0,z:0,desc:'A fountain, courthouse and square built for shade.',street:'Civic Avenue',color:'#d59d6d',sound:'fountain water over warm stone',landmark:'Civic Fountain',edge:'central plaza'},
 {name:'Palmetto Heights',x:-20,z:-20,desc:'Quiet balconies above the avenue.',street:'Palmetto Rise',color:'#729178',sound:'palm fronds against balcony rails',landmark:'Palmetto Overlook',edge:'north boulevard'},
 {name:'Luna Pier',x:27,z:35,desc:'Music, fried dough and a tide that keeps time.',street:'Luna Walk',color:'#d27865',sound:'a singer between ferry horns',landmark:'Luna Bandstand',edge:'waterfront boardwalk'},
 {name:'Old Quarter',x:-30,z:8,desc:'Low shops where every owner knows the weather.',street:'Awning Street',color:'#c47f69',sound:'repair radios and hand carts',landmark:'Old Quarter Awning',edge:'west market lane'}
];
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));export const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export const wrap=(value,min,max)=>{const span=max-min;return ((value-min)%span+span)%span+min};
export const directionBetween=(from,to)=>{const dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz)||1;return {x:dx/length,z:dz/length,length}};
export const pointOnRoad=(x,z)=>[-30,-10,10,30].some(axis=>Math.abs(x-axis)<4||Math.abs(z-axis)<4);
export const withinBounds=(point,padding=0)=>Math.abs(point.x)<=CONFIG.bounds-padding&&Math.abs(point.z)<=CONFIG.bounds-padding;
export const districtNames=DISTRICTS.map(district=>district.name);
// Shared coordinate helpers keep boundaries, steering and map distance consistent.
