import t from 'tst'
import enhook from './enhook.js'
import setHooks, { useAction, useEffect, useState, useChannel } from '../'
import { tick, frame, time } from 'wait-please'

t('useAction: basic', async t => {
  let log = []

  let f = enhook(() => {
    let [foo, setFoo] = useChannel('foo', { bar: 'baz' })
    log.push(foo)
    let [fooFn] = useAction('foo', () => {
      useEffect(() => {
        setFoo({ bar: 'qux' })
      }, [])
    })
    fooFn()
  })
  f()
  await tick(2)
  t.deepEqual(log, [{ bar: 'baz'}])
  f()
  t.deepEqual(log, [{ bar: 'baz'}, { bar: 'qux'}])
  await tick(2)

  f.unhook()

  t.end()
})

t('useAction: passes args & returns result', async t => {
  let log = []
  let f = enhook(() => {
    let action = useAction('args', function (...args) {
      log.push(...args)
      return 4
    })
    log.push(action(1, 2, 3))
  })
  f()

  t.deepEqual(log, [1, 2, 3, 4])

  f.unhook()
  t.end()
})

t('useAction: null value', async t => {
  let log = []
  let f1 = enhook(() => {
    let a = useAction('x')
    log.push(a[0])
  })
  let f2 = enhook(() => {
    let a = useAction('x', 123)
    log.push(a[0])
  })
  f1()
  f2()

  t.deepEqual(log,[undefined, 123])

  f1.unhook()
  f2.unhook()

  t.end()
})

t('useAction: should support deps', async t => {
  let log = []
  let f = enhook((arg) => {
    let act = useAction('x', () => log.push(arg), [arg])
    act()
  })
  f(1)
  f(2)

  t.deepEqual(log, [1, 2])
  f.unhook()

  t.end()
})
