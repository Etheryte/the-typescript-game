import Editor, { BeforeMount, EditorProps, OnMount, OnValidate } from "@monaco-editor/react";
import { languages } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

import { Level } from "../levels";

import "./editor.scss";

type Props = {
  level: Level;
};

export default (props: Props) => {
  // This is pretty meh but the types aren't exported conveniently
  type OnMountParams = Parameters<OnMount>;
  type Editor = OnMountParams[0];
  type Monaco = OnMountParams[1];

  const userEditorRef = useRef<Editor>();
  const userMonacoRef = useRef<Monaco>();

  const systemEditorRef = useRef<Editor>();
  const systemMonacoRef = useRef<Monaco>();

  // Levels start out in unsolved state
  const [markers, setMarkers] = useState<monaco.editor.IMarker[]>([]);

  // When we receive a new level, reset the state
  useEffect(() => {
    // TODO: Reset
  }, [props.level]);

  const onBeforeMount: BeforeMount = (monaco) => {
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

  const onMount: OnMount = async (editor, monaco) => {
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
    return userEditorRef.current?.getValue();
  }

  const onUserValidate: OnValidate = async (markers: monaco.editor.IMarker[]) => {
    console.log("user validate", markers);
    // If there's user-code errors, show those
    if (markers.length) {
      setMarkers(markers);
      return;
    }

    // Once there's no user-code errors, set the value to the system UI and validate the level
  };

  const onSystemValidate: OnValidate = async (markers: monaco.editor.IMarker[]) => {
    console.log("system validate?!", markers);
    // setHasErrors(Boolean(markers.length));
  };

  const optons: monaco.editor.IEditorOptions = {
    // The default editor has a lot of distractions
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
  };

  const baseProps: EditorProps = {
    language: "typescript",
    options: optons,
    loading: "",
  };

  return (
    <div className="editor-area">
      <pre>{JSON.stringify(markers)}</pre>
      <Editor
        {...baseProps}
        className="editor"
        defaultValue={props.level.text}
        beforeMount={(monaco) => {
          userMonacoRef.current = monaco;
          return onBeforeMount(monaco);
        }}
        onMount={(editor, monaco) => {
          console.log("user mount");
          userEditorRef.current = editor;
          return onMount(editor, monaco);
        }}
        onValidate={(markers) => {
          console.log("call?", markers);
          return onUserValidate(markers);
        }}
        onChange={(foo) => console.log(foo)}
      />
      <div className="is-not-hidden">
        <Editor
          {...baseProps}
          beforeMount={(monaco) => {
            systemMonacoRef.current = monaco;
            return onBeforeMount(monaco);
          }}
          onMount={(editor, monaco) => {
            console.log("system mount");
            systemEditorRef.current = editor;
            return onMount(editor, monaco);
          }}
          onValidate={onSystemValidate}
        />
      </div>
    </div>
  );
  /*
  
   */
};
