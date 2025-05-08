import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';

export default function Intro({ onFinish }) {
  const canvasRef = useRef();
  const planetRef = useRef();
  const [showPlanet, setShowPlanet] = useState(false);

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
        p.text("Você é o último piloto em Typhon capaz de a contêr.", 50, 200);
        p.text("Salte até ela e esteja preparado.", 50, 250);
        p.text("Use as teclas ← ↑ → para jogar.", 50, 450);

        if (alpha < 255) alpha += 2;
        timer++;

        if (timer === 100) setShowPlanet(true); // Após ~5 segundos

        if (timer > 650) {
          p.remove();
          onFinish();
        }
      };
    };

    new p5(sketch);
  }, [onFinish]);

  useEffect(() => {
    if (!showPlanet) return;

    const sketch = (p) => {
      let angle = 0;
      let posX = -900;
      const radius = 100;
      const ringInner = 130;
      const ringOuter = 180;

      p.setup = () => {
        p.createCanvas(800, 600, p.WEBGL).parent(planetRef.current);
        p.noStroke();
      };

      p.draw = () => {
        p.background(0, 0);
        p.directionalLight(255, 255, 255, 1, 0, -1);
        p.ambientLight(60);

        posX += 4.5;
        if (posX > p.width + 200) p.noLoop();

        p.push();
        p.translate(posX - p.width / 3, 0, 0);
        p.rotateZ(angle);
        angle += 0.002;

        // Corpo do planeta
        p.push();
        p.ambientMaterial(230, 210, 100);
        p.sphere(radius);
        p.pop();

        // Anéis
        p.push();
        p.rotateX(p.HALF_PI - 0.1);
        p.ambientMaterial(200, 140, 0);
        p.beginShape(p.TRIANGLE_STRIP);
        for (let a = 0; a <= p.TWO_PI + 0.9; a += 0.3) {
          const x1 = ringInner * p.cos(a);
          const y1 = ringInner * p.sin(a);
          const x2 = ringOuter * p.cos(a);
          const y2 = ringOuter * p.sin(a);
          p.vertex(x1, y1, 0);
          p.vertex(x2, y2, 0);
        }
        p.endShape();
        p.pop();

        p.pop();
      };
    };

    const planetSketch = new p5(sketch);
    return () => planetSketch.remove();
  }, [showPlanet]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={canvasRef} />
      {showPlanet && (
        <div
          ref={planetRef}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '800px',
            height: '600px',
            pointerEvents: 'none',
            zIndex: 100,
          }}
        />
      )}
    </div>
  );
}