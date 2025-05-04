export class Player {
    constructor(p, x, y) {
      this.p = p;
      this.x = x;
      this.y = y;
      this.vy = 0;
      this.gravity = 0.6;
      this.jump = -12;
      this.onGround = false;
    }
  
    update(p, platforms, orbe) {
      this.vy += this.gravity;
      this.y += this.vy;
  
      this.onGround = false;
      for (let plat of platforms) {
        if (this.x > plat.x && this.x < plat.x + plat.w &&
            this.y + 20 >= plat.y && this.y + 20 <= plat.y + 10) {
          this.vy = 0;
          this.onGround = true;
          this.y = plat.y - 20;
        }
      }
    }
  
    display(p) {
      p.fill(200, 100, 255);
      p.ellipse(this.x, this.y, 30, 30);
    }
  
    handleKey(key) {
      if (key === ' ' && this.onGround) {
        this.vy = this.jump;
      }
    }
  
    touches(orbe) {
      return this.p.dist(this.x, this.y, orbe.x, orbe.y) < 40;
    }
  
    reset() {
      this.x = 100;
      this.y = 500;
      this.vy = 0;
    }
  }