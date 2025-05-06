export class Platform {
  constructor(orbitRadius, angle, speed, w, h, type = 'normal', p) {
    try {
      this.p = p;
      if (!p) throw new Error('p5 instance is required');
      
      this.orbitRadius = orbitRadius;
      this.angle = angle;
      this.speed = speed;
      this.width = w;
      this.height = h;
      this.type = type;
      this.broken = false;
      this.timer = 0;
      this.pos = p.createVector(0, 0);
      this.img = null;
      this.rotation = 0;
    } catch (error) {
      console.error('Platform constructor error:', error);
      throw error;
    }
  }

  preload() {
    try {
      const imgName = `obstacle${this.type === 'quebradiça' ? '1' : this.type === 'móvel' ? '2' : '3'}`;
      this.img = this.p.loadImage(`./assets/${imgName}.png`);
      
      // Fallback para imagens ausentes
      this.img.onerror = () => {
        console.warn(`Failed to load: ${imgName}.png`);
        this.img = null;
      };
    } catch (error) {
      console.error('Platform preload error:', error);
      this.img = null;
    }
  }

  update(orbePosition) {
    if (this.broken) return;
    
    this.angle += this.speed;
    this.rotation += this.speed * 0.5; // Rotação adicional para efeito visual
    
    this.pos.x = orbePosition.x + this.p.cos(this.angle) * this.orbitRadius;
    this.pos.y = orbePosition.y + this.p.sin(this.angle) * this.orbitRadius;

    if (this.type === 'quebradiça' && this.timer > 0) {
      this.timer++;
      if (this.timer > 60) this.broken = true;
    }
  }

  draw() {
    if (this.broken) return;
  
    this.p.push();
    this.p.translate(this.pos.x, this.pos.y);
    this.p.rotate(this.rotation);
    
    if (this.img) {
      this.p.imageMode(this.p.CENTER);
      this.p.image(this.img, 0, 0, this.width, this.height);
    } else {
      // Fallback visual
      this.p.rectMode(this.p.CENTER);
      this.p.fill(this.type === 'quebradiça' ? '#ff6464' : 
                 this.type === 'móvel' ? '#64ff64' : '#6464ff');
      this.p.rect(0, 0, this.width, this.height);
    }
    
    this.p.pop();
  }
  
  isColliding(player) {
    if (!player || !player.pos || this.broken) return false;
  
    // Calcula os limites considerando a rotação (simplificado)
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    const dentroX = player.pos.x + player.radius > this.pos.x - halfWidth &&
                    player.pos.x - player.radius < this.pos.x + halfWidth;
    
    const tocandoTopo = player.pos.y + player.radius > this.pos.y - halfHeight &&
                        player.pos.y + player.vy <= this.pos.y - halfHeight;
  
    return dentroX && tocandoTopo;
  }

  
    onTouch() {
      if (this.type === 'quebradiça' && this.timer === 0) {
        this.timer = 1;
      }
    }
  }