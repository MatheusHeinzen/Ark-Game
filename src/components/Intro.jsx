import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

export default function Intro({ onFinish }) {
  const canvasRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let timer = 0;
      let alpha = 0;

      p.setup = () => {
        p.createCanvas(800, 600).parent(canvasRef.current);
        p.textFont('monospace');
      };

      p.draw = () => {
        p.background(10, 10, 30);
        p.fill(255, alpha);
        p.textSize(24);
        p.text("Ano 2705... A Batalha de Tifão parece estar perdida.", 50, 100);
        p.text("Uma orbe instável chamada de Arca atrai tudo ao redor.", 50, 150);
        p.text("Você é o último piloto em Typhon capaz de a contêr. ", 50, 200);
        p.text("Salte até ela e esteja preparado.", 50, 250);

        if (alpha < 255) alpha += 2;
        timer++;

        if (timer > 400) {
          p.remove();
          onFinish();
        }
      };
    };

    new p5(sketch);
  }, [onFinish]);

  return <div ref={canvasRef}></div>;
}