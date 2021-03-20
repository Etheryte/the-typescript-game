import Editor, { BeforeMount, OnChange, OnMount, OnValidate } from "@monaco-editor/react";
import { languages, Selection } from "monaco-editor";
import { useEffect, useRef, useState } from "react";

import "./editor.scss";

type Props = {
  text: string;
};

export default (props: Props) => {
  // This is pretty meh but the types aren't exported conveniently
  type OnMountParams = Parameters<OnMount>;
  type Editor = OnMountParams[0];
  type Monaco = OnMountParams[1];

  const editorRef = useRef<Editor>();
  const monacoRef = useRef<Monaco>();

  // Levels start out in unsolved state
  const [hasErrors, setHasErrors] = useState<boolean>(true);

  // When we receive a new level, reset the state
  useEffect(() => {
    reset();
  }, [props.text]);

  const reset = () => {
    setHasErrors(true);
  };

  const onBeforeMount: BeforeMount = (monaco) => {
    monacoRef.current = monaco;
    // A-la monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    const defaults = monaco.languages.typescript.typescriptDefaults;
    const baseOptions = defaults.getCompilerOptions();
    const options: languages.typescript.CompilerOptions = {
      // The compiler breaks in the browser without `allowNonTsExtensions: true` for some reason ¯\_(ツ)_/¯
      ...baseOptions,
      strict: true,
      // Remove default browser interface definitions etc so we don't get a bunch of unrelated things in autocomplete
      noLib: true,
    };
    defaults.setCompilerOptions(options);
    console.log(options);
    // console.log(defaults.workerOptions);

    // Could possibly set extra context and stuff like this
    defaults.setExtraLibs([
      {
        content: "declare type Foo = any;",
      },
    ]);
  };

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // TODO: If the level text has a selection, highlight it
    editor.setSelection(new Selection(5, 16, 5, 19));

    // TODO: Set TS defaults
    // monaco.languages.setLanguageConfiguration("typescript", {});
    // languages.typescript.CompilerOptions
    // languages.typescript.LanguageServiceDefaults.setCompilerOptions(options: CompilerOptions)
    // console.log(monaco.languages.getLanguages());

    // TODO: We currently load all languages, perhaps we can remove this?
    // const typescriptDefaults = monaco.languages.typescript.typescriptDefaults;
    // TODO: getCompilerOptions ??
  };

  function getValue() {
    return editorRef.current?.getValue();
  }

  const onChange: OnChange = (value, event) => {
    // console.log("onChange", value);
  };

  const onValidate: OnValidate = async (markers: monaco.editor.IMarker[]) => {
    // console.log("validate", markers);
    // If markers is an empty array then there's no errors
    setHasErrors(Boolean(markers.length));

    // TODO: Check if the solution matches what we expected
    const monaco = monacoRef.current;
    if (!monaco) {
      return;
    }

    /*
    // No clue why this API is this way
    const getWorker = await monaco.languages.typescript.getTypeScriptWorker();
    const worker = await getWorker();
    console.log(worker);
    */
  };

  // TODO: Remove pointless types from TS?!
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

  return (
    <div className="editor-area">
      <Editor
        className="editor"
        language="typescript"
        options={optons}
        defaultValue={props.text}
        onChange={onChange}
        beforeMount={onBeforeMount}
        onMount={onMount}
        onValidate={onValidate}
        loading=""
      />
    </div>
  );
};
