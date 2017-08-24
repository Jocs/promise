/**
 * 2016.09.19
 */
const PENDING = 'PENDING' // Promise 的初始状态
const FULFILLED = 'FULFILLED' // Promise 成功返回后的状态
const REJECTED = 'REJECTED' // Promise 失败后的状态

const isThenable = data => data && data.then && typeof data.then === 'function'
const isPromise = object => isThenable(object) && ('catch' in object) && typeof object.catch === 'function'
const noop = () => {}
const range = n => n === 0 ? [] : [n, ...range(n - 1)]

// resolve function
const statusProvider = (promise, status) => data => {
	if (promise.status !== PENDING) return false
	promise.status = status
	promise.result = data
	promise.listeners[status].forEach(fn => fn(data))
}

class APromise {
	constructor(executor) {
		if (typeof executor !== 'function') {
			throw new TypeError(`Promise resolver ${executor.toString()} is not a function`)
		}
		this.status = PENDING
		this.listeners = {
			FULFILLED: [],
			REJECTED: []
		}
		this.result = undefined

		try {
			executor(statusProvider(this, FULFILLED), statusProvider(this, REJECTED))
		} catch (e) {
			statusProvider(this, REJECTED)(e)
		}
	}
	// prototype method
	then(...args) {
		const child = new this.constructor(noop)

		const handler = fn => data => {
			if (typeof fn === 'function') {
				try {
					const result = fn(data)
					if (isThenable(result)) {
						isPromise(result) ? Object.assign(child, result) : Object.assign(child, new this.constructor(result.then))
					} else {
						statusProvider(child, FULFILLED)(result)
					}
				} catch (e) {
					statusProvider(child, REJECTED)(e)
				}
			} else if (!fn) {
				statusProvider(child, this.status)(data)
			}
		}
		switch (this.status) {
			case PENDING: {
				this.listeners[FULFILLED].push(handler(args[0]))
				this.listeners[REJECTED].push(handler(args[1]))
				break
			}
			case FULFILLED: {
				handler(args[0])(this.result)
				break
			}
			case REJECTED: {
				handler(args[1])(this.result)
				break
			}
		}
		return child
	}

	catch(arg) {
		return this.then(undefined, arg)
	}
}

APromise.resolve = data => {
	if (isPromise(data)) return data
	return isThenable(data) ? new APromise(data.then) : new APromise((resolve, reject) => resolve(data))
}

APromise.reject = err => new APromise((resolve, reject) => reject(err))

APromise.all = promises => {
	const length = promises.length
	const result = new APromise(noop)
	let count = 0
	const values = range(length)

	promises.forEach((p, i) => {
		p.then(data => {
			values[i] = data
			count++
			if (count === length) statusProvider(result, FULFILLED)(values)
		}, statusProvider(result, REJECTED))
	})
	return result
}

APromise.race = promises => {
	const result = new APromise(noop)
	promises.forEach((p, i) => {
		p.then(statusProvider(result, FULFILLED), statusProvider(result, REJECTED))
	})
	return result
}

export default APromise
