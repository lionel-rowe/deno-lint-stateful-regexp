# Deno Lint Stateful RegExp [![JSR](https://jsr.io/badges/@li/deno-lint-stateful-regexp)](https://jsr.io/@li/deno-lint-stateful-regexp)

`stateful-regexp/stateful-regexp` disallows the use of stateful regular expressions at the top (module) level. See the corresponding [ESLint proposal](https://github.com/eslint/eslint/issues/8088) for rationale.

Examples of **incorrect** code for this rule:

```ts
const STATEFUL_RE1 = /./g
const STATEFUL_RE2 = new RegExp('.', 'g')
const STATEFUL_RE3 = /./y
```

Examples of **correct** code for this rule:

```ts
const STATELESS_RE = /./i
function foo() {
    const re = /./g
    return re.exec('a')
}
const getStatefulRe = () => /./g
```
