export class Platform {
    constructor(x, y, w, h, type = 'normal', p) {
      this.pos = p.createVector(x, y);
      this.width = w;
      this.height = h;
      this.type = type; // 'normal' | 'quebradiça' | 'móvel'
      this.broken = false;
      this.timer = 0;
      this.p = p;
  
      if (this.type === 'móvel') {
        this.baseX = x;
        this.amplitude = 50;
      }
    }
  
    update() {
      if (this.type === 'quebradiça') {
        if (this.timer > 0) this.timer++;
        if (this.timer > 60) this.broken = true;
      }
  
      if (this.type === 'móvel') {
        this.pos.x = this.baseX + this.p.sin(this.p.frameCount * 0.05) * this.amplitude;
      }
    }
  
    draw() {
      if (this.broken) return;
  
      this.p.push();
      this.p.translate(this.pos.x, this.pos.y);
      this.p.noStroke();
  
      switch (this.type) {
        case 'quebradiça':
            this.p.fill(255, 100, 100);
          break;
        case 'móvel':
            this.p.fill(100, 255, 255);
          break;
        default:
            this.p.fill(180);
      }
  
      this.p.rectMode(this.p.CENTER);
      this.p.rect(0, 0, this.width, this.height);
      this.p.pop();
    }
  
    isColliding(player) {
      if (this.broken) return false;
  
      const px = player.pos.x;
      const py = player.pos.y + player.size / 2; // pé do player
  
      return (
        px > this.pos.x - this.width / 2 &&
        px < this.pos.x + this.width / 2 &&
        py > this.pos.y - this.height / 2 &&
        py < this.pos.y + this.height / 2
      );
    }
  
    onTouch() {
      if (this.type === 'quebradiça' && this.timer === 0) {
        this.timer = 1;
      }
    }
  }