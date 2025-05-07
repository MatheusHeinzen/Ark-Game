export class Player {
  constructor(p, x, y, lives) {
    this.p = p; // Armazena a instância do p5
    this.pos = p.createVector(x, y);
    this.radius = 20;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 0.5;
    this.jumpForce = -12;
    this.isJumping = false;
    this.lives = lives; // Armazena o número de vidas
  }

  update(platforms, orbePosition) {
    // Aplica gravidade
    this.vy += this.gravity;
    this.pos.y += this.vy;
  
    // Aplica movimento horizontal
    this.pos.x += this.vx;
  
    // Colisão com plataformas
    let onGround = false;
    platforms.forEach(platform => {
      if (platform.isColliding(this)) {
        this.pos.y = platform.y - platform.height / 2 - this.radius; // Reposiciona o jogador no topo da plataforma
        this.vy = 0; // Zera a velocidade vertical
        onGround = true; // Define que o jogador está no chão
  
        // Quebra a plataforma se for do tipo quebradiça
        platform.break();
      }
    });
  
    this.isJumping = !onGround; // Atualiza o estado de pulo
  
    // Limita o jogador à tela
    this.pos.x = this.p.constrain(this.pos.x, this.radius, this.p.width - this.radius);
  }


  landOn(platform) {
    this.vy = 0;
    this.isJumping = false; // Atualiza o estado para indicar que o jogador está no chão
    this.pos.y = platform.y - platform.height / 2 - this.radius; // Reposiciona o jogador no topo da plataforma
  }

  draw() {
    this.drawPlayer(this.pos.x, this.pos.y);
  }

  drawPlayer(x, y) {
    // Sombra
    this.p.noStroke();
    this.p.fill(0, 60);
    this.p.ellipse(x, y + 30, 15 * 1.6, 10);
  
    // Capacete
    this.p.fill(50, 50, 100);
    this.p.rect(x - 10, y - 32, 20, 22, 5); // base
    this.p.fill(0, 200, 255);
    this.p.rect(x - 6, y - 26, 12, 6); // visor principal
  
    this.p.fill(255);
    this.p.rect(x - 2, y - 26, 2, 5); // reflexo no visor
  
    // Antena no capacete
    this.p.stroke(100, 200, 255);
    this.p.strokeWeight(2);
    this.p.line(x + 8, y - 32, x + 8, y - 42);
    this.p.noStroke();
  
    // Ombreiras
    this.p.fill(90, 90, 130);
    this.p.rect(x - 13, y - 10, 6, 10); // esquerda
    this.p.rect(x + 7, y - 10, 6, 10); // direita
  
    // Peitoral
    this.p.fill(50, 50, 110);
    this.p.rect(x - 9, y - 10, 18, 22, 3);
  
    // Detalhes do peito
    this.p.fill(255, 100, 0);
    this.p.rect(x - 3, y, 2, 3);
    this.p.fill(0, 255, 100);
    this.p.rect(x + 2, y, 2, 3);
  
    // Cinto
    this.p.fill(60, 30, 0);
    this.p.rect(x - 10, y + 8, 20, 4);
    this.p.fill(255, 180, 0);
    for (let i = -8; i <= 6; i += 4) {
      this.p.rect(x + i, y + 8, 2, 4);
    }
  
    // Braços
    this.p.fill(50, 50, 100);
    this.p.rect(x - 15, y, 4, 10); // esquerdo
    this.p.rect(x + 11, y, 4, 10); // direito
  
    // Luvas
    this.p.fill(0);
    this.p.rect(x - 15, y + 10, 4, 3);
    this.p.rect(x + 11, y + 10, 4, 3);
  
    // Pernas
    this.p.fill(70, 70, 140);
    this.p.rect(x - 7, y + 13, 6, 14); // esquerda
    this.p.rect(x + 1, y + 13, 6, 14); // direita
  
    // Botas
    this.p.fill(30);
    this.p.rect(x - 7, y + 26, 6, 4);
    this.p.rect(x + 1, y + 26, 6, 4);
  }
  

  jump() {
    console.log("Tentando pular. onGround:", this.isJumping === false);
    if (!this.isJumping) {
      this.vy = this.jumpForce;
      this.isJumping = true; // Define como pulando
    }
  }

  moveLeft() {
    this.pos.x -= 5;
  }

  moveRight() {
    this.pos.x += 5;
  }

  touches(orbe) {
    return this.pos.dist(orbe.getPosition()) < orbe.radius;
  }

  reset() {
    this.pos = this.p.createVector(100, 500);
    this.vy = 0;
  }

  takeDamage() {
    console.log('O jogador foi atingido!');
    this.lives--; // Reduz a propriedade 'lives' da instância do jogador
    if (this.lives <= 0) {
      console.log('Game Over!');
      this.p.noLoop(); // Para o jogo
    }
  }

}

