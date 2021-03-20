import Editor, { OnChange, OnMount, OnValidate } from "@monaco-editor/react";
import { Selection } from "monaco-editor";
import { useRef } from "react";

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

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // TODO: If the level text has a selection, highlight it
    editor.setSelection(new Selection(5, 16, 5, 19));

    // TODO: Set TS defaults
    // monaco.languages.setLanguageConfiguration("typescript", {});
    // languages.typescript.CompilerOptions
    // languages.typescript.LanguageServiceDefaults.setCompilerOptions(options: CompilerOptions)
    // console.log(monaco.languages.getLanguages());

    // TODO: We currently load all languages, perhaps we can remove this?
  };

  function getValue() {
    return editorRef.current?.getValue();
  }

  const onChange: OnChange = (value, event) => {
    console.log("onChange", value);
  };

  const onValidate: OnValidate = (markers: monaco.editor.IMarker[]) => {
    console.log("validate", markers);
    // TODO: If markers is an empty array then there's no errors
    // TODO: Check if the solution matches what we expected
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
        onMount={onMount}
        onValidate={onValidate}
        loading=""
      />
    </div>
  );
};
