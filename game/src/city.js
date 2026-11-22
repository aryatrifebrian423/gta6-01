// The waterfront grid, plaza, piers and pastel blocks are built from native Three.js geometry.
const material=(color,roughness=.8)=>new THREE.MeshStandardMaterial({color,roughness});
const block=(w,h,d,color)=>new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(color));
export function buildCity(scene){const group=new THREE.Group();scene.add(group);const add=(mesh,x,y,z)=>{mesh.position.set(x,y,z);group.add(mesh);return mesh};
 add(block(110,.2,110,0xc6a982),0,-.15,0);const water=add(block(110,.12,18,0x317d89),0,-.1,48);
 for(const n of [-30,-10,10,30]){add(block(100,.12,7,0x4c5554),0,-.03,n);add(block(7,.12,100,0x4c5554),n,-.03,0);for(let q=-45;q<45;q+=8){add(block(3,.035,.14,0xe6d6af),q,.05,n);add(block(.14,.035,3,0xe6d6af),n,.05,q)}}
 add(block(18,.22,16,0xd7be9b),0,.02,0);const basin=new THREE.Mesh(new THREE.CylinderGeometry(3.3,3.8,.55,32),material(0xb6a38a));add(basin,0,.35,0);const pool=new THREE.Mesh(new THREE.CylinderGeometry(2.8,2.8,.18,32),new THREE.MeshStandardMaterial({color:0x55b4b0,roughness:.25}));add(pool,0,.65,0);
 const palette=[0xe9bb91,0xdca483,0xf0d1a0,0xbac9b5,0xc6a8a2];for(let x=-40;x<=40;x+=20)for(let z=-40;z<=30;z+=20){if(Math.abs(x)<12&&Math.abs(z)<12)continue;let h=8+Math.abs((x*17+z*31)%10);add(block(9,h,11,palette[Math.abs((x+z)%palette.length)]),x,h/2,z);for(let y=2;y<h;y+=2.7)for(let w=-3;w<=3;w+=2){const lit=(Math.floor(y)+Math.abs(w)+Math.abs(x))%3===0;const front=new THREE.Mesh(new THREE.BoxGeometry(1.1,1,.08),new THREE.MeshStandardMaterial({color:lit?0xf0bd76:0x78aeb2,emissive:lit?0xb8793e:0x1f4146,emissiveIntensity:lit?.28:.06,roughness:.55}));add(front,x+w,y,z+5.56);const side=new THREE.Mesh(new THREE.BoxGeometry(.08,1,1.1),new THREE.MeshStandardMaterial({color:lit?0xe5b778:0x78aeb2,emissive:lit?0xa9703a:0x1f4146,emissiveIntensity:lit?.24:.06,roughness:.55}));add(side,x+4.56,y,z+w)}}
 for(let i=0;i<7;i++){add(block(2.6,.24,13,0x9b785a),-24+i*8,.1,39);const hull=new THREE.Mesh(new THREE.ConeGeometry(1.5,6,4),material([0xf0e3c5,0xd08068,0x79aeb1][i%3]));hull.rotation.z=Math.PI/2;add(hull,-17+i*8,.1,47)}
 for(const lane of [-34,-14,6,26,38])for(let z=-39;z<=38;z+=10){if(Math.abs(lane)<12&&Math.abs(z)<12)continue;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.16,.26,4.8,7),material(0x806447));add(trunk,lane,2.4,z);for(let k=0;k<5;k++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.32,4.3,5),material(k%2?0x427a60:0x5a916c));leaf.rotation.z=-.8;add(leaf,lane+Math.cos(k*1.25)*1.2,4.5,z+Math.sin(k*1.25)*1.2)}}
 // Promenade paving, rails and lamps create a readable boundary between town and water.
 add(block(72,.16,8,0xd5c1a1),0,.02,39);
 for(let x=-35;x<=35;x+=2.5){
   const seam=block(.055,.025,7.5,0xb7a58d);
   add(seam,x,.11,39);
 }
 for(const x of [-34,-22,-10,2,14,26,34]){
   const post=new THREE.Mesh(new THREE.CylinderGeometry(.11,.13,1.15,8),material(0x6d6356));
   add(post,x,.68,42.3);
   const rail=block(3.9,.12,.12,0x756757);
   add(rail,x+2,.92,42.3);
 }
 for(const x of [-30,-15,0,15,30]){
   const pole=new THREE.Mesh(new THREE.CylinderGeometry(.08,.12,5.6,8),material(0x4c5554));
   add(pole,x,2.8,36.2);
   const arm=block(.95,.1,.1,0x4c5554);
   add(arm,x+.38,5.45,36.2);
   const lamp=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),new THREE.MeshStandardMaterial({color:0xffd795,emissive:0xffa545,emissiveIntensity:.5}));
   add(lamp,x+.78,5.35,36.2);
 }
 // Small details break up the broad roof and plaza silhouettes at driving distance.
 for(const [x,z,color] of [[-4,-3,0xd77f68],[4,-4,0x6aa49a],[-4,4,0xe2c777],[4,4,0x9a7fa0]]){
   const canopy=new THREE.Mesh(new THREE.ConeGeometry(1.15,2.2,7),material(color));
   add(canopy,x,1.5,z);
   const planter=new THREE.Mesh(new THREE.CylinderGeometry(.72,.85,.35,12),material(0x957959));
   add(planter,x,.22,z);
 }
 for(let i=0;i<8;i++){
   const bench=block(1.8,.16,.46,0x9b7454);
   const x=-28+i*8;
   add(bench,x,.62,34.7);
   for(const legX of [x-.68,x+.68]){
     const leg=new THREE.Mesh(new THREE.BoxGeometry(.12,.55,.16),material(0x4e5553));
     add(leg,legX,.32,34.7);
   }
 }
 // Luna's bandstand and a small wheel give the pier a memorable night silhouette.
 const stageFloor=block(8,.34,5,0x8d6556);
 add(stageFloor,29,.35,36.4);
 const stageRoof=block(8,.24,5,0xd88b66);
 add(stageRoof,29,4.3,36.4);
 for(const x of [25.6,29,32.4])for(const z of [34.5,38.3]){
   const support=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,3.8,8),material(0xf0d7b4));
   add(support,x,2.3,z);
 }
 for(const x of [26,28,30,32]){
   const bulb=new THREE.Mesh(new THREE.SphereGeometry(.13,8,6),new THREE.MeshStandardMaterial({color:0xffd48c,emissive:0xffa546,emissiveIntensity:.75}));
   add(bulb,x,4.1,36.4);
 }
 const wheel=new THREE.Mesh(new THREE.TorusGeometry(4.1,.12,8,40),material(0x9b7862));
 add(wheel,37,5.1,38.5);
 for(let spoke=0;spoke<8;spoke++){
   const angle=spoke*Math.PI/4;
   const support=new THREE.Mesh(new THREE.BoxGeometry(.09,8.1,.09),material(0xb18d6d));
   support.rotation.z=angle;
   add(support,37,5.1,38.5);
   const gondola=new THREE.Mesh(new THREE.BoxGeometry(.8,.75,.7),material([0xd27865,0xe6c47b,0x71a49b,0x8290a5][spoke%4]));
   add(gondola,37+Math.cos(angle)*4.1,5.1+Math.sin(angle)*4.1,38.5);
 }
 for(const x of [35.1,38.9]){
   const leg=new THREE.Mesh(new THREE.BoxGeometry(.22,5.3,.28),material(0x806b56));
   leg.rotation.z=x<37?.28:-.28;
   add(leg,x,2.65,38.5);
 }
 // The east harbor has two loading frames, visible above the block roofs from the plaza.
 for(const x of [34,41]){
   const mast=new THREE.Mesh(new THREE.CylinderGeometry(.18,.28,11,8),material(0x7a6550));
   add(mast,x,5.5,8);
   const boom=block(7,.2,.25,0x7a6550);
   add(boom,x-3.1,10.7,8);
   const cable=new THREE.Mesh(new THREE.CylinderGeometry(.025,.025,4.3,5),material(0x463d35));
   add(cable,x-5.6,8.4,8);
   const hook=new THREE.Mesh(new THREE.TorusGeometry(.19,.045,6,10),material(0x463d35));
   add(hook,x-5.6,6.2,8);
 }
 // Shopfronts use cloth awnings, recessed doors and simple wall signs rather than blank cubes.
 const storefronts=[
   {x:-29,z:8,color:0xc67761,label:0xf1c77e},
   {x:-9,z:-11,color:0x5a9c91,label:0xffd28d},
   {x:11,z:-31,color:0x8a7698,label:0xf5b875},
   {x:31,z:8,color:0x4d8790,label:0xffd28d},
   {x:9,z:29,color:0xd08068,label:0xf3d99c},
   {x:-31,z:-12,color:0x759b7e,label:0xf1c77e}
 ];
 for(const shop of storefronts){
   const awning=block(6,.32,1.3,shop.color);
   add(awning,shop.x,.15,shop.z-5.9);
   for(let stripe=-2.5;stripe<=2.5;stripe+=1){
     const valance=block(.45,.5,.12,shop.label);
     add(valance,shop.x+stripe,.02,shop.z-6.5);
   }
   const door=block(1.05,2.4,.16,0x4b5551);
   add(door,shop.x,1.2,shop.z-5.58);
   const sign=block(3.7,.55,.18,shop.label);
   add(sign,shop.x,3.1,shop.z-5.64);
 }
 // Bollards and mooring rings make the water edge legible from foot level.
 for(const x of [-36,-28,-20,-12,-4,4,12,20,28,36]){
   const bollard=new THREE.Mesh(new THREE.CylinderGeometry(.18,.25,.72,8),material(0x465c5b));
   add(bollard,x,.36,43.7);
   const ring=new THREE.Mesh(new THREE.TorusGeometry(.25,.055,6,16),material(0xb0a18b));
   ring.rotation.x=Math.PI/2;
   add(ring,x,.59,43.7);
 }
 // Four painted direction boards name the neighborhoods at the avenues.
 for(const [x,z,label] of [[-10,-27,'PALMETTO'],[30,8,'GLASS HARBOR'],[-30,8,'OLD QUARTER'],[10,29,'MARINA ROW']]){
   const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.1,2.3,8),material(0x675c4c));
   add(post,x,1.15,z);
   const board=block(3.4,.62,.16,0x366f69);
   add(board,x,2.05,z);
   board.userData.label=label;
 }
 return {group,water};}
export function makeCar(color=0xd88c68,police=false,style='compact'){
 const root=new THREE.Group();
 const bodyWidth=style==='compact'?1.85:style==='utility'||style==='off-road'?2.25:2.1;
 const bodyLength=style==='grand tourer'?4.8:style==='roadster'?3.9:4.2;
 const body=new THREE.Mesh(new THREE.BoxGeometry(bodyWidth,.7,bodyLength),material(color,.38));
 body.position.y=.72;
 root.add(body);
 const cabinWidth=style==='utility'||style==='sedan'?1.72:1.6;
 const cabinLength=style==='grand tourer'?2.3:style==='compact'?1.75:2;
 const glass=new THREE.Mesh(new THREE.BoxGeometry(cabinWidth,.82,cabinLength),material(police?0x243944:0x86b4b4,.25));
 glass.position.set(0,1.38,-.15);
 root.add(glass);
 for(const x of [-bodyWidth*.52,bodyWidth*.52])for(const z of [-bodyLength*.32,bodyLength*.32]){
   const radius=style==='off-road'?.48:style==='sport'||style==='roadster'?.37:.4;
   const wheel=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,.24,12),material(0x20282a));
   wheel.rotation.z=Math.PI/2;
   wheel.position.set(x,.42,z);
   root.add(wheel);
 }
 if(style==='sport'||style==='grand tourer'){
   const spoiler=new THREE.Mesh(new THREE.BoxGeometry(1.75,.12,.28),material(0x292e2d,.4));
   spoiler.position.set(0,1.24,bodyLength*.48);
   root.add(spoiler);
   for(const x of [-.62,.62]){
     const support=new THREE.Mesh(new THREE.BoxGeometry(.08,.32,.1),material(0x292e2d,.4));
     support.position.set(x,1.08,bodyLength*.43);
     root.add(support);
   }
 }
 if(style==='utility'||style==='off-road'){
   const rack=new THREE.Mesh(new THREE.BoxGeometry(1.45,.11,2.1),material(0x39413e,.6));
   rack.position.set(0,1.84,-.18);
   root.add(rack);
   for(const x of [-.64,.64]){
     const rail=new THREE.Mesh(new THREE.BoxGeometry(.08,.18,2.1),material(0x39413e,.6));
     rail.position.set(x,1.9,-.18);
     root.add(rail);
   }
 }
 if(style==='roadster'){
   const windshield=new THREE.Mesh(new THREE.BoxGeometry(1.45,.62,.08),material(0x86b4b4,.2));
   windshield.rotation.x=-.18;
   windshield.position.set(0,1.56,-.78);
   root.add(windshield);
 }
 if(police){
   for(const x of [-.5,.5]){
     const colorLamp=x<0?0x3388ff:0xff3344;
     const lampMaterial=new THREE.MeshStandardMaterial({color:colorLamp,emissive:colorLamp,emissiveIntensity:.35});
     const lamp=new THREE.Mesh(new THREE.BoxGeometry(.55,.16,.3),lampMaterial);
     lamp.position.set(x,1.86,0);
     lamp.userData.isLightbar=true;
     root.add(lamp);
   }
 }
 const headlightMaterial=new THREE.MeshStandardMaterial({color:0xffe2a4,emissive:0xffc45e,emissiveIntensity:.22});
 for(const x of [-.7,.7]){
   const lamp=new THREE.Mesh(new THREE.BoxGeometry(.38,.16,.08),headlightMaterial);
   lamp.position.set(x,.82,-bodyLength*.51);
   root.add(lamp);
 }
 root.userData={style,police};
 return root;
}
export function makePerson(color=0xd78f70){const root=new THREE.Group();for(const [geo,c,y] of [[new THREE.CapsuleGeometry(.38,.7,4,8),color,1.25],[new THREE.SphereGeometry(.28,12,10),0xb97657,2.05],[new THREE.BoxGeometry(.62,.82,.3),0x354956,.48]]){const m=new THREE.Mesh(geo,material(c));m.position.y=y;root.add(m)}return root}
// Geometry remains deliberately primitive but every silhouette uses the same warm material palette.
