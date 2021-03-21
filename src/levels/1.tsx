export const context = `
declare type Foo = any;
`;

export const text = `/**
 * Foo bar
 */

type Allowed = 
`;

export default {
  context,
  text,
};
