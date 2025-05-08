import React, { useState, useCallback } from 'react';
import { useP5Sketch } from '../hooks/useP5Sketch';
import { Orbe } from '../core/Orbe';
import { Platform } from '../core/Platform';
import { Player } from '../core/Player';

export default function Game({ onGameEnd }) {
  const [assetsLoaded, setAssetsLoaded] = useState(false); 

  const sketch = useCallback((p) => {
    let orbe, platforms, player, bgImage;
    let startTime;
    let lives = 50; // Número inicial de vidas

    const loadAssets = async () => {
      try {
        console.log("Iniciando o carregamento dos assets...");
        bgImage = await p.loadImage('/assets/bgDestroços.png');
        console.log("Imagem de fundo carregada.");

        orbe = new Orbe(40, p);
        await orbe.setupObstacles();
        console.log("Órbita configurada.");

        platforms = [];

        // Adiciona a plataforma inicial fixa (asfalto seguro)
        platforms.push(new Platform(400, 780, 0, 800, 40, 'asfalto', p)); // Plataforma fixa no chão

        const platformCount = 80; // Número de plataformas adicionais
        for (let i = 0; i < platformCount; i++) {
          const x = p.random(100, 700); // Posição horizontal aleatória
          const y = 700 - i * 80; // Posição vertical ajustada (subindo mais suavemente)
          const type = i % 3 === 0 ? 'quebradiça' : i % 5 === 0 ? 'móvel' : 'normal'; // Alterna os tipos
          platforms.push(new Platform(x, y, type === 'móvel' ? 0.5 : 0, 100, 30, type, p));
        }

        console.log("Plataformas configuradas.");

        player = new Player(p, 400, 700, lives); // Jogador começa no centro inferior
        console.log("Jogador inicializado.");

        setAssetsLoaded(true);
        console.log("Todos os assets foram carregados.");
      } catch (error) {
        console.error("Erro ao carregar assets:", error);
      }
    };

    p.setup = async () => {
      console.log("Carregando assets...");
      await loadAssets(); // Aguarda o carregamento dos assets
      if (!assetsLoaded) {
        console.error("Erro: Assets não foram carregados corretamente.");
        return;
      }
    
      p.createCanvas(800, 600); // Cria o canvas após carregar os assets
      startTime = p.millis(); // Marca o início do jogo
      console.log("Assets carregados com sucesso.");
    };
    
    p.draw = () => {
      if (!assetsLoaded || !orbe || !platforms || !player) return; // Garante que os assets estão carregados

      try {
        p.background(20);

        // Calcula o deslocamento da câmera
        let cameraOffset = Math.min(0, p.height / 2 - player.pos.y);

        // Desenha o fundo ajustado ao deslocamento da câmera
        if (bgImage) {
          p.push();
          p.tint(255, 150);
          p.image(bgImage, -9, cameraOffset+220, p.width, p.height);
          p.pop();
        }

        // Aplica o deslocamento da câmera
        p.push();
        p.translate(0, cameraOffset);

        // Exibe o cronômetro
        const elapsedTime = Math.floor((p.millis() - startTime) / 1000); // Tempo em segundos
        p.fill(255);
        p.textSize(20);
        p.text(`Tempo: ${elapsedTime}s`, 10, -cameraOffset + 30); // Ajusta a posição do texto com base no deslocamento
        p.text(`Vidas: ${player.lives}`, p.width - 100, -cameraOffset + 30);

        orbe.update(player);
        orbe.draw();

        platforms.forEach((platform) => {
          platform.update(orbe.getPosition());
          platform.draw();
        });

        player.update(platforms, orbe.getPosition());
        player.draw();

        p.pop(); // Restaura o estado do canvas

        if (p.keyIsDown(p.LEFT_ARROW)) player.moveLeft();
        if (p.keyIsDown(p.RIGHT_ARROW)) player.moveRight();
        if (p.keyIsDown(p.UP_ARROW)) player.jump();

        if (player.touches(orbe)) {
          console.log("Jogador alcançou a órbita");
          onGameEnd();
        }
      } catch (error) {
        console.error('Erro no draw:', error);
      }
    };
    

    p.keyPressed = () => {
      if (p.key === ' ') player.jump();
    };
  }, [assetsLoaded, onGameEnd]);

  const sketchRef = useP5Sketch(sketch);

  return <div ref={sketchRef} style={{ width: '100%', height: '100%' }} />;
}