/**
 * create by Jocs 2016.09.19
 */
export const isThenable = data => data && data.then && typeof data.then === 'function'
export const isPromise = object => isThenable(object) && ('catch' in object) && typeof object.catch === 'function'
export const delay = (fn, time = 0) => setTimeout(() => fn(), time)

// handleThen
export const handlerThen = (parent, child, arg, type) => {
	const listeners = type === 0 ? 'successListeners' : 'failureListeners'
	if (typeof arg === 'function') {
		const handler = function(data) {
			const result = arg(data)

			if (isThenable(result)) {
				child = Object.assign(result, child)
			} else {
				resolveProvider(child)(result)
			}

		}
		parent[listeners].push(handler)
	} else if (!arg) {
		const handler = function(data) {
			type === 0 ? resolveProvider(child)(data): rejectProvider(child)(data)
		}
		parent[listeners].push(handler)
	}
}

// resolve function
export const resolveProvider = promise => data => {
	if (promise.status !== 'pending') return false
	promise.status = 'fulfilled'
	promise.successListeners.forEach(fn => fn(data))
}
// reject function
export const rejectProvider = promise => data => {
	if (promise.status !== 'pending') return false
	promise.status = 'rejected'
	promise.failureListeners.forEach(fn => fn(data))
}

export const noop = () => {}

export const range = n => n === 0 ? [] : [n, ...range(n - 1)]
