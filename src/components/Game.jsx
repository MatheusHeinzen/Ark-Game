import React, { useState, useCallback } from 'react';
import { useP5Sketch } from '../hooks/useP5Sketch';
import { Orbe } from '../core/Orbe';
import { Platform } from '../core/Platform';
import { Player } from '../core/Player';

export default function Game({ onGameEnd }) {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  const sketch = useCallback((p) => {
    let orbe, platforms, player;

    const loadAssets = async () => {
      try {
        orbe = new Orbe(0, 0, 40, p);
        await orbe.setupObstacles();
    
        platforms = [
          // Piso inicial como asfalto
          new Platform(400, 580, 0, 800, 40, 'asfalto', p), // Asfalto no chão
          new Platform(200, 450, 0.5, 100, 30, 'normal', p),
          new Platform(350, 300, 0.3, 100, 30, 'quebradiça', p),
          new Platform(500, 200, 0.2, 100, 30, 'móvel', p),
          new Platform(650, 150, 0.4, 100, 30, 'normal', p),
        ];
    
        for (const platform of platforms) {
          await platform.preload();
        }
    
        player = new Player(p, 100, 500);
        setAssetsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar assets:', error);
      }
    };

    p.setup = async () => {
      await loadAssets();
      if (!assetsLoaded) return;
    
      p.createCanvas(800, 600);
      orbe.x = p.width / 2;
      orbe.y = 50; // Posição no topo da tela
      player.pos.y = 540; // Ajusta a posição inicial do jogador para o asfalto
    };

    p.draw = () => {
      if (!assetsLoaded || !orbe || !platforms || !player) return;
    
      try {
        p.background(20);
        orbe.update();
        orbe.draw();
    
        platforms.forEach((platform) => {
          platform.update(orbe.getPosition());
          platform.draw();
        });
    
        player.update(platforms, orbe.getPosition());
        player.draw();
    
        if (p.keyIsDown(p.LEFT_ARROW)) player.moveLeft();
        if (p.keyIsDown(p.RIGHT_ARROW)) player.moveRight();
    
        // Verifica se o jogador alcançou a órbita
        if (player.touches(orbe)) {
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