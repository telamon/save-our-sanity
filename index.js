// wubbalubba dub dub...
const Debug = require('debug')

function SaveOurSanity (obj, tag, opts) {
  if (typeof tag === 'object' && !opts) return SaveOurSanity(obj, null, tag)
  opts = opts || {}
  const TAG = tag || 'SOS'
  const log = opts.logger || Debug(TAG)

  // This is a debugging last-way-out library
  // enable the logging by default.
  if (!opts.logger) Debug.enable(TAG)

  const handler = {
    apply (target, thisArg, argumentsList) {
      log('apply', thisArg, argumentsList)
      return Reflect.apply(...arguments)
    },

    get (target, prop, receiver) {
      const value = Reflect.get(...arguments)
      log('get', prop, value)
      if (typeof value === 'function') {
        return (...args) => {
          const rvalue = value(...args)
          log('invoke', prop, args, rvalue)
          return rvalue
        }
      } else return value
    },

    set (target, prop, value) {
      if (typeof target[prop] === 'undefined') {
        log('set', prop, value)
      } else {
        log('set', prop, value, Reflect.get(target, prop))
      }
      return Reflect.set(...arguments)
    },
    has (target, key) {
      log('has?', key)
      return key in target
    }
  }

  return new Proxy(obj, handler)
}
module.exports = SaveOurSanity
    /*
    handler.getPrototypeOf()
    A trap for Object.getPrototypeOf.
    handler.setPrototypeOf()
    A trap for Object.setPrototypeOf.
    handler.isExtensible()
    A trap for Object.isExtensible.
    handler.preventExtensions()
    A trap for Object.preventExtensions.
    handler.getOwnPropertyDescriptor()
    A trap for Object.getOwnPropertyDescriptor.
    handler.defineProperty()
    A trap for Object.defineProperty.
    handler.has()
    A trap for the in operator.
    handler.get()
    A trap for getting property values.
    handler.set()
    A trap for setting property values.
    handler.deleteProperty()
    A trap for the delete operator.
    handler.ownKeys()
    A trap for Object.getOwnPropertyNames and Object.getOwnPropertySymbols.
    handler.apply()
    A trap for a function call.
    handler.construct()
    */
