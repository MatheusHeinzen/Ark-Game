import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useP5Sketch } from '../hooks/useP5Sketch';
import { Orbe } from '../core/Orbe';
import { Platform } from '../core/Platform';
import { Player } from '../core/Player';

export default function Game({ onGameEnd, onGameOver }) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [transitioning, setTransitioning] = useState(false);
  const startTimeRef = useRef(null);
  const bgMusicRef = useRef(null); // Referência para o elemento de áudio

  // Efeito para controlar a música de fundo
  useEffect(() => {
    // Cria o elemento de áudio
    bgMusicRef.current = new Audio('/assets/ArkPursuit.mp3');
    bgMusicRef.current.volume = 0.05; // Define o volume para 30% (ajuste conforme necessário)
    bgMusicRef.current.loop = true;

    // Inicia a música quando os assets estiverem carregados
    if (assetsLoaded) {
      bgMusicRef.current.play().catch(error => {
        console.error("Erro ao reproduzir música:", error);
      });
    }

    // Limpeza ao desmontar o componente
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.currentTime = 0;
      }
    };
  }, [assetsLoaded]);

  const sketch = useCallback((p) => {
    let orbe, platforms, player, bgImage;
    let lives = 3;

    const levelConfigs = {
      1: { platformCount: 200, obstacleSpeed: 0.3, spacing: 80 },
      2: { platformCount: 180, obstacleSpeed: 0.5, spacing: 90 },
      3: { platformCount: 160, obstacleSpeed: 0.8, spacing: 100 },
    };

    const loadAssets = async () => {
      try {
        console.log("Iniciando o carregamento dos assets...");
        bgImage = await p.loadImage('/assets/bgDestroços.png');
        console.log("Imagem de fundo carregada.");

        orbe = new Orbe(40, p);
        await orbe.setupObstacles();
        console.log("Órbita configurada.");

        setupLevel(currentLevel);
        setAssetsLoaded(true);
        console.log("Todos os assets foram carregados.");
      } catch (error) {
        console.error("Erro ao carregar assets:", error);
      }
    };

    const setupLevel = (level) => {
      const config = levelConfigs[level];
      platforms = [];
    
      // Plataforma inicial fixa
      platforms.push(new Platform(400, 780, 0, 800, 40, 'asfalto', p));
    
      // Lista para armazenar plataformas quebradiças que precisam de móveis
      const quebradicasComMoveis = [];
    
      // Primeiro passada: cria todas as plataformas normais e identifica quebradiças
      for (let i = 0; i < config.platformCount; i++) {
        const x = p.random(100, 700);
        const y = 700 - i * config.spacing;
        const type = i % 3 === 0 ? 'quebradiça' : i % 8 === 0 ? 'móvel' : 'normal';
        
        if (type === 'quebradiça') {
          quebradicasComMoveis.push(y);
        }
        
        platforms.push(new Platform(x, y, type === 'móvel' ? 0.5 : 0, 100, 30, type, p));
      }
    
      // Segunda passada: adiciona plataformas móveis para cada quebradiça
      quebradicasComMoveis.forEach(y => {
        const jaTemMovel = platforms.some(plat => plat.y === y && plat.type === 'móvel');
        
        if (!jaTemMovel) {
          const x = p.random(100, 700);
          platforms.push(new Platform(x, y, 0.5, 100, 30, 'móvel', p));
        }
      });
    
      // Configura obstáculos
      orbe.obstacles.forEach((obs) => {
        obs.speed = config.obstacleSpeed;
      });
    
      player = new Player(p, 400, 700, lives);
    };

    const transitionToNextLevel = () => {
      setTransitioning(true);
      setTimeout(() => {
        setTransitioning(false);
        setCurrentLevel((prev) => prev + 1);
        setupLevel(currentLevel + 1);
      }, 2000);
    };

    p.setup = async () => {
      console.log("Carregando assets...");
      await loadAssets();
      if (!assetsLoaded) {
        console.error("Erro: Assets não foram carregados corretamente.");
        return;
      }

      p.createCanvas(800, 600);
      if (!startTimeRef.current) {
        startTimeRef.current = p.millis();
      }
      console.log("Assets carregados com sucesso.");
    };


    p.draw = () => {
      if (!assetsLoaded || !orbe || !platforms || !player || !startTimeRef.current) return;

      try {
        p.background(20);

        // Transição de nível
        if (transitioning) {
          p.fill(0, 150);
          p.rect(0, 0, p.width, p.height);
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(`Nível ${currentLevel + 1}`, p.width / 2, p.height / 2);
          return;
        }

        // Calcula o deslocamento da câmera
        let cameraOffset = Math.min(0, p.height / 2 - player.pos.y);

        // Desenha o fundo ajustado ao deslocamento da câmera
        if (bgImage) {
          p.push();
          p.tint(255, 150);
          p.image(bgImage, -9, cameraOffset + 220, p.width, p.height);
          p.pop();
        }

        // Aplica o deslocamento da câmera
        p.push();
        p.translate(0, cameraOffset);

        // Exibe o cronômetro usando o startTimeRef
        const elapsedTime = Math.floor((p.millis() - startTimeRef.current) / 1000);
        p.fill(255);
        p.textSize(20);
        p.text(`Tempo: ${elapsedTime}s`, 10, -cameraOffset + 30);
        p.text(`Vidas: ${player.lives}`, p.width - 100, -cameraOffset + 30);

        orbe.update(player);
        orbe.draw();

        platforms.forEach((platform) => {
          platform.update(orbe.getPosition());
          platform.draw();
        });

        player.update(platforms, orbe.getPosition());
        player.draw();

        p.pop();

        if (p.keyIsDown(p.LEFT_ARROW)) player.moveLeft();
        if (p.keyIsDown(p.RIGHT_ARROW)) player.moveRight();
        if (p.keyIsDown(p.UP_ARROW)) player.jump();

        if (player.touches(orbe)) {
          const elapsedTime = Math.floor((p.millis() - startTimeRef.current) / 1000);
          if (currentLevel < 3) {
            transitionToNextLevel();
          } else {
            onGameEnd(elapsedTime);
          }
        }

        if (player.lives <= 0) {
          const elapsedTime = Math.floor((p.millis() - startTimeRef.current) / 1000);
          onGameOver(elapsedTime);
        }
      } catch (error) {
        console.error('Erro no draw:', error);
      }
    };
  }, [assetsLoaded, currentLevel, transitioning, onGameEnd, onGameOver]);

  const sketchRef = useP5Sketch(sketch);

  return (
    <div ref={sketchRef} style={{ width: '100%', height: '100%' }}>
      {transitioning && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.8)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '32px' }}>
          Transição para o próximo nível...
        </div>
      )}
    </div>
  );
}