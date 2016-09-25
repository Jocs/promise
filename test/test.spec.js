/**
 * create by Jocs 2016-09-25
 */
import APromise from '../src'

describe('Test APromise async use!', () => {
	let promise
	let value
	beforeEach(done => {
		promise = new APromise((resolve, reject) => {
			setTimeout(() => {
				resolve(5)
 			}, 1000)
		})
		.then(d => {
			value = d
			done()
		})
	})
	it('APromise should surport basic async use', done => {
		expect(value).toBe(5)
		done()
	})
})

describe('APromise basic use when reject', () => {
	let value
	let promise
	beforeEach(done => {
		promise = new APromise((resolve, reject) => {
			setTimeout(() => {
				reject(5)
			}, 1000)
		})

		promise
		.then()
		.catch(err => {
			value = err
		})
	})
	it('should test the use when reject', done => {
		expect(value).toBe(5)
		done()
	})
})





