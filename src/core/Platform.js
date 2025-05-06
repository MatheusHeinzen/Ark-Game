export class Platform {
  constructor(x, y, speed, width, height, type, p) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = width;
    this.height = height;
    this.type = type;
    this.p = p;
    this.img = null; // Apenas para tipos que usam imagens
  }

  async preload() {
    if (this.type !== 'asfalto') {
      try {
        const imgName = `platform_${this.type}.png`;
        this.img = await this.p.loadImage(`/assets/${imgName}`);
      } catch (error) {
        console.error('Erro ao carregar imagem da plataforma:', error);
        this.img = null;
      }
    }
  }

  update(orbePosition) {
    if (this.type === 'móvel') {
      this.x += this.speed;
      if (this.x < 0 || this.x > this.p.width) {
        this.speed *= -1;
      }
    }
  }

  draw() {
    const p = this.p;
    if (this.type === 'asfalto') {
      // Desenha o asfalto diretamente com p5.js
      p.fill(50); // Cor cinza escuro
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      p.fill(255, 255, 0); // Faixa amarela
      p.rect(this.x - this.width / 2, this.y - 5, this.width, 5);
    } else if (this.img) {
      // Desenha plataformas com imagens
      p.imageMode(p.CENTER);
      p.image(this.img, this.x, this.y, this.width, this.height);
    } else {
      // Desenha plataformas padrão
      p.fill(100);
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
  }

  isColliding(player) {
    const px = player.pos.x;
    const py = player.pos.y + player.radius; // Considera o raio do jogador (parte inferior)
    const top = this.y - this.height / 2; // Topo da plataforma
    const bottom = this.y + this.height / 2; // Base da plataforma
    const left = this.x - this.width / 2; // Lado esquerdo da plataforma
    const right = this.x + this.width / 2; // Lado direito da plataforma
  
    // Verifica se o jogador está dentro dos limites da plataforma
    return px > left && px < right && py > top && py < bottom && player.vy > 0;
  }
}