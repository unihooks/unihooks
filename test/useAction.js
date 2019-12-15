import t from 'tape'
import enhook from 'enhook'
import { useAction, createAction, useStore, createStore, useEffect, useState } from '../src/index'
import { channels } from '../src/useStore'
import { tick, frame, time } from 'wait-please'
import { clearNodeFolder } from 'broadcast-channel'


t('useAction: basic', async t => {
  await clearNodeFolder()

  let log = []

  createStore('foo', { bar: 'baz' })

  createAction('foo', () => {
    let [foo, setFoo] = useStore('foo')
    log.push(foo)

    useEffect(() => {
      setFoo({ bar: 'qux' })
    }, [])
  })

  let f = enhook(() => {
    let foo = useAction('foo')
    foo()
  })
  f()
  await tick(2)
  t.deepEqual(log, [{ bar: 'baz'}])
  f()
  t.deepEqual(log, [{ bar: 'baz'}, { bar: 'qux'}])
  await tick(2)

  for (let channel in channels) { (channels[channel].close(), delete channels[channel]) }
  t.end()
})

t('useAction: must not deadlock setStore', async t => {
  await clearNodeFolder()

  let log = []
  let store = createStore('items', [0])
  let action = createAction('push', async e => {
    let [items, setItems] = useStore('items')
    log.push(items.length)
    await tick()
    setItems([...items, items.length])
  })
  let fn = enhook(() => {
    useEffect(() => {
      action()
    })
  })

  fn()
  await time()
  t.deepEqual(log, [1])

  fn()
  await time()
  t.deepEqual(log, [1, 2])

  teardown()
  t.end()
})


t('useAction: actions are not reactive', async t => {
  let log = []
  let action = createAction(function () {
    let [x, setX] = useState(0)
    log.push(x)
    setX(++x)
  })
  action()
  t.deepEqual(log, [0])
  action()
  t.deepEqual(log, [0, 1])
  action()
  t.deepEqual(log, [0, 1, 2])

  t.end()
})

t('useAction: actions are not reactive with array', async t => {
  let log = []
  let action = createAction(function () {
    let [x, setX] = useState([0])
    log.push(x.length)
    setX([...x, x.length])
  })
  action()
  t.deepEqual(log, [1])
  action()
  t.deepEqual(log, [1, 2])
  action()
  t.deepEqual(log, [1, 2, 3])

  t.end()
})

t('useAction: passes args', async t => {
  let log = []
  let action = createAction('args', function (...args) {
    log.push(...args)
  })
  enhook(() => {
    let action = useAction('args')
    action(1, 2, 3)
  })()

  t.deepEqual(log, [1, 2, 3])

  t.end()
})

t('useAction: unknow action throws error', t => {
  t.plan(1)
  enhook(() => {
    t.throws(() => useAction('xxx'))
  })()
  t.end()
})

t('useAction: async action must be awaitable', async t => {
  let log = []

  let a = createAction(async () => {
    log.push(1)
    await tick()
    log.push(2)
  })
  await a()
  t.deepEqual(log, [1, 2])

  t.end()
})

t('useAction: must return result', async t => {
  t.equal(createAction(() => {
    return 123
  })(), 123)

  t.equal(await createAction(async () => {
    await ''
    return 123
  })(), 123)

  t.end()
})


export async function teardown() {
  for (let channel in channels) { (channels[channel].close(), delete channels[channel]) }
}
