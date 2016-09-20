/**
 * create by Jocs 2016.09.19
 */

import {
	RESOLVE,
	REJECT
} from './constants'

export const isThenable = data => data && data.then && typeof data.then === 'function'
export const isPromise = object => isThenable(object) && ('catch' in object) && typeof object.catch === 'function'
// export const delay = (fn, time = 0) => setTimeout(() => fn(), time)

// handleThen
export const handlerThen = (parent, child, arg, type) => {
	const listeners = type === 0 ? 'successListeners' : 'failureListeners'
	let handler
	if (typeof arg === 'function') {
		handler = function(data) {
			const result = arg(data)
			if (isThenable(result)) {
				child = Object.assign(result, child)
			} else {
				executorProvider(child, RESOLVE)(result)
			}

		}
	} else if (!arg) {
		handler = function(data) {
			type === 0 ? executorProvider(child, RESOLVE)(data): executorProvider(child, REJECT)(data)
		}		
	}
	if(parent.status === 'pending') parent[listeners].push(handler)
	else if(parent.status === 'fulfilled') handler(parent.result)
	else if(parent.status === 'rejected') handler(parent.result)
}

// resolve function
export const executorProvider = (promise, type) => data => {
	if (promise.status !== 'pending') return false
	const listenerType = type === RESOLVE ? 'successListeners' : 'failureListeners'
	promise.status = type === RESOLVE ? 'fulfilled' : 'rejected'
	promise.result = data
	promise[listenerType].forEach(fn => fn(data))
}

export const noop = () => {}

export const range = n => n === 0 ? [] : [n, ...range(n - 1)]
