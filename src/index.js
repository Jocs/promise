/**
 * create by Jocs 2016.09.19
 */

import {
	handlerThen,
	resolveProvider,
	rejectProvider,
	noop,
	delay,
	range,
	isThenable,
	isPromise
} from './utils'

class APromise {
	constructor(exector) {
		this.status = 'pending'
		this.successListeners = []
		this.failureListeners = []

		delay(() => exector(resolveProvider(this), rejectProvider(this)))
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
	if (isPromise(data)) return data
	return isThenable(data) ? new APromise(data.then) : new APromise((resolve, reject) => resolve(data))
}

APromise.reject = err =>  new APromise((resolve, reject) => reject(err))

APromise.all = promises => {
	const length = promises.length
	const result = new APromise(noop)
	let count = 0
	const values = range(length)

	promises.forEach((p, i) => {
		p.then(data => {
			values[i] = data
			count++
			if (count === length) resolveProvider(result)(values)
		}, rejectProvider(result))
	})
	return result
}
APromise.race = promises => {
	const result = new APromise(noop)
	promises.forEach((p, i) => {
		p.then(resolveProvider(result), rejectProvider(result))
	})
	return result
}
window.Promise = APromise
export default APromise

