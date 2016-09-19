/**
 * create by Jocs 2016.09.19
 */
export const isThenable = data => data && data.then && typeof data.then === 'function'
// handleThen
export const handlerThen = (parent, child, arg, type) => {
	const listeners = type === 0 ? 'successListeners' : 'failureListeners'
	if (typeof arg === 'function') {
		const handler = function(data) {
			const result = arg(data)

			if (isThenable(result)) {
				child = Object.assign(result, child)
			} else {
				resolve(child, result)
			}

		}
		parent[listeners].push(handler)
	} else if (!arg) {
		const handler = function(data) {
			type === 0 ? resolve(child, data): reject(child, data)
		}
		parent[listeners].push(handler)
	}
}

// resolve function
export const resolve = (promise, data) => {
	if (promise.status !== 'pending') return false
	promise.status = 'fulfilled'
	promise.successListeners.forEach(fn => fn(data))
}
// reject function
export const reject = (promise, err) => {
	if (promise.status !== 'pending') return false
	promise.status = 'rejected'
	promise.failureListeners.forEach(fn => fn(err))
}

export const noop = () => {}

export const delay = (fn, time = 0) => setTimeout(() => fn(), time)

export const range = n => n === 0 ? [] : [n, ...range(n - 1)]
