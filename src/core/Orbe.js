export class Orbe {
  constructor(radius, p) {
    this.x = 400;
    this.y = 100; // Centraliza a órbita
    this.radius = radius;
    this.angle = 0;
    this.particles = [];
    this.obstacles = [];
    this.p = p;
    this.obstacleImgs = [];

    for (let i = 0; i < 50; i++) {
      this.particles.push({
        radius: p.random(60, 120),
        angle: p.random(360),
        size: p.random(3, 8),
        speed: p.random(0.5, 1.5),
      });
    }
  }

  async setupObstacles() {
    this.obstacles = [];
    
    // Carrega as imagens de forma assíncrona
    try {
      const obstacle1 = await this.p.loadImage('/assets/obstacle1.png');
      const obstacle2 = await this.p.loadImage('/assets/obstacle2.png');
      const obstacle3 = await this.p.loadImage('/assets/obstacle3.png');
      this.obstacleImgs = [obstacle1, obstacle2, obstacle3];
    } catch (e) {
      console.error("Erro ao carregar imagens:", e);
      return;
    }
  
    // Configura os obstáculos
    for (let i = 0; i < 8; i++) {
      this.obstacles.push({
        img: this.p.random(this.obstacleImgs),
        orbitRadius: this.p.random(200, 300),
        angle: this.p.random(360),
        speed: this.p.random(0.3, 0.8),
        size: this.p.random(30, 60),
      });
    }
  }
  

  getPosition() {
    return this.p.createVector(this.x, this.y);
  }

  update(player) {
    this.angle += 1.5;
    for (let d of this.particles) {
      d.angle += d.speed;

      const particlesX = this.x + this.p.cos(d.angle) * d.radius;
      const particlesY = this.y + this.p.sin(d.angle) * d.radius;
      const distance = this.p.dist(particlesX, particlesY, player.pos.x, player.pos.y);

      if (distance < player.radius + d.size / 2) {
      }
    }

    this.obstacles.forEach(obs => {
      obs.angle += obs.speed;

      const obsX = this.x + this.p.cos(obs.angle) * obs.orbitRadius;
      const obsY = this.y + this.p.sin(obs.angle) * obs.orbitRadius;
      const distance = this.p.dist(obsX, obsY, player.pos.x, player.pos.y);

      if (distance < player.radius + obs.size / 2) {
        console.log('Jogador atingido por obstáculo!');
        player.takeDamage();
      }
    });
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
    for (let d of this.particles) {
      let x = p.cos(d.angle) * d.radius;
      let y = p.sin(d.angle) * d.radius;
      p.ellipse(x, y, d.size);
    }
  
    // Desenha os obstáculos
    this.obstacles.forEach(obs => {
      obs.angle += obs.speed;
  
      p.push();
      const x = p.cos(obs.angle) * obs.orbitRadius;
      const y = p.sin(obs.angle) * obs.orbitRadius;
  
      p.imageMode(p.CENTER);
      if (obs.img) {
        p.image(obs.img, x, y, obs.size, obs.size);
      }
      p.pop();
    });
  
    p.pop();
  }
}
