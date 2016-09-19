/**
 * create by Jocs 2016.09.19
 */

import {
	handlerThen,
	resolve,
	reject,
	noop,
	delay,
	range,
	isThenable
} from './utils'

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
	return isThenable(data) ? data : new APromise((resolve, reject) => delay(() => resolve(data), 0))
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

export default APromise

