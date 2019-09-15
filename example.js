const SOS = require('.')

const mObj = {
  a: 3,
  f (x) {
    return x + 5
  }
}

const proxy = SOS(mObj)

// All access is transparently proxied to original object
// but is also logged at the same time
const resA = proxy.a // => 3
const resB = proxy.f(2) // => 7
const resC = proxy.anUndefinedKey
proxy.x = resA + resB

console.log('Results:', resA, resB, resC)

