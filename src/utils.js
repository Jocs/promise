/**
 * create by Jocs 2016.09.19
 */

import {
	RESOLVE,
	REJECT
} from './constants'

export const isThenable = data => data && data.then && typeof data.then === 'function'
export const isPromise = object => isThenable(object) && ('catch' in object) && typeof object.catch === 'function'
export const noop = () => {}
export const range = n => n === 0 ? [] : [n, ...range(n - 1)]
export const fill = (arr, length) => arr.length < length ? fill([...arr, undefined], length) : arr
// export const delay = (fn, time = 0) => setTimeout(() => fn(), time)

// resolve function
export const executorProvider = (promise, type) => data => {
	if (promise.status !== 'pending') return false
	const listenerType = type === RESOLVE ? 'successListeners' : 'failureListeners'
	promise.status = type === RESOLVE ? 'fulfilled' : 'rejected'
	promise.result = data
	promise[listenerType].forEach(fn => fn(promise.status, data))
}

// handleThen
export const handlerThen = (parent, child, arg, type) => {
	const listeners = type === 0 ? 'successListeners' : 'failureListeners'
	const handler = (status, data) => {
		if (typeof arg === 'function') {
			let result
			try {
				result = arg(data)
			} catch (err) {
				return executorProvider(child, REJECT)(err)
			}
			if (isThenable(result)) {
				child = Object.assign(result, child)
			} else {
				executorProvider(child, RESOLVE)(result)
			}
		} else if (!arg) {
			const actionType = type === 0 ? RESOLVE : REJECT
			if ((status === 'fulfilled' && type === 0) || (status === 'rejected' && type === 1))
				executorProvider(child, actionType)(data)
		}
	}
	if(parent.status === 'pending') parent[listeners].push(handler)
	else handler(parent.status, parent.result)
}
