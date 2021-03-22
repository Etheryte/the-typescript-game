import Editor, { BeforeMount, EditorProps, OnMount } from "@monaco-editor/react";
import { languages } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

import useInterval from "../useInterval";
import { Level } from "../levels";

import "./editor.scss";

type Props = {
  level: Level;
};

const USER_PATH = "file://user";
const SYSTEM_PATH = "file://system";

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

  const getMarkers = (path: string) => {
    // The types are wrong here, both `monaco` and `monaco.editor` are undefined at first
    const currentMarkers: monaco.editor.IMarker[] | undefined =
      monaco?.editor?.getModelMarkers({
        resource: monaco.Uri.parse(path),
      }) || undefined;
    return currentMarkers;
  };

  // TODO: This is really shit and slow, can we do something else here?
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
        path={USER_PATH}
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
      />
      <div className="is-not-hidden">
        <Editor
          {...baseProps}
          path={SYSTEM_PATH}
          beforeMount={(monaco) => {
            systemMonacoRef.current = monaco;
            return onBeforeMount(monaco);
          }}
          onMount={(editor, monaco) => {
            console.log("system mount");
            systemEditorRef.current = editor;
            return onMount(editor, monaco);
          }}
        />
      </div>
    </div>
  );
};
