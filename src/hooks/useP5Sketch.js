import { useEffect, useRef } from 'react';
import p5 from 'p5';

export const useP5Sketch = (sketch) => {
  const sketchRef = useRef();
  const p5Instance = useRef();

  useEffect(() => {
    if (!sketch || !sketchRef.current) return;

    const initP5 = () => {
      try {
        // Verifica se o p5 está disponível
        if (typeof p5 === 'undefined') {
          throw new Error('p5.js not loaded');
        }

        // Limpa qualquer instância existente
        if (p5Instance.current) {
          p5Instance.current.remove();
          p5Instance.current = null;
        }

        // Cria nova instância com tratamento de erros
        p5Instance.current = new p5((p) => {
          try {
            sketch(p);
          } catch (sketchError) {
            console.error('Sketch execution error:', sketchError);
            p.noLoop();
          }
        }, sketchRef.current);

      } catch (initError) {
        console.error('p5 initialization error:', initError);
      }
    };

    // Adia a inicialização para garantir que o DOM está pronto
    const timer = setTimeout(initP5, 100);
    
    return () => {
      clearTimeout(timer);
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [sketch]);

  return sketchRef;
};