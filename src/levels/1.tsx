import { monaco } from "react-monaco-editor";

export const context = ``;

export const text = `
/**
 * This is a type definition.
 * Similar to variables, you can declare types and assign values to them.
 * This specific type tells the hero what kind of objects to jump over.
 */
type JumpOver = 
`;

export const validateText = `
// See https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
type Equals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

const validate: Equals<JumpOver, any> = true;`;

export const getState = (markers: monaco.editor.IMarker[]) => {
  return {
    // The level is valid if we have exactly one error and it's that `validate` is unused
    isValid: markers.length === 1 && markers[0].message === "'validate' is declared but its value is never read.",
  };
};
