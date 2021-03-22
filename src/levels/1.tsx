export const context = `
declare type Foo = any;
`;

export const text = `/**
 * Foo bar
 */

type JumpOver = 
`;

export const validateText = `const validate: (JumpOver extends any ? any : never) = true;`;

export const validate = (markers: monaco.editor.IMarker[]) => {
  return true;
};
