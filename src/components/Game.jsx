import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Orbe } from '../core/Orbe';
import { Platform } from '../core/Platform';
import { Player } from '../core/Player';

let bgDestrocos;
let orbe;
let platforms = [];
let player;



export default function Game({ onGameEnd }) {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(800, 600);
        orbe = new Orbe(p.width / 2,  p.height / 2 -200, 40, p);
        player = new Player(p, 100, 500);
        

        platforms = [
          new Platform(300, 400, 100, 20, 'normal', p),
          new Platform(500, 300, 100, 20, 'quebradiça', p),
          new Platform(200, 200, 100, 20, 'móvel', p),
          new Platform(100, 600, 1500, 20, 'normal', p),
        ];
      };

      p.draw = () => {
        p.background(20);


        orbe.update();
        orbe.draw();

        platforms.forEach((platform) => {
          platform.update();
          platform.draw();

          
        });


        player.update(platforms);
        player.draw();

        // Verifica se o jogador alcançou a orbe
        if (player?.pos && orbe) {
          if (player.pos.dist(orbe.getPosition()) < orbe.radius) {
            onGameEnd();
          }
        }
      };

      p.keyPressed = () => {
        if (p.keyCode === p.UP_ARROW) {
          console.log("Tecla UP pressionada");
          player.jump();
        }
      };
    };

    const P5 = require('p5');
    const instance = new p5(sketch, sketchRef.current);

    return () => {
      instance.remove();
    };
  }, [onGameEnd]);

  return <div ref={sketchRef}></div>;
}