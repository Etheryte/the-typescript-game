import { editor, languages } from "monaco-editor";
import MonacoEditor, { EditorDidMount, EditorWillMount, monaco } from "react-monaco-editor";
import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

import { Level } from "../levels";

import "./editor.scss";

type Monaco = typeof monaco;
type Instance = monaco.editor.IStandaloneCodeEditor;

type Props = {
  level: Level;
  setIsValid: (isValid: boolean) => void;
};

const USER_PATH = "inmemory://user";
const SYSTEM_PATH = "inmemory://system";

export default (props: Props) => {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [controller, setController] = useState<Monaco | null>(null);
  const [userMarkers, setUserMarkers] = useState<monaco.editor.IMarker[]>([]);
  const [levelState, setLevelState] = useState<Partial<ReturnType<typeof props.level.getState>>>({ isValid: false });
  const level = props.level;
  const setIsValid = props.setIsValid;

  // When we receive a new level, reset the state
  useEffect(() => {
    // If the editor is not ready yet, just ignore and go when it is ready
    if (!instance || !controller) {
      return;
    }

    // Throw away old models
    for (const model of controller.editor.getModels()) {
      model.dispose();
    }
    instance.setModel(null);

    // Setup for the current level
    const defaults = controller.languages.typescript.typescriptDefaults;
    defaults.setExtraLibs([
      {
        content: level.context ?? "",
      },
    ]);

    const userModel = editor.createModel(level.text, "typescript", controller.Uri.parse(USER_PATH));
    const systemModel = editor.createModel("", "typescript", controller.Uri.parse(SYSTEM_PATH));

    // Setting the system value on markers isn't enough since we don't get updates when one valid state moves to another a-la copy-paste
    const lodashDebounceChange = debounce(() => {
      console.log("update system");
      // The system model needs to be block scoped off from the user model since we don't use `isolatedModules: true`
      // Could alternatively do `export default {}` here too
      systemModel.setValue(`{
      ;${userModel.getValue()}
      ;${level.validateText}
      }`);
    }, 100);
    const changeListener = userModel.onDidChangeContent(lodashDebounceChange);

    const markersListener = controller.editor.onDidChangeMarkers((uris) => {
      for (const uri of uris) {
        const markers = controller.editor.getModelMarkers({
          resource: uri,
        });
        console.log("markers for " + uri.toString(), markers);
        const path = uri.toString();
        if (path === USER_PATH) {
          setUserMarkers(markers);
          setIsValid(false);
        } else if (path === SYSTEM_PATH) {
          const levelState = level.getState(markers);
          setLevelState(levelState);
          setIsValid(levelState.isValid);
        }
      }
    });

    // TODO: If the level text has a selection, highlight it
    // editor.setSelection(new Selection(5, 16, 5, 19));
    // TODO: We currently load all languages, perhaps we can remove this?

    // Once everything is ready, set the model
    instance.setModel(userModel);

    // console.log(controller.editor.getModels());

    return function cleanup() {
      // Keep hot reload happy
      for (const model of controller.editor.getModels()) {
        model.dispose();
      }
      instance.setModel(null);

      // Remove lingering listeners from the editor
      lodashDebounceChange.cancel();
      changeListener.dispose();
      markersListener.dispose();
    };
  }, [instance, controller, level, setIsValid]);

  const onBeforeMount: EditorWillMount = (controller: Monaco) => {
    const defaults = controller.languages.typescript.typescriptDefaults;
    const baseOptions = defaults.getCompilerOptions();
    const options: languages.typescript.CompilerOptions = {
      // The compiler breaks in the browser without `allowNonTsExtensions: true` ¯\_(ツ)_/¯
      ...baseOptions,
      strict: true,
      // Remove default browser interface definitions etc so we don't get a bunch of unrelated things in autocomplete
      noLib: true,
      // We can't use these lest we ask the user to export the types
      isolatedModules: false,
    };
    defaults.setCompilerOptions(options);
  };

  const onMount: EditorDidMount = (instance: Instance, monaco: Monaco) => {
    setInstance(instance);
    setController(monaco);
  };

  const options: monaco.editor.IStandaloneEditorConstructionOptions = {
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
    language: "typescript",
    // We set a model in `onMount()` instead
    model: null,
    automaticLayout: true,
  };

  const readableMarkers = userMarkers
    .map((marker) => {
      const line = marker.startLineNumber ? `Problem on line ${marker.startLineNumber}: ` : "";
      return `${line}${marker.message}`;
    })
    .join(" ");
  const hasMarkers = !!readableMarkers.length;
  const isValid = !!levelState.isValid;

  const isError = hasMarkers;
  const isWarning = !isError && !isValid;
  const isSuccess = !isWarning;
  const className = isError ? "is-error" : isWarning ? `is-warning` : "is-success";

  return (
    <>
      {/*
      <pre>Level state {JSON.stringify(levelState)}</pre>
      */}
      <div className={`editor-area ${className}`}>
        <MonacoEditor options={options} editorWillMount={onBeforeMount} editorDidMount={onMount} />
        {/*
        <p className={`notification is-error`}>{readableMarkers}</p>
        <p className={`notification is-warning`}>There are no errors, but the solution isn't quite right...</p>
        <p className="notification is-success">All good!</p>
        */}
      </div>
    </>
  );
};
