import { useState } from "react";
import Editor from "./components/Editor";
import levels from "./levels";

function App() {
  const [level, setLevel] = useState(levels[0]);
  return (
    <>
      <h1>The Typescript Game</h1>
      <p>
        Welcome to the Typescript Game. Typescript adds strict types to Javascript. Types tell you that todo text goes
        here.
      </p>
      <p>
        Level {levels.indexOf(level) + 1} of {levels.length}.
      </p>
      <Editor text={level.text} />
    </>
  );
}

export default App;
