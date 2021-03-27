import Phaser from "phaser";
import { useEffect, useRef } from "react";

// TODO: Phaser seems pretty fat, perhaps Pixi instead? https://pixijs.io/examples/#/tilemaps/basic.js

// TODO: See https://phaser.io/examples/v3/view/animation/60fps-animation-test
// TODO: See https://stackoverflow.com/a/58381474/1470607 for resizing

function preload(this: Phaser.Scene) {
  this.load.setBaseURL("https://labs.phaser.io");

  this.load.image("sky", "assets/skies/space3.png");
  this.load.image("logo", "assets/sprites/phaser3-logo.png");
  this.load.image("red", "assets/particles/red.png");
}

function create(this: Phaser.Scene) {
  this.add.image(400, 300, "sky");

  var logo = this.physics.add.image(400, 100, "logo");

  logo.setVelocity(100, 200);
  logo.setBounce(1, 1);
  logo.setCollideWorldBounds(true);
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
      width: "90%",
      height: "90%",
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
