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
    this.isBroken = false; // Indica se a plataforma está quebrada
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
    if (this.isBroken) return; // Não desenha a plataforma se estiver quebrada

    const p = this.p;

    if (this.type === 'asfalto') {
      // Desenha o asfalto padrão
      p.fill(50); // Cor cinza escuro
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      p.fill(255, 255, 0); // Faixa amarela
      p.rect(this.x - this.width / 2, this.y - 5, this.width, 5);
    } else if (this.type === 'normal') {
      // Plataforma normal com rachaduras na base
      p.fill(50); // Cor cinza escuro
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      p.fill(255, 255, 0); // Faixa amarela
      p.rect(this.x - this.width / 2 + 10, this.y - this.height / 2 + 5, this.width - 20, 5); // Faixa amarela no topo
      p.stroke(30); // Rachaduras na base
      for (let i = 0; i < 3; i++) {
        const startX = this.x - this.width / 2 + i * (this.width / 3);
        const endX = startX + this.width / 6;
        p.line(startX, this.y + this.height / 2, endX, this.y + this.height / 2 + 10);
      }
      p.noStroke();
    } else if (this.type === 'quebradiça') {
      // Plataforma quebradiça com uma grande rachadura no meio
      p.fill(50); // Cor cinza escuro
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      p.fill(255, 255, 0); // Faixa amarela
      p.rect(this.x - this.width / 2 + 10, this.y - this.height / 2 + 5, this.width - 20, 5); // Faixa amarela no topo
      p.stroke(80); // Rachadura vermelha no meio
      p.line(this.x, this.y - this.height / 2, this.x, this.y + this.height / 2);
      p.noStroke();
    } else if (this.type === 'móvel') {
      // Plataforma móvel com partículas de movimento
      p.fill(50); // Cor cinza escuro
      p.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
      p.fill(255, 255, 0); // Faixa amarela
      p.rect(this.x - this.width / 2 + 10, this.y - this.height / 2 + 5, this.width - 20, 5); // Faixa amarela no topo
    }
  }

  isColliding(player) {
    if (this.isBroken) return false; // Não colide se a plataforma estiver quebrada

    const px = player.pos.x;
    const py = player.pos.y + player.radius; // Considera o raio do jogador (parte inferior)
    const top = this.y - this.height / 2; // Topo da plataforma
    const bottom = this.y + this.height / 2; // Base da plataforma
    const left = this.x - this.width / 2; // Lado esquerdo da plataforma
    const right = this.x + this.width / 2; // Lado direito da plataforma
  
    // Verifica se o jogador está dentro dos limites da plataforma
    return px > left && px < right && py > top && py < bottom && player.vy > 0;
  }

  break() {
    if (this.type === 'quebradiça' && !this.isBroken) {
      console.log("Plataforma quebradiça começando a quebrar...");
      setTimeout(() => {
        this.isBroken = true; // Marca a plataforma como quebrada após o atraso
        console.log("Plataforma quebradiça quebrou!");
      }, 1000); // Atraso de 1 segundo
    }
  }
}