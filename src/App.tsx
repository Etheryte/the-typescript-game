import { useState } from "react";
import Editor from "./components/Editor";
import Game from "./components/Game";
import levels from "./levels";

import "./app.scss";

function App() {
  const [level, setLevel] = useState(levels[0]);
  const [isValid, setIsValid] = useState(false);

  return (
    <>
      <section className="app-section">
        <h1>The Typescript Game</h1>
        <p>
          Welcome to the Typescript Game. Typescript is a programming language that helps you write good code by
          checking the types of things for you.
        </p>
        <p>
          In Typescript, the broadest type to allow anything is called <code>any</code>.
        </p>
        <p>
          Use the type <code>any</code> to tell the hero to jump over anything in their way!
        </p>
        <p>
          Level {levels.indexOf(level) + 1} of {levels.length}.
        </p>
        <Editor level={level} setIsValid={setIsValid} />
      </section>
      <section className="app-section" role="presentation">
        <Game isValid={isValid} />
      </section>
    </>
  );
}

export default App;
