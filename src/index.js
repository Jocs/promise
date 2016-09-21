/**
 * create by Jocs 2016.09.19
 */

import {
	handlerThen,
	executorProvider,
	noop,
	range,
	isThenable,
	isPromise,
	fill
} from './utils'

import {
	RESOLVE,
	REJECT
} from './constants'

class APromise {
	constructor(executor) {
		if (typeof executor !== 'function') throw new TypeError('Promise constructor need a function as parameter')
		this.status = 'pending'
		this.successListeners = []
		this.failureListeners = []
		this.result = undefined

		try {
			executor(executorProvider(this, RESOLVE),  executorProvider(this, REJECT))
		} catch(err) {
			executorProvider(this, REJECT)(err)
		}
	}
	// prototype method
	then(...args) {
		let child = new this.constructor(noop)
		const handledArgs = fill(args, 2)
		// 处理successFunction
		handledArgs.forEach((arg, i) => handlerThen(this, child, arg, i))

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
			if (count === length) executorProvider(result, RESOLVE)(values)
		}, executorProvider(result, REJECT))
	})
	return result
}
APromise.race = promises => {
	const result = new APromise(noop)
	promises.forEach((p, i) => {
		p.then(executorProvider(result, RESOLVE), executorProvider(result, REJECT))
	})
	return result
}

export default APromise

