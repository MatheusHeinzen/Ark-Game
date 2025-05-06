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
          new Platform(200, 0, 0.5, 100, 30, 'normal', p),
          new Platform(250, 90, 0.3, 100, 30, 'quebradiça', p),
          new Platform(300, 180, 0.2, 100, 30, 'móvel', p),
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
      orbe.y = p.height / 2 - 200;
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

        if (player.pos.dist(orbe.getPosition()) < orbe.radius) {
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