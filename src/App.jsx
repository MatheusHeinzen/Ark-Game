import React, { useState } from 'react';
import Intro from './components/Intro';
import Game from './components/Game';

export default function App() {
  const [stage, setStage] = useState('intro'); // intro | game | end | gameOver
  const [gameTime, setGameTime] = useState(0); // Armazena o tempo final

  const startGame = () => {
    setStage('game');
    setGameTime(0); // Reseta o tempo ao iniciar novo jogo
  };

  const endGame = (finalTime) => {
    setGameTime(finalTime);
    setStage('end');
  };

  const gameOver = (finalTime) => {
    setGameTime(finalTime);
    setStage('gameOver');
  };

  // Função para formatar o tempo (segundos) em MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {stage === 'intro' && <Intro onFinish={startGame} />}
      {stage === 'game' && <Game onGameEnd={endGame} onGameOver={gameOver} />}
      {stage === 'end' && (
        <div style={{ textAlign: 'center' }}>
          <h1>Parabéns, piloto!</h1>
          <p>Você estabilizou a órbita e salvou o mundo em {formatTime(gameTime)}. 🌍</p>
          <button onClick={startGame}>Jogar Novamente</button>
        </div>
      )}
      {stage === 'gameOver' && (
        <div style={{ textAlign: 'center' }}>
          <h1>Game Over!</h1>
          <p>Você foi atingido por um obstáculo após {formatTime(gameTime)}.</p>
          <button onClick={startGame}>Jogar Novamente</button>
        </div>
      )}
    </>
  );
}