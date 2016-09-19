class APromise {
	constructor(exector) {
		this.status = 'pending'
		this.successListeners = []
		this.failureListeners = []

		exector(data => resolve(this, data), err => reject(this, err))
	}
	// prototype method
	then(...args) {
		let child = new this.constructor(noop)
		args.length === 1 && args.push(undefined)
		// 处理successFunction
		args.forEach((arg, i) => handlerThen(this, child, arg, i))

		return child
	}
	catch(arg) {
		return this.then(undefined, arg)
	}
}

APromise.resolve = data => {
	return data.then && typeof data.then === 'function' ? data : new APromise((resolve, reject) => delay(() => resolve(data), 0))
}
APromise.reject = err => {
	return new APromise((resolve, reject) => delay(() => reject(err), 0))
}
APromise.all = promises => {
	const length = promises.length
	const result = new APromise(noop)
	let count = 0
	const values = range(length)

	promises.forEach((p, i) => {
		p.then(data => {
			values[i] = data
			count++
			if (count === length) resolve(result, values)
		}, err => {
			reject(result, err)
		})
	})
	return result
}
APromise.race = promises => {
	const result = new APromise(noop)
	promises.forEach((p, i) => {
		p.then(data => resolve(result, data), err => reject(result, err))
	})
	return result
}
// handleThen
function handlerThen(parent, child, arg, type) {
	const listeners = type === 0 ? 'successListeners' : 'failureListeners'
	if (typeof arg === 'function') {
		const handler = function(data) {
			const result = arg(data)

			if (result && result.then && typeof result.then === 'function') {
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
function resolve(promise, data) {
	if (promise.status !== 'pending') return false
	promise.status = 'fulfilled'
	promise.successListeners.forEach(fn => fn(data))
}
// reject function
function reject(promise, err) {
	if (promise.status !== 'pending') return false
	promise.status = 'rejected'
	promise.failureListeners.forEach(fn => fn(err))
}

function noop() {}

function delay(fn, time) {
	setTimeout(() => fn(), time)
}

function range(n) {
	return n === 0 ? [] : [n, ...range(n - 1)]
}
