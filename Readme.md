# Ark Game 🪐 — Jogo em P5.js inspirado em Titanfall 2

Jogo inspirado no universo de **Titanfall** e na missão final de **Titanfall 2**.

Desenvolvido como projeto para a disciplina **Web Development: HTML5 Canvas & Games**.

---

## 🎮 Sinopse

Após a batalha de Typhon, a arma dobrável conhecida como **Arca** foi ativada — uma tecnologia capaz de destruir planetas quando utilizada em sua potência máxima.

A Milícia está prestes a usá-la com força total, e parte da cidade já foi destruída.  
Você é o último piloto presente.

Salte por plataformas, desvie de destroços sendo puxados pela órbita da Arca e contenha-a antes que ela destrua todo o sistema.

---

## 🛠️ Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [P5.js](https://p5js.org/)

---

## 🚀 Como Jogar

Se você clonou o repositório, siga os passos abaixo para rodar o jogo localmente:

```bash
npm install
npm install p5
npm start
```

Ou, se preferir, jogue diretamente via GitHub Pages:

👉 Link do jogo no GitHub Pages (em breve)

## 🧩 Organização do Código
O código está estruturado em componentes React:

- ```Intro.jsx``` : Animação e lógica da introdução do jogo.

- ```Game.jsx``` : Lógica principal do jogo, incluindo controle de fases e integração com outros componentes.

- ```Orbe.js``` , ```Platform.js``` , ```Player.js``` : Classes com a lógica de cada entidade do jogo.

- ```App.jsx``` : Gerencia os estágios do jogo (início, meio e fim) e como são apresentados ao jogador.