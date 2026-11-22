// Small local particles make impacts, skids and shots visible without shaders
// or post-processing. Every temporary mesh is removed when its short life ends.
export class BayEffects {
  constructor(scene, canvas) {
    this.scene = scene;
    this.canvas = canvas;
    this.particles = [];
    this.shake = 0;
    this.damage = 0;
    this.lastSkid = 0;
    this.flashTime = 0;
  }

  burst(x, y, z, color = 0xffcc79, count = 9, power = 4) {
    for (let index = 0; index < count; index += 1) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.055, 5, 4),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
      );
      mesh.position.set(x, y, z);
      this.scene.add(mesh);
      this.particles.push({
        mesh,
        life: 0.35 + Math.random() * 0.35,
        maxLife: 0.7,
        velocity: new THREE.Vector3((Math.random() - 0.5) * power, Math.random() * power * 0.65, (Math.random() - 0.5) * power)
      });
    }
    this.shake = Math.max(this.shake, count > 12 ? 0.42 : 0.12);
  }

  muzzle(x, y, z) {
    this.burst(x, y, z, 0xffe297, 5, 1.6);
    this.flashTime = 0.09;
  }

  crash(x, y, z) {
    this.burst(x, y, z, 0xff995d, 16, 6);
    this.burst(x, y + 0.3, z, 0xffe3ad, 7, 3.2);
    this.shake = 0.52;
  }

  skid(x, y, z, heading) {
    const sideX = Math.cos(heading) * 1.1;
    const sideZ = -Math.sin(heading) * 1.1;
    this.burst(x + sideX, y + 0.08, z + sideZ, 0x77726b, 2, 0.35);
    this.burst(x - sideX, y + 0.08, z - sideZ, 0x77726b, 2, 0.35);
    this.lastSkid = 0.12;
  }

  damageState(health) {
    this.damage = THREE.MathUtils.clamp(1 - health / 100, 0, 1);
    return {
      smoke: this.damage > 0.58,
      dents: this.damage > 0.72,
      vignette: this.damage > 0.35 ? this.damage : 0
    };
  }

  update(dt, speed = 0, health = 100, heading = 0, position = null) {
    this.lastSkid = Math.max(0, this.lastSkid - dt);
    this.flashTime = Math.max(0, this.flashTime - dt);
    this.damageState(health);
    if (speed > 32 && position && this.lastSkid === 0) this.skid(position.x, 0.12, position.z, heading);

    for (const particle of this.particles) {
      particle.life -= dt;
      particle.mesh.position.addScaledVector(particle.velocity, dt);
      particle.velocity.y -= 5 * dt;
      const alpha = Math.max(0, particle.life / particle.maxLife);
      particle.mesh.material.opacity = alpha;
      particle.mesh.scale.setScalar(Math.max(0.1, alpha));
    }

    const expired = this.particles.filter(particle => particle.life <= 0);
    for (const particle of expired) this.scene.remove(particle.mesh);
    this.particles = this.particles.filter(particle => particle.life > 0);
    this.shake = Math.max(0, this.shake - dt);
    this.canvas.style.transform = this.shake
      ? `translate(${(Math.random() - 0.5) * this.shake * 10}px,${(Math.random() - 0.5) * this.shake * 8}px)`
      : '';
    const lines = speed > 36 ? 'saturate(1.08) contrast(1.04)' : '';
    const red = this.damage > 0.35 ? ` drop-shadow(0 0 ${Math.round(this.damage * 8)}px rgba(115,30,25,${this.damage * 0.3}))` : '';
    const flash = this.flashTime > 0 ? ` brightness(${1 + this.flashTime * 1.6})` : '';
    this.canvas.style.filter = `${lines}${red}${flash}`.trim();
  }
}

// Crash bursts and camera shake are bounded; a long drive does not retain old meshes.
