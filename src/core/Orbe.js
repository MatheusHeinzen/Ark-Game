export class Orbe {
    constructor(x, y, radius, p) {
      this.pos = p.createVector(x, y);
      this.radius = radius;
      this.pulse = 0;
      this.direction = 1;
      this.p = p;
    }
  
    update() {
      // Efeito de pulsação
      this.pulse += this.direction * 0.5;
      if (this.pulse > 10 || this.pulse < -10) {
        this.direction *= -1;
      }
    }
  
    draw() {
      this.p.push();
      this.p.translate(this.pos.x, this.pos.y);
  
      this.p.noFill();
      this.p.stroke(150, 100, 255);
      this.p.strokeWeight(4);
      this.p.ellipse(0, 0, this.radius * 2 + this.pulse);
  
      this.p.fill(255, 100, 255, 150);
      this.p.noStroke();
      this.p.ellipse(0, 0, this.radius + this.pulse / 2);
      this.p.pop();
    }
  
    getPosition() {
      return this.pos.copy();
    }
  }