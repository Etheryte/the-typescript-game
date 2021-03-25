import { useState } from "react";
import Editor from "./components/Editor";
import Game from "./components/Game";
import levels from "./levels";

import "./app.scss";

function App() {
  const [level, setLevel] = useState(levels[0]);
  return (
    <>
      <section className="app-section">
        <h1>The Typescript Game</h1>
        <p>
          Welcome to the Typescript Game. Typescript adds strict types to Javascript. Types tell you that todo text goes
          here.
        </p>
        <p>
          Level {levels.indexOf(level) + 1} of {levels.length}.
        </p>
        <Editor level={level} />
      </section>
      <section className="app-section" role="presentation">
        <Game />
      </section>
    </>
  );
}

export default App;
