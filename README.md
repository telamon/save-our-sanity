# Save Our Sanity

Quickly wrap any object in a logging object proxy that will log all access and manipulation of the
proxied target.

Useful for instance to temporarily verify that a 3rd-party library really reads the expected keys from a passed `opts` hash.
Or if a method you expect to be invoked really was called with expected arguments and what the produced return value was.

Pretty much a general purpose sanity checker, a companion tool for test driven development.

It currently supports logging for the following operations `get`, `set`, `invoke` and `in`.
But feel free to implement additional logging hooks from the [Reflect API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) if required.

Please avoid using this module in production, even though the performance
impact should be minimal it will eventually flood your console
with mostly useless information, unless ofcourse..
__you're in a situation where you start questioning your own
sanity__.

### Installation

```bash
npm i --saveDev save-our-sanity
# or
yarn add -D save-our-sanity
```

### Usage

```
const SOS = require('save-our-sanity')

const mObj = {
  a: 3,
  f (x) {
    return x + 5
  }
}

const proxy = SOS(mObj) // target can be anything

// All access is transparently proxied to original object
// but is also logged at the same time
const resA = proxy.a // => 3
const resB = proxy.f(2) // => 7
const resC = proxy.anUndefinedKey // => undefined
proxy.x = resA + resB // => 10

console.log('Results:', resA, resB, resC)
```

Running the above snippet produces the following output:

<pre>$ node example.js
  <font color="#CF3F61"><b>SOS </b></font>get a 3 <font color="#CF3F61">+0ms</font>
  <font color="#CF3F61"><b>SOS </b></font>get f f (x) {
    return x + 5
  } <font color="#CF3F61">+1ms</font>
  <font color="#CF3F61"><b>SOS </b></font>invoke f [ 2 ] 7 <font color="#CF3F61">+1ms</font>
  <font color="#CF3F61"><b>SOS </b></font>get anUndefinedKey undefined <font color="#CF3F61">+1ms</font>
  <font color="#CF3F61"><b>SOS </b></font>set x 10 <font color="#CF3F61">+0ms</font>
Results: 3 7 undefined</pre>

### API

##### `SOS(target, tag = 'SOS', opts = {})`
Creates a new proxy with specified target, an optional log-tag
and an optional `opts` object

**`tag`** - `string`, defaults to 'SOS'

**`opts.logger`** - `function` that will be invoked instead of the default [debug]() logger

### License

GNU GPLv3


