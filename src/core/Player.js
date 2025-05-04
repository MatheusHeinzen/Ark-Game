export class Player {
  constructor(p, x, y) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vy = 0;
    this.gravity = 0.6;
    this.jump = -12;
    this.onGround = false;
  }

  update(platforms = []) {
    this.vy += this.gravity;
    this.pos.y += this.vy;
    this.onGround = false;

    platforms.forEach(platform => {
      if (platform.isColliding(this)) {
        this.landOn(platform);
        platform.onTouch();
      }
    });
  }

  landOn(platform) {
    this.vy = 0;
    this.onGround = true;
    this.pos.y = platform.pos.y - platform.height / 2 - 15; // ajusta base do jogador
  }

  draw() {
    this.p.fill(200, 100, 255);
    this.p.ellipse(this.pos.x, this.pos.y, 30, 30);
  }

  handleKey(key) {
    if (key === ' ' && this.onGround) {
      this.vy = this.jump;
    }
  }

  touches(orbe) {
    return this.pos.dist(orbe.getPosition()) < orbe.radius;
  }

  reset() {
    this.pos = this.p.createVector(100, 500);
    this.vy = 0;
  }
}
