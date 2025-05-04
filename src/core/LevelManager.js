import { Player } from './Player';
import { Orbe } from './Orbe';
import { Platform } from './Platform';

const LevelManager = {
  createPlayer(p) {
    return new Player(100, 500, 500);
  },

  createOrbe(p) {
    return new Orbe(p / 2, p / 2, 40, p);
  },

  createPlatforms(p, level) {
    const platforms = [];
    for (let i = 0; i < level * 5; i++) {
      platforms.push(new Platform(
        p,
        p.random(100, 700),
        p.random(200, 550),
        p.random(60, 100),
        true, // breakable
        level >= 2
      ));
    }
    return platforms;
  }
};

export default LevelManager;
