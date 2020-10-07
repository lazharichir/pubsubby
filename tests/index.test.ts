import { SimpleEventEmitter } from "../src"

type DateTimeChanged = {
	datetime: Date
}

type SomethingHappened = {
	what: string
}

test(`should initialize a simple event emitter`, () => {
	const emitter = new SimpleEventEmitter<DateTimeChanged>()
	expect(emitter).toBeInstanceOf(SimpleEventEmitter)
})

test(`should receive a subscription`, async () => {
	const emitter = new SimpleEventEmitter<DateTimeChanged>()
	const consumer = (event: any) => Promise.resolve(console.log(`consumer:`, event))
	const subscription = await emitter.subscribe(consumer)
	expect(subscription.key).toBeDefined()
	expect(subscription.unsubscribe).toBeDefined()
	expect([`string`, `symbol`].includes(typeof subscription.key)).toBeTruthy()
})

test(`should receive a unique subscription key`, async () => {
	const emitter = new SimpleEventEmitter<DateTimeChanged>()
	const consumer = (event: any) => Promise.resolve(console.log(`consumer:`, event))
	const keys = (
		await Promise.all(
			Array(10000)
				.fill(null)
				.map(async () => {
					return emitter.subscribe(consumer)
				})
		)
	).map((sub) => sub.key)

	const uniqueKeys = [...new Set(keys)]

	expect(keys).toHaveLength(uniqueKeys.length)
})

test(`should call the consumer`, async () => {
	const emitter = new SimpleEventEmitter<DateTimeChanged>()
	let i = false
	const consumer = async (event: any) => {
		i = true
	}
	const subscription = await emitter.subscribe(consumer)

	expect(i).toStrictEqual(false)

	await emitter.publish({
		datetime: new Date(),
	})

	expect(i).toStrictEqual(true)
})

test(`should not call the consumer after unsubcribing`, async () => {
	const emitter = new SimpleEventEmitter<DateTimeChanged>()
	let i = false
	const consumer = async (event: any) => {
		i = true
	}
	const subscription = await emitter.subscribe(consumer)

	expect(i).toStrictEqual(false)

	await emitter.unsubscribe(subscription.key)

	await emitter.publish({
		datetime: new Date(),
	})

	expect(i).toStrictEqual(false)
})

test(`should publish the same event to all subscribers`, async () => {
	const emitter = new SimpleEventEmitter<DateTimeChanged>()
	const payloads: any[] = []
	const consumer = async (event: any) => {
		payloads.push(event)
	}
	const keys = await Promise.all(
		Array(10000)
			.fill(null)
			.map(async () => {
				return emitter.subscribe(consumer)
			})
	)

	const data = {
		datetime: new Date(),
	}

	await emitter.publish(data)

	expect(payloads).toHaveLength(keys.length)
	expect(payloads.shift()).toStrictEqual(data)
	expect(payloads.pop()).toStrictEqual(data)
})

test(`should not emit events to the wrong consumer`, async () => {
	const emitters = {
		a: new SimpleEventEmitter<DateTimeChanged>(),
		b: new SimpleEventEmitter<SomethingHappened>(),
	}

	const payloads: { a: DateTimeChanged[]; b: SomethingHappened[] } = {
		a: [],
		b: [],
	}

	const consumers = {
		a: async (event: DateTimeChanged) => {
			payloads.a.push(event)
		},
		b: async (event: SomethingHappened) => {
			payloads.b.push(event)
		},
	}

	const subscriptions = {
		a: await emitters.a.subscribe(consumers.a),
		b: await emitters.b.subscribe(consumers.b),
		c: await emitters.b.subscribe(consumers.b),
	}

	expect(payloads.a).toHaveLength(0)
	expect(payloads.b).toHaveLength(0)

	const data = {
		a: { datetime: new Date() },
		b: { what: `something` },
	}

	await emitters.a.publish(data.a)

	expect(payloads.a).toHaveLength(1)
	expect(payloads.b).toHaveLength(0)

	await emitters.b.publish(data.b)

	expect(payloads.a).toHaveLength(1)
	expect(payloads.b).toHaveLength(2)
	expect(payloads.a[0]).toStrictEqual(data.a)
	expect(payloads.b[0]).toStrictEqual(data.b)
	expect(payloads.b[1]).toStrictEqual(data.b)
})
