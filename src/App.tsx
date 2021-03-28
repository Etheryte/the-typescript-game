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
        {level.description}
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
