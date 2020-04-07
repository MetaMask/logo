const test = require('tape')
require('../convert.js')
require('../convert2.js')
const original = require('../fox.json')
const newKind = require('../fox2.json')

test('compare conversion output', async (t) => {
  t.equal(original, newKind, 'files perfectly match')
  t.end()
})



