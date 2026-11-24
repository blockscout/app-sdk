# Blockscout App SDK

A React library, published to npm as `@blockscout/app-sdk`, that gives a dApp transaction toasts and a
transaction history popup backed by Blockscout. `src/package/` is what is published. `src/app/` is a demo
app for development and is not part of the package.

There are no unit tests. The checks are the scripts in `package.json`, and the Checks workflow runs them
all.

## What comes from home

The home repo, [`blockscout/frontend-home`](https://github.com/blockscout/frontend-home), holds the developer
tools and configs this repo shares with the other frontend repositories. It is a dev dependency installed
from GitHub and pinned by commit. A wrong finding or a missing feature is fixed in home, and then the pin
is moved here.

| What                   | Runs as                                                                                                        | Context in home                                                                                                         | Configuration here                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| The cspell base config | `pnpm lint:cspell`, the pre-commit hook, and a step of the Checks workflow                                     | [the cspell config context](https://github.com/blockscout/frontend-home/blob/main/configs/cspell/CONTEXT.md)            | `cspell.jsonc` at the repo root: the import, `gitignoreRoot`, the ignored paths and the words only this repo uses                 |
| `code-complexity`      | `pnpm test:code-complexity`, and a step of the Checks workflow that gates the functions a pull request changes | [the `code-complexity` context](https://github.com/blockscout/frontend-home/blob/main/tools/code-complexity/CONTEXT.md) | `code-complexity.config.json` at the repo root: the scope and the two cognitive caps. `"coverage": false` keeps the CRAP half off |
| `home-bump`            | `pnpm home:bump [<commit-or-ref>]`, then commit the three files it changes                                     | [the pin context](https://github.com/blockscout/frontend-home/blob/main/tools/home-bump/CONTEXT.md)                     | None                                                                                                                              |

- **A full `pnpm test:code-complexity` run fails today.** One callback in
  `src/package/components/tx-toast/useTxToast.tsx` is over its cap and is left as it is. The workflow
  reports it only when a pull request changes it, and the fix then is to decompose it, not to move the cap.
