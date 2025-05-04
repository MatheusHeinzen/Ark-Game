export class Orbe {
  constructor(x, y, radius, p) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = 0;
    this.debris = [];
    this.obstacles = [];
    this.p = p;
    this.obstacleImgs = [];

    for (let i = 0; i < 50; i++) {
      this.debris.push({
        radius: p.random(60, 120),
        angle: p.random(360),
        size: p.random(3, 8),
        speed: p.random(0.5, 1.5),
      
      });
    }
  }

  preload() {
    try {
      this.obstacleImgs = [
        this.p.loadImage('/assets/obstacle1.png'),
        this.p.loadImage('/assets/obstacle2.png'),
        this.p.loadImage('/assets/obstacle3.png')
      ];
    } catch (e) {
      console.error("Erro ao carregar imagens:", e);
    }
  }
  setupObstacles() {
    for (let i = 0; i < 8; i++) {
      this.obstacles.push({
        img: this.p.random(this.obstacleImgs),
        orbitRadius: this.p.random(200, 300), // Aumentado de 120-200 para 200-300
        angle: this.p.random(360),
        speed: this.p.random(0.3, 0.8),
        size: this.p.random(30, 60)
      });
    }
  }

  getPosition() {
    return this.p.createVector(this.x, this.y);
  }

  update() {
    this.angle += 1.5;
    for (let d of this.debris) {
      d.angle += d.speed;
    }
  }

  draw() {
    const p = this.p;
    p.push();
    p.translate(this.x, this.y);
    p.angleMode(p.DEGREES);

    // Aura giratória
    p.push();
    p.rotate(this.angle);
    for (let i = 0; i < 10; i++) {
      let r = 80 + p.sin(this.angle + i * 36) * 10;
      p.fill(40, 0, 80, 100);
      p.ellipse(p.cos(i * 36) * r, p.sin(i * 36) * r, 60, 20);
    }
    p.pop();

    // Núcleo
    p.fill(100, 100, 255);
    p.ellipse(0, 0, 80, 80);

    // Brilho externo
    for (let i = 0; i < 5; i++) {
      p.fill(100, 100, 255, 40 - i * 8);
      p.ellipse(0, 0, 130 + i * 15);
    }

    p.fill(180, 100, 255);
    for (let d of this.debris) {
      let x = p.cos(d.angle) * d.radius;
      let y = p.sin(d.angle) * d.radius;
      p.ellipse(x, y, d.size);
    }

    p.pop();
    
    // Desenha obstáculos orbitais
    this.obstacles.forEach(obs => {
      p.push();
      const x = p.cos(obs.angle) * obs.orbitRadius;
      const y = p.sin(obs.angle) * obs.orbitRadius;
      
      p.rotate(obs.angle);
      if (obs.img) {
        p.imageMode(p.CENTER);
        p.image(obs.img, x, y, obs.size, obs.size);
      }
      p.pop();
    });

    
  }
}
