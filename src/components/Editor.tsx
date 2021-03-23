import { editor, languages } from "monaco-editor";
import MonacoEditor, { EditorDidMount, EditorWillMount, monaco } from "react-monaco-editor";
import { useEffect, useState } from "react";

import { Level } from "../levels";

import "./editor.scss";

type Monaco = typeof monaco;
type Instance = monaco.editor.IStandaloneCodeEditor;

type Props = {
  level: Level;
};

const USER_PATH = "inmemory://user";
const SYSTEM_PATH = "inmemory://system";

export default (props: Props) => {
  const [instance, setInstance] = useState<Instance | null>(null);
  const [controller, setController] = useState<Monaco | null>(null);
  const [userMarkers, setUserMarkers] = useState<monaco.editor.IMarker[]>([]);

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

    const markersListener = controller.editor.onDidChangeMarkers((uris) => {
      for (const uri of uris) {
        const markers = controller.editor.getModelMarkers({
          resource: uri,
        });
        console.log("markers for " + uri.toString(), markers);
        if (uri.toString() === USER_PATH) {
          setUserMarkers(markers);
        }
        // TODO: Set system content once there's no markers for user
        // TODO: Validate level based on system markers
      }
    });

    const defaults = controller.languages.typescript.typescriptDefaults;
    // TODO: Update when level changes
    // Could possibly set extra context and stuff like this
    defaults.setExtraLibs([
      {
        content: props.level.context ?? "",
      },
    ]);

    const userModel = editor.createModel(props.level.text, "typescript", controller.Uri.parse(USER_PATH));
    const systemModel = editor.createModel("", "typescript", controller.Uri.parse(SYSTEM_PATH));
    instance.setModel(userModel);
    console.log(editor.getModels());

    // TODO: If the level text has a selection, highlight it
    // editor.setSelection(new Selection(5, 16, 5, 19));
    // TODO: We currently load all languages, perhaps we can remove this?

    return function cleanup() {
      // Keep hot reload happy
      for (const model of controller.editor.getModels()) {
        model.dispose();
      }
      instance.setModel(null);
      markersListener.dispose();
    };
  }, [instance, controller, props.level]);

  const onBeforeMount: EditorWillMount = (controller: Monaco) => {
    const defaults = controller.languages.typescript.typescriptDefaults;
    const baseOptions = defaults.getCompilerOptions();
    const options: languages.typescript.CompilerOptions = {
      // The compiler breaks in the browser without `allowNonTsExtensions: true` ¯\_(ツ)_/¯
      ...baseOptions,
      strict: true,
      // Remove default browser interface definitions etc so we don't get a bunch of unrelated things in autocomplete
      noLib: true,
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
    // We set a model in `onMount()`
    model: null,
  };

  const readableMarkers = userMarkers.map((marker) => {
    const line = marker.startLineNumber ? `Line ${marker.startLineNumber}: ` : "";
    return `${line}${marker.message}`;
  });

  return (
    <>
      <pre>{readableMarkers || ""}</pre>
      <div className="editor-area">
        <MonacoEditor options={options} editorWillMount={onBeforeMount} editorDidMount={onMount} />
      </div>
    </>
  );
};
