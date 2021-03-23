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
export const validateText = `const validate: (JumpOver extends any ? any : never) = true;`;

export const validate = (markers: monaco.editor.IMarker[]) => {
  return true;
};
