import Phaser, { Game } from "phaser";
import { useCallback, useEffect, useRef } from "react";

function preload(this: any) {
  this.load.setBaseURL("https://labs.phaser.io");

  this.load.image("sky", "assets/skies/space3.png");
  this.load.image("logo", "assets/sprites/phaser3-logo.png");
  this.load.image("red", "assets/particles/red.png");
}

function create(this: any) {
  this.add.image(400, 300, "sky");

  var particles = this.add.particles("red");

  var emitter = particles.createEmitter({
    speed: 100,
    scale: { start: 1, end: 0 },
    blendMode: "ADD",
  });

  var logo = this.physics.add.image(400, 100, "logo");

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);

  emitter.startFollow(logo);
}

export default () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) {
      return;
    }
    const config: Phaser.Types.Core.GameConfig = {
      parent: container.current,
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 200 },
        },
      },
      scene: {
        preload: preload,
        create: create,
      },
    };

    const game = new Phaser.Game(config);

    return function cleanup() {
      game.destroy(true);
    };
  }, [container]);

  return <div id="game" ref={container} />;
};
