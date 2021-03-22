// import Editor, { BeforeMount, EditorProps, OnChange, OnMount } from "@monaco-editor/react";
import { languages } from "monaco-editor";
import MonacoEditor, { EditorDidMount, EditorWillMount } from "react-monaco-editor";
import { useEffect, useRef, useState } from "react";

import { Level } from "../levels";

import "./editor.scss";

type Props = {
  level: Level;
};

const USER_PATH = "inmemory://user";
const SYSTEM_PATH = "inmemory://system";

export default (props: Props) => {
  const editorElement = useRef<HTMLDivElement>();

  const userEditorRef = useRef<typeof monaco.editor>();
  const userMonacoRef = useRef<typeof monaco>();

  const systemEditorRef = useRef<typeof monaco.editor>();
  const systemMonacoRef = useRef<typeof monaco>();

  // Levels start out in unsolved state
  const [markers, setMarkers] = useState<monaco.editor.IMarker[]>([]);

  // When we receive a new level, reset the state
  useEffect(() => {
    // TODO: Reset
  }, [props.level]);

  /*
  const getMarkers = (path: string) => {
    // TODO: This should be a ref
    // The types are wrong here, both `monaco` and `monaco.editor` are undefined at first
    const currentMarkers: monaco.editor.IMarker[] | undefined =
      monaco?.editor?.getModelMarkers({
        resource: monaco.Uri.parse(path),
      }) || undefined;
    return currentMarkers;
  };

  // TODO: This is really shit and slow, can we do something else here?
  // TODO: Try `onDidChangeMarkers`
  // There's a bug in Monaco when getting markers with multiple editors, see // Check https://github.com/suren-atoyan/monaco-react/issues/182
  useInterval(() => {
    const userMarkers = getMarkers(USER_PATH);
    // If the editor isn't ready yet, do nothing
    if (typeof userMarkers === "undefined") {
      return;
    }
    // If there's user-code errors, show those
    if (userMarkers.length) {
      setMarkers(userMarkers);
      return;
    }
    // Once there's no user-code errors, set the value to the system UI and validate the level
    // TODO: Implement
    setMarkers([]);
  }, 1000);
  */

  const onBeforeMount: EditorWillMount = (monaco) => {
    monaco.editor.onDidChangeMarkers((uris) => {
      for (const uri of uris) {
        console.log("fire from", uri.toString());
      }
    });

    const defaults = monaco.languages.typescript.typescriptDefaults;
    const baseOptions = defaults.getCompilerOptions();
    const options: languages.typescript.CompilerOptions = {
      // The compiler breaks in the browser without `allowNonTsExtensions: true` ¯\_(ツ)_/¯
      ...baseOptions,
      strict: true,
      // Remove default browser interface definitions etc so we don't get a bunch of unrelated things in autocomplete
      noLib: true,
    };
    defaults.setCompilerOptions(options);
    // console.log(options);
    // console.log(defaults.workerOptions);

    // TODO: Update when level changes
    // Could possibly set extra context and stuff like this
    defaults.setExtraLibs([
      {
        content: props.level.context,
      },
    ]);
  };

  const onMount: EditorDidMount = (instance, monaco) => {
    const model = monaco.editor.createModel(props.level.text, "typescript", monaco.Uri.parse(USER_PATH));
    instance.setModel(model);

    console.log(monaco.editor.getModels());

    // TODO: If the level text has a selection, highlight it
    // editor.setSelection(new Selection(5, 16, 5, 19));
    // TODO: We currently load all languages, perhaps we can remove this?
    // const typescriptDefaults = monaco.languages.typescript.typescriptDefaults;
    // TODO: getCompilerOptions ??
    // No clue why this API is this way
    /*
    const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
    const tempModel = monaco.editor.createModel("const foo: string = 32", "typescript");
    console.log("model", tempModel);
    const worker = await getWorker(tempModel.uri);
    console.log("worker", worker);
    const result = await worker.getEmitOutput(tempModel.uri.toString());
    console.log(result);
    console.log(await worker.getSyntacticDiagnostics(tempModel.uri.toString()));
    */
  };

  function getValue() {
    // return userEditorRef.current?.getValue();
  }

  const onUserChange = (value) => {
    // systemEditorRef.current?.setValue(value ?? "");
  };

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
    // The default editor has a lot of distractions
    /*
    minimap: {
      enabled: false,
    },
    contextmenu: false,
    lightbulb: {
      enabled: false,
    },
    folding: false,
    showUnused: false,
    inlineHints: {
      enabled: false,
    },
    */
    model: null,
  };

  return (
    <>
      <pre>{JSON.stringify(markers)}</pre>
      <div className="editor-area">
        <MonacoEditor
          options={options}
          editorWillMount={onBeforeMount}
          editorDidMount={onMount}
          language="typescript"
        />
      </div>
    </>
  );
};
