import t from 'tst'
import enhook from './enhook.js'
import { useEffect } from '../src/index'
import { tick, frame } from 'wait-please'

t('useEffect: microtask guaranteed', async t => {
  let log = []

  let f = (i) => {
    log.push('call', i)
    useEffect(() => {
      log.push('effect', i)
      return 1
    })
  }

  let f1 = enhook(f)
  let f2 = enhook(f)
  f1(1)
  f2(2)
  await tick(2)
  t.deepEqual(log, ['call', 1, 'call', 2, 'effect', 1, 'effect', 2])

  t.end()
})

t('useEffect: async fn is fine', async t => {
  let log = []

  let f = enhook((i) => {
    useEffect(async () => {
      await tick(2)
      log.push(1)
    }, [])
  })

  f()
  await tick(3)
  t.deepEqual(log, [1])
  f()
  await tick(3)
  t.deepEqual(log, [1])

  t.end()
})

t('useEffect: dispose should clean up effects', async t => {
  let log = []
  let f = enhook(() => {
    useEffect(() => {
      log.push('in')
      return () => log.push('out')
    })
  })
  f()
  await frame(2)
  f.unhook()
  await frame(2)
  t.deepEqual(log, ['in', 'out'])

  t.end()
})
