export type EventList<Events> = {
	[key in keyof Events]: EventEmitter<Events[key]>
}

export interface EventEmitter<Event = any> {
	publish: (event: Event) => Promise<void>
	subscribe: (consumer: Consumer<Event>) => Promise<Subscription>
	// eslint-disable-next-line quotes
	unsubscribe: (key: Subscription["key"]) => Promise<void>
}

export interface Consumer<Event> {
	(event: Event): Promise<void>
}

export interface Subscription {
	key: string | symbol
	unsubscribe(): void
}

export class EmptySubscription implements Subscription {
	public key = Symbol()
	public async unsubscribe() {
		return
	}
}
