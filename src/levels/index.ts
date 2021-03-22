import * as level1 from "./1";

// See https://stackoverflow.com/a/57447842/1470607
type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

const levels = [level1];

export type Level = ArrayElement<typeof levels>;

export default levels;
