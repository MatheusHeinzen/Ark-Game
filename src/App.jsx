import React, { useState } from 'react';
import Intro from './components/Intro';
import Game from './components/Game';

export default function App() {
  const [stage, setStage] = useState('intro'); // intro | game | end

  const startGame = () => setStage('game');
  const endGame = () => setStage('end');

  return (
    <>
      {stage === 'intro' && <Intro onFinish={startGame} />}
      {stage === 'game' && <Game onGameEnd={endGame} />}
      {stage === 'end' && (
        <div style={{ textAlign: 'center' }}>
          <h1>Parabéns, piloto!</h1>
          <p>Você estabilizou a órbita e salvou o mundo. 🌍</p>
          <button onClick={() => setStage('game')}>Jogar Novamente</button>
        </div>
      )}
    </>
  );
}