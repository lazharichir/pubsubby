import { EmitterSubscription } from "./subscription"
import { Consumer, EventEmitter, Subscription } from "./typings"
import { getUUID } from "./utils"

export class SimpleEventEmitter<TArgs = any> implements EventEmitter<TArgs> {
	// eslint-disable-next-line quotes
	private consumers = new Map<Subscription["key"], Consumer<TArgs>>()

	public async subscribe(consumer: Consumer<TArgs>): Promise<Subscription> {
		const key = getUUID()
		this.consumers.set(key, consumer)
		return new EmitterSubscription<TArgs>(this, key)
	}

	public async publish(event: TArgs) {
		if (this.consumers.size === 0) return
		await Promise.all(Array.from(this.consumers).map(([key, consumer]) => consumer(event)))
	}

	// eslint-disable-next-line quotes
	public async unsubscribe(key: Subscription["key"]) {
		this.consumers.delete(key)
	}
}
