# fesch

[![npm](https://flat.badgen.net/npm/license/fesch)](https://www.npmjs.org/package/fesch)
[![npm](https://flat.badgen.net/npm/v/fesch)](https://www.npmjs.org/package/fesch)
[![CI](https://img.shields.io/github/actions/workflow/status/idleberg/node-fesch/default.yml?style=flat-square)](https://github.com/idleberg/node-fesch/actions)
[![Snyk](https://flat.badgen.net/snyk/idleberg/fesch)](https://snyk.io/vuln/npm:fesch)

Local browser cache for the [Fetch API][]

## Installation

`npm install fesch -S`

## Usage

### Import

```ts
import { Fesch } from 'fesch';

const { fetch } = Fesch({
    expiry: 3_600_000, // 1 hour
});

// Uses the standard Fetch API
await fetch('https://jsonplaceholder.typicode.com/todos/1' {
    headers: {
        accept: 'application/json',
    }
});
```

## License

This work is licensed under [The MIT License](LICENSE)

[fetch api]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
