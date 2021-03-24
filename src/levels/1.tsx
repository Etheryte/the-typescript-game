export const context = `
declare type Foo = any;
`;

export const text = `/**
 * Foo bar
 */

type JumpOver = 
`;

// TODO: How to figure out where to start validation?
// Could intentionally create a greppable error a-la `const Marker: never = 42;`

// This works for basic types, but not `any`:
// const validate: (boolean extends JumpOver ? any : never) = true;
export const validateText = `
// See https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
type Equals<X, Y> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? true : false;

const validate: Equals<JumpOver, any> = true;`;

export const validate = (markers: monaco.editor.IMarker[]) => {
  // The level is valid if we have exactly one error and it's that `validate` is unused
  return markers.length === 1 && markers[0].code === "6133";
};
