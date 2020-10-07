import { EventEmitter, Subscription } from "./typings"

export class EmitterSubscription<T> implements Subscription {
	constructor(private emitter: EventEmitter<T>, public key: string) {}
	unsubscribe(): void {
		this.emitter.unsubscribe(this.key)
	}
}
