# The Typescript Game

Typescript editor on the left, gameplay based on types on the right

## Art

Art resizer: https://lospec.com/pixel-art-scaler/

Retro, looks good: https://opengameart.org/content/arcade-platformer-assets
Very, very nice but only one: https://opengameart.org/content/magic-cliffs-environment
https://opengameart.org/content/platformer-tileset-2
Ehh but ok: https://opengameart.org/content/seasonal-platformer-tiles
https://opengameart.org/content/platformer-art-complete-pack-often-updated

Character:
https://opengameart.org/content/gum-bot-sprites

## Level ideas

Perhaps just follow the TS book on types?

`any`

`string`, `number` etc?

`[]`

`function foo(): string {}` and `() => string`

`null` and `undefined`

`{ foo: string }` (and perhaps here or later `{ foo?: string }`)

`number | string`

`"foo" | "bar"`

`Pick`, `Exclude`, `Omit` etc

`typeof`?

React stuff?

## Gameplay ideas

Left to right mover like You Must Build A Boat
a-la jump over: any, then only rocks etc
counter fire monster with ice/water spell a-la function onEncounter(enemy: Monster<Fire>) => Spell<Water>

Bottom to top flight shooter scroller
a-la shoot at: any, then only obstacles etc
