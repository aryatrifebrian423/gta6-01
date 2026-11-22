// Smooth follow framing keeps the avenue visible while preserving a readable
// near shoulder view on foot. Mission starts briefly widen the shot.
const damp = (current, target, rate, dt) => current + (target - current) * (1 - Math.exp(-rate * dt));

export class BayCamera {
  constructor(camera) {
    this.camera = camera;
    this.position = new THREE.Vector3(0, 7, 13);
    this.lookAt = new THREE.Vector3(0, 1, 0);
    this.cinematic = 0;
    this.cinematicOrigin = null;
    this.lastYaw = 0;
    this.initialized = false;
    this.lookBack = false;
  }

  frameMission() {
    this.cinematic = 2.4;
    this.cinematicOrigin = this.position.clone();
  }

  setLookBack(enabled) {
    this.lookBack = Boolean(enabled);
  }

  update(player, dt) {
    const inCar = Boolean(player.car);
    const speed = Math.abs(player.car?.speed || 0);
    const followDistance = inCar ? 8.3 + Math.min(3.2, speed * 0.055) : 5.1;
    const shoulder = inCar ? 2.8 : 1.9;
    const height = inCar ? 4.2 + Math.min(1.4, speed * 0.025) : 3.1;
    const forwardX = Math.sin(player.yaw);
    const forwardZ = Math.cos(player.yaw);
    const cameraDirection = this.lookBack ? -1 : 1;
    const targetPosition = new THREE.Vector3(
      player.x - forwardX * followDistance * cameraDirection + Math.cos(player.yaw) * shoulder,
      height,
      player.z - forwardZ * followDistance * cameraDirection - Math.sin(player.yaw) * shoulder
    );
    const targetLook = new THREE.Vector3(
      player.x + forwardX * (inCar ? 5.5 : 2.4) * cameraDirection,
      inCar ? 1.15 : 1.55,
      player.z + forwardZ * (inCar ? 5.5 : 2.4) * cameraDirection
    );

    if (!this.initialized) {
      this.position.copy(targetPosition);
      this.lookAt.copy(targetLook);
      this.initialized = true;
    }

    this.position.x = damp(this.position.x, targetPosition.x, inCar ? 3.1 : 5.4, dt);
    this.position.y = damp(this.position.y, targetPosition.y, 3.2, dt);
    this.position.z = damp(this.position.z, targetPosition.z, inCar ? 3.1 : 5.4, dt);
    this.lookAt.x = damp(this.lookAt.x, targetLook.x, 5.2, dt);
    this.lookAt.y = damp(this.lookAt.y, targetLook.y, 5.2, dt);
    this.lookAt.z = damp(this.lookAt.z, targetLook.z, 5.2, dt);

    if (this.cinematic > 0) {
      this.cinematic = Math.max(0, this.cinematic - dt);
      const amount = Math.sin((2.4 - this.cinematic) / 2.4 * Math.PI);
      const widerPosition = targetPosition.clone().add(new THREE.Vector3(-forwardX * 3, 2.4, -forwardZ * 3));
      this.position.lerp(widerPosition, amount * 0.18);
    }

    this.lastYaw = player.yaw;
    this.camera.position.copy(this.position);
    this.camera.lookAt(this.lookAt);
  }
}

// Exponential damping uses frame time, so the camera feel stays stable on varied displays.
