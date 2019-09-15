const sanity = require('.')
const test = require('tape')

class TestObj {
  constructor () {
    this.instanceKey = 'instanceValue'
    this._privateKey = 'privateValue'
  }

  get privateKey () {
    return this._privateKey
  }

  set privateKey (v) {
    this._privateKey = v
  }

  instanceMethod (arg1, arg2) {
    return arg1 + arg2
  }
}

const makeProxy = (logger, altObj) => sanity(altObj || new TestObj(), { logger })

test('get', t => {
  t.plan(4)
  const spx = makeProxy((op, prop, value) => {
    t.equal(op, 'get')
    t.equal(prop, 'instanceKey')
    t.equal(value, 'instanceValue')
  })

  t.equal(spx.instanceKey, 'instanceValue')
  t.end()
})

test('getter', t => {
  t.plan(7)
  const keyOrder = ['_privateKey', 'privateKey']
  let n = 0
  const spx = makeProxy((op, prop, value) => {
    t.equal(op, 'get')
    t.equal(prop, keyOrder[n++])
    t.equal(value, 'privateValue')
  })
  t.equal(spx.privateKey, 'privateValue')
  t.end()
})

test('invoke', t => {
  t.plan(8)
  let n = 0
  const spx = makeProxy((op, prop, args, returnValue) => {
    t.equal(prop, 'instanceMethod')
    if (!n++) {
      t.equal(op, 'get')
      t.equal(typeof args, 'function')
    } else {
      t.equal(op, 'invoke')
      t.equal(JSON.stringify(args), JSON.stringify([1, 2]))
      t.equal(returnValue, 3)
    }
  })
  const returnValue = spx.instanceMethod(1, 2)
  t.equal(returnValue, 3)
  t.end()
})

test('set', t => {
  t.plan(3)
  const spx = makeProxy((op, prop, value) => {
    t.equal(op, 'set')
    t.equal(prop, 'newKey')
    t.equal(value, 'nk')
  })
  spx.newKey = 'nk'
  t.end()
})

test('set overwrite', t => {
  t.plan(4)
  const spx = makeProxy((op, prop, value, prev) => {
    t.equal(op, 'set')
    t.equal(prop, 'instanceKey')
    t.equal(value, 'nk')
    t.equal(prev, 'instanceValue')
  })
  spx.instanceKey = 'nk'
  t.end()
})

test('setter', t => {
  t.plan(8)
  let n = 0
  const spx = makeProxy((op, prop, value, oldValue) => {
    t.equal(op, 'set')
    if (!n++) t.equal(prop, 'privateKey') // Setter
    else t.equal(prop, '_privateKey') // Actual value set by setter
    t.equal(value, 'bob')
    t.equal(oldValue, 'privateValue')
  })
  spx.privateKey = 'bob'
  t.end()
})

test.skip('apply NOT SUPPORTED', t => {
  t.plan(4)
  const mThis = {}
  const mFun = (a) => a + 1
  const spx = makeProxy((op, prop, aThis, args) => {
    debugger
    t.equal(op, 'apply')
    t.equal(prop, 'instanceKey')
    /**
      t.equal(value, 'nk')
      t.equal(prev, 'instanceValue')
    */
  }, mFun)
  t.equal(spx.apply(mThis, [2]), 3)
  t.end()
})
