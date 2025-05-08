import React, { useState } from 'react';
import Intro from './components/Intro';
import Game from './components/Game';

export default function App() {
  const [stage, setStage] = useState('intro'); // intro | game | end | gameOver

  const startGame = () => setStage('game');
  const endGame = () => setStage('end');
  const gameOver = () => setStage('gameOver'); // Adiciona estado de game over

  return (
    <>
      {stage === 'intro' && <Intro onFinish={startGame} />}
      {stage === 'game' && <Game onGameEnd={endGame} onGameOver={gameOver} />} {/* Passa onGameOver */}
      {stage === 'end' && (
        <div style={{ textAlign: 'center' }}>
          <h1>Parabéns, piloto!</h1>
          <p>Você estabilizou a órbita e salvou o mundo. 🌍</p>
          <button onClick={() => setStage('game')}>Jogar Novamente</button>
        </div>
      )}
      {stage === 'gameOver' && (
        <div style={{ textAlign: 'center' }}>
          <h1>Game Over!</h1>
          <p>Você foi atingido por um obstáculo e perdeu todas as vidas.</p>
          <button onClick={() => setStage('game')}>Jogar Novamente</button>
        </div>
      )}
    </>
  );
}