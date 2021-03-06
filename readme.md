# unihooks ![experimental](https://img.shields.io/badge/stability-experimental-yellow) [![Build Status](https://travis-ci.org/unihooks/unihooks.svg?branch=master)](https://travis-ci.org/unihooks/unihooks)

Essential hooks collection for everyday react<sup>[1](#user-content-1)</sup> projects.

[![NPM](https://nodei.co/npm/unihooks.png?mini=true)](https://nodei.co/npm/unihooks/)

<!--
```js
import { useMedia, useQueryParam, useLocalStorage } from 'unihooks'

const MyComponent = () => {
  let [ location, setLocation ] = useMedia()
  let [ id, setId ] = useQueryParam('id', 0)
  let [ cart, setCart ] = useLocalStorage('cart', [])

  // ...
}
```
-->

## Principles

<details>
<summary><strong id="1">1. Framework agnostic</strong></summary>
<br/>

_Unihooks_ are not bound to react and work with any hooks-enabled framework:

* [react](https://ghub.io/react)
* [preact](https://ghub.io/preact)
* [haunted](https://ghub.io/haunted)
* [neverland](https://ghub.io/neverland)
* [atomico](https://ghub.io/atomico)
* [fuco](https://ghub.io/fuco)
* [spect](https://ghub.io/spect)
* [augmentor](https://ghub.io/augmentor)

See [any-hooks](https://ghub.io/any-hooks) for the full list.

<!--
To switch hooks framework:

```js
import setHooks, { useState, useEffect } from 'unihooks'
import * as preactHooks from 'preact/hooks'

setHooks(preactHooks)
```
-->
</details>

<details>
<summary><strong>2. Unified</strong></summary>
<br/>

_Unihooks_ follow `useState` signature for intuitivity.

```js
let [ state, actions ] = useValue( target?, init | update? )
```

<!--
<sub>Inspired by [upsert](https://github.com/tc39/proposal-upsert), combining _insert_ and _update_ into a single function.</sub>
-->
</details>


<details>
<summary><strong>3. Essential</strong></summary>
<br/>

_Unihooks_ deliver value in reactive context, they're not mere wrappers for native API. Static hooks are avoided.

```js
const MyComponent = () => { let ua = useUserAgent() } // ✘ − user agent never changes
const MyComponent = () => { let ua = navigator.userAgent } // ✔ − direct API must be used instead
```

<!--
## Who Uses Unihooks

* [wishbox](https://wishbox.gift)
* [mobeewave]()
-->
</details>

## Hooks

<details>
<summary><strong>useChannel</strong></summary>

#### `[value, setValue] = useChannel(key, init?, deps?)`

Global value provider - `useState` with value identified globally by `key`.
Can be used as value store, eg. as application model layer without persistency. Also can be used for intercomponent communication.

`init` can be a value or a function, and (re)applies if the `key` (or `deps`) changes.

```js
import { useChannel } from 'unihooks'

function Component () {
  let [users, setUsers] = useChannel('users', {
    data: [],
    loading: false,
    current: null
  })

  setUsers({ ...users, loading: true })

  // or as reducer
  setUsers(users => { ...users, loading: false })
}
```
</details>


<details>
<summary><strong>useStorage</strong></summary>

#### `[value, setValue] = useStorage(key, init?, options?)`

`useChannel` with persistency to local/session storage. Subscribes to `storage` event - updates if storage is changed from another tab.

```js
import { useStorage } from 'unihooks'

function Component1 () {
  const [count, setCount] = useStorage('my-count', 1)
}

function Component2 () {
  const [count, setCount] = useStorage('my-count')
  // count === 1

  setCount(2)
  // (↑ updates Component1 too)
}

function Component3 () {
  const [count, setCount] = useStorage('another-count', (value) => {
    // ...initialize value from store
    return value
  })
}
```

#### `options`

* `prefix` - prefix that's added to stored keys.
* `storage` - manually pass session/local/etc storage.
<!-- * `interval` - persistency interval -->

Reference: [useStore](https://ghub.io/use-store).

</details>

<details>
<summary><strong>useAction</strong></summary>

#### `[action] = useAction(key, cb, deps?)`

Similar to `useChannel`, but used for storing functions. Different from `useChannel` in the same way the `useCallback` is different from `useMemo`. `deps` indicate if value must be reinitialized.

```js
function RootComponent() {
  useAction('load-content', async (slug, fresh = false) => {
    const url = `/content/${slug}`
    const cache = fresh ? 'reload' : 'force-cache'
    const res = await fetch(url, { cache })
    return await res.text()
  })
}

function Content ({ slug = '/' }) {
  let [content, setContent] = useState()
  let [load] = useAction('load-content')
  useEffect(() => load().then(setContent), [slug])
  return html`
    <article>${content}</article>
  `
}
```

</details>

<details>
<summary><strong>useSearchParam</strong></summary>

#### `[value, setValue] = useSearchParam(name, init?)`

Reflect value to `location.search`. `value` is turned to string via [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams).
To serialize objects or arrays, provide `.toString` method or convert manually.

**NOTE**. Patches `history.push` and `history.replace` to enable `pushstate` and `replacestate` events.

```js
function MyComponent () {
  let [id, setId] = useSearchParam('id')
}
```

</details>

<!--
<details>
<summary><strong>useCookie</strong></summary>

#### `[value, setValue] = useCookie(name, init?)`

Cookies accessor hook.

```js
function MyComponent () {
  const [cookie, setCookie] = useCookie('foo')

  useEffect(() => {
    setCookie('baz')
  })
}
```

Does not observe cookies (there's no implemented API for that).

</details>
-->

<!--
<details>
<summary><strong>useAttribute</strong></summary>

#### `[attr, setAttr] = useAttribute( element | ref, name)`

Element attribute hook. Serializes value to attribute, creates attribute observer, handles edge-cases. `null`/`undefined` value removes attribute from element.

```js
function MyButton() {
  let [attr, setAttr] = useAttribute(el, 'loading')

  setAttr(true)

  useEffect(() => {
    // remove attribute
    return () => setAttr()
  }, [])
}
```
</details>
-->

<!-- - [ ] `useLocation` − window.location state -->
<!-- - [ ] `useRoute` − `useLocation` with param matching -->
<!-- - [ ] `useData` − read / write element dataset -->
<!-- - [ ] `useClass` − manipulate element `classList` -->
<!-- - [ ] `useMount` − `onconnected` / `ondisconnected` events -->
<!-- - [ ] `useStyle` − set element style -->
<!-- - [ ] `usePermission` -->
<!-- - [ ] `useTitle` -->
<!-- - [ ] `useMeta` -->
<!-- - [ ] `useRoute` -->
<!-- - [ ] `useMutation` − -->
<!-- - [ ] `useHost` −  -->

<!--
<details>
<summary><strong>useElement</strong></summary>

#### `[element] = useElement( selector | element | ref )`

Get element, either from `ref`, by `selector` or directly.

Updates whenever selected element or `ref.current` changes.

```js
function MyButton() {
  let ref = useRef()
  let [value, setValue] = useElement(ref)

  return <input ref={ref} value={value}/>
}
```

</details>
-->

<!--
<details>
<summary><strong>useRender</strong></summary>

#### `[content, render] = useRender( element | ref )`

Get or set element content.

```js
function MyButton() {
  let ref = useRef()
  let [content, render] = useRender(ref)

  render(<input ref={ref} value={value}/>)
}
```
</details>
-->

<!-- - [ ] `useResource` − async source with state -->
<!-- - [ ] `useFiles` -->
<!-- - [ ] `useDB` -->
<!-- - [ ] `useClipboard` -->
<!-- - [ ] `useFavicon` -->
<!-- - [ ] `useRemote` -->
<!-- - [ ] `useHistory` − -->
<!-- - [ ] `useHotkey` -->


<!--
<details><summary><strong>useProps</strong></summary>

#### `[props, setProps] = useProps(element | ref, init?)`

Element props hook. Observes element attributes and properties changes.

Observable properties are detected as:

1. Standard prototype properties.
2. Non-standard properties, set on element at the init moment.
3. Properties defined in `init`.

Primitive values are serialized as element attributes, objects and arrays as properties.

```js
```
</details>
-->


<details>
<summary><strong>useCountdown</strong></summary>

#### `[n, reset] = useCountdown(startValue, interval=1000 | schedule?)`

Countdown value from `startValue` down to `0` with indicated `interval` in ms. Alternatively, a scheduler function can be passed as `schedule` argument, that can be eg. [worker-timers](https://ghub.io/worker-timers)-based implementation.

```js
import { useCountdown } from 'unihooks'
import { setInterval, clearInterval } from 'worker-timers'

const Demo = () => {
  const [count, reset] = useCountdown(30, fn => {
    let id = setInterval(fn, 1000)
    return () => clearInterval(id)
  });

  return `Remains: ${count}s`
};
```
</details>


<details>
<summary><strong>useValidate</strong></summary>

#### `[error, validate] = useValidate(validator: Function | Array, init? )`

Provides validation functionality.

* `validator` is a function or an array of functions `value => error | true ?`.
* `init` is optional initial value to validate.

```js
function MyComponent () {
  let [usernameError, validateUsername] = useValidate([
    value => !value ? 'Username is required' : true,
    value => value.length < 2 ? 'Username must be at least 2 chars long' : true
  ])

  return <>
    <input onChange={e => validateUsername(e.target.value) && handleInputChange(e) } {...inputProps}/>
    { usernameError }
  </>
}
```
</details>


<details>
<summary><strong>useFormField</strong></summary>

#### `[props, field] = useFormField( options )`

Form field state controller. Handles input state and validation.
Useful for organizing controlled inputs or forms, a nice minimal replacement to form hooks libraries.

```js
let [props, field] = useFormField({
  name: 'password',
  type: 'password',
  validate: value => !!value
})

// to set new input value
useEffect(() => field.set(newValue))

return <input {...props} />
```

#### `options`

* `value` - initial input value.
* `persist = false` - persist input state between sessions.
* `validate` - custom validator for input, modifies `field.error`. See `useValidate`.
* `required` - if value must not be empty.
* `...props` - the rest of props is passed to `props`

#### `field`

* `value` - current input value.
* `error` - current validation error. Revalidates on blur, `null` on focus.
* `valid: bool` - is valid value, revalidates on blur.
* `focus: bool` - if input is focused.
* `touched: bool` - if input was focused.
* `set(value)` - set input value.
* `reset()` - reset form state to initial.
* `validate(value)` - force-validate input.

</details>

<details>
<summary><strong>useInput</strong></summary>

#### `[value, setValue] = useInput( element | ref )`

Uncontrolled input element hook. Updates if input value changes.
Setting `null` / `undefined` removes attribute from element.
Useful for organizing simple input controllers, for advanced cases see [useFormField](#useFormField).

```js
function MyButton() {
  let ref = useRef()
  let [value, setValue] = useInput(ref)

  useEffect(() => {
    // side-effect when value changes
  }, [value])

  return <input ref={ref} />
}
```
</details>


<details>
<summary><strong>useObservable</strong></summary>

#### `[state, setState] = useObservable(observable)`

Observable as hook. Plug in any [spect/v](https://ghub.io/spect), [observable](https://ghub.io/observable), [mutant](https://ghub.io/mutant), [observ](https://ghub.io/observ) be free.

```js
import { v } from 'spect/v'

const vCount = v(0)

function MyComponent () {
  let [count, setCount] = useObservable(vCount)

  useEffect(() => {
    let id = setInterval(() => setCount(count++), 1000)
    return () => clearInterval(id)
  }, [])

  return <>Count: { count }</>
}
```
</details>

<!--
<details><summary><strong>useForm</strong></summary>

#### `[fields, form] = useForm( fieldOptions )`

High-order hook, combining multiple `useFormFields`. Useful building app forms.

```js
function MyForm() {
  let [fields, form] = useForm({
    username: { required },
    password: { type: 'password', required }
  })

  return <form onSubmit={e => {
    e.preventDefault()
    if (!form.validate()) return
    handleSubmit(form.values)
  }}>
    <input {...fields.username} />
    <input {...fields.password} />
    <input type="submit" />
  </form>
}
```

#### `fieldOptions`

Object with keys as field names and props as props for `useFormField`.

#### `fields`

Object with `useFormField`s.

#### `form`

Form state.

* `valid`
* `errors`
* `values`
* `touched`
* `set()`
* `reset()`
* `validate()`

</details>
-->

<!-- - [ ] `useTable` − table state hook -->
<!-- - [ ] `useDialog` − dialog builder helper -->
<!-- - [ ] `useMenu` − menu builder helper -->
<!-- - [ ] `useToast` − toast builder helper -->
<!-- - [ ] `usePopover` − popover builder helper -->
<!-- - [ ] `useLocale` − -->

<!-- #### Appearance -->

<!-- - [ ] `useMedia` -->
<!-- - [ ] `useCSS` -->
<!-- - [ ] `useSize` -->
<!-- - [ ] `useFullscreen` -->
<!-- - [ ] `useAudio` -->
<!-- - [ ] `useSpeech` -->
<!-- - [ ] `useLockBodyScroll` -->

<!-- #### Interaction -->

<!-- - [ ] `useHover` − hover state of an element -->
<!-- - [ ] `useEvent` − subscribe to an event -->
<!-- - [ ] `useResize` − track element size -->
<!-- - [ ] `useIntersection` − track element intersection via Intersection observer -->
<!-- - [ ] `useDrag` / `useDrop` − drag / drop interaction helper -->
<!-- - [ ] `useIdle` − track idle state -->
<!-- - [ ] `useMove` − track mouse/pointer move with inertia -->
<!-- - [ ] `usePan` − track panning -->
<!-- - [ ] `useZoom` − track zoom -->
<!-- - [ ] `useKey` − track key press -->
<!-- - [ ] `useShortcut` − track combination of keys -->
<!-- - [ ] `useArrows` − track arrows -->
<!-- - [ ] `useTyping` − detect if user is typing -->
<!-- - [ ] `useScrolling` − detect if user is scolling -->
<!-- - [ ] `usePageLeave` − -->
<!-- - [ ] `useScroll` − -->
<!-- - [ ] `useClickAway` − -->
<!-- - [ ] `useFocusOutside` − -->

<!-- #### Hardware -->

<!-- - [ ] `useNetwork` -->
<!-- - [ ] `useOrientation` -->
<!-- - [ ] `useMedia` -->
<!-- - [ ] `useAccelerometer` -->
<!-- - [ ] `useBattery` -->
<!-- - [ ] `useGeolocation` -->
<!-- - [ ] `useMediaDevices` -->
<!-- - [ ] `useVibrate` -->
<!-- - [ ] `useMotion` -->

<!-- #### Async / Stream -->

<!-- - [ ] `useStream` -->
<!-- - [ ] `useObservable` -->
<!-- - [ ] `useAsyncIterator` -->
<!-- - [ ] `useGenerator` -->
<!-- - [ ] `usePromise` -->
<!-- - [ ] `useEmitter` -->

<!--
<details>
<summary><strong>useThrottle</strong></summary>
</details>

<!-- - [ ] `useDefined` -->
<!-- - [ ] `useTween` -->
<!-- - [ ] `useTimeout` -->
<!-- - [ ] `useInterval` -->
<!-- - [ ] `useIdle` -->
<!-- - [ ] `useImmediate` -->
<!-- - [ ] `useRaf` -->
<!-- - [ ] `useToggle` -->
<!-- - [ ] `usePing` -->
<!-- - [ ] `useFSM` -->
<!-- - [ ] `useAsync` -->
<!-- - [ ] `useHooked` - run hooks-enabled effect -->
<!-- - [ ] `useCounter` − track state of a number -->


<details>
<summary><strong>standard</strong></summary>
<br/>

For convenience, unihooks export current framework hooks. To switch hooks, use `setHooks` - the default export.

```js
import setHooks, { useState, useEffect } from 'unihooks'
import * as hooks from 'preact/hooks'

setHooks(hooks)

function Timer() {
  let [count, setCount] = useState(0)
  useEffect(() => {
    let id = setInterval(() => setCount(c => ++c))
    return () => clearInterval(id)
  }, [])
}
```

</details>

<details>
<summary><strong>utility</strong></summary>
<br/>

Utility hooks, useful for high-order-hooks.

#### `update = useUpdate()`

Force-update component, regardless of internal state.

#### `prev = usePrevious(value)`

Returns the previous state as described in the [React hooks FAQ](https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state).

<!--
useSyncEffect
useInit
useDestroy
useResetState
-->

</details>

## See also

* [any-hooks](https://ghub.io/any-hooks) - cross-framework standard hooks provider.
* [enhook](https://ghub.io/enhook) - run hooks in regular functions.

## Alternatives

* [valtio](https://github.com/pmndrs/valtio)

## License

MIT

<p align="right">HK</p>
