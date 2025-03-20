let _1 = 'foo'
_1 = 'hjgfd'

let _2 = /./g
//       ^^^^ Avoid using stateful RegExp with "g" (global) flag at the top level.
_2 = /./y
//   ^^^^ Avoid using stateful RegExp with "y" (sticky) flag at the top level.
_2 = /./yg
//   ^^^^^ Avoid using stateful RegExp with "g" (global) or "y" (sticky) flags at the top level.
_2 = /./

_2 = /./dimsv

let _3 = new RegExp('', 'g')
//       ^^^^^^^^^^^^^^^^^^^ Avoid using stateful RegExp with "g" (global) flag at the top level.
_3 = new RegExp('', 'y')
//   ^^^^^^^^^^^^^^^^^^^ Avoid using stateful RegExp with "y" (sticky) flag at the top level.

_3 = new RegExp('', 'dimsvy')
//   ^^^^^^^^^^^^^^^^^^^^^^^^ Avoid using stateful RegExp with "y" (sticky) flag at the top level.

_3 = new RegExp('', 'gy')
//   ^^^^^^^^^^^^^^^^^^^^ Avoid using stateful RegExp with "g" (global) or "y" (sticky) flags at the top level.
_3 = new RegExp('', 'imsu')
_3 = new RegExp('', 'dimsv')

const _4 = /./gy
//         ^^^^^ Avoid using stateful RegExp with "g" (global) or "y" (sticky) flags at the top level.

const _5 = /./

{
	const _6 = /./gy
}

function _fn() {
	const _7 = /./gy
}

const _8 = () => /./gy

export const _9 = /./gy
//                ^^^^^ Avoid using stateful RegExp with "g" (global) or "y" (sticky) flags at the top level.

export const _10 = () => /./gy

export default /./gy
//             ^^^^^ Avoid using stateful RegExp with "g" (global) or "y" (sticky) flags at the top level.

export const _11 = new RegExp('', 'du')
export const _12 = new RegExp('', 'gy')
//                 ^^^^^^^^^^^^^^^^^^^^ Avoid using stateful RegExp with "g" (global) or "y" (sticky) flags at the top level.
