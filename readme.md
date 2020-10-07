# pubsubby

Typed PubSub library for TypeScript (publish-subscribe). It is a lightweight and depedency-free package.

## When is this useful?

Whenever you need to create a **typed event emitter** and have **consumers** (functions) **subscribe** to it. For instance:

1. Domain Events
2. Use cases in (Clean Architecture) expose typed events (e.g. `UserRegistered`, `PostDeleted`)
3. Event-based browser interactions

## Concepts

`Event` – a type or interface that describes the contents of the event

`EventEmitter` (interface) – the publisher that stores consumers and emits `Event`

`SimpleEventEmitter` – a simple-yet-working implemention of the `EventEmitter` interface

`Consumer` – a function that subscribes to an `EventEmitter` and receives its published `Event` data

`Subscription` – a simple object containing the subscription's key and an unsubscribe method

The source code is very simple so take a look at the `src/` folder.

## Example

Check out the `tests/` folder for quick examples but otherwise the below should work too.

```typescript
type DateTimeChanged = {
	datetime: Date
}

// Instanciate the emitter (e.g. in your use case's class)
const emitter = new SimpleEventEmitter<DateTimeChanged>()

// Create your event consumer
const consumer = async (event: DateTimeChanged) => {
	// Handle the event the way you want:
	// 1. parse, convert and publish to Kafka, AWS SQS, or GCP PubSub
	// 2. persist this to disk, or database
	// 3. here we just log that to the console
	console.log(`new event received:`, event)
}

// Subscribe that consumer to the emitter
const subscription = await emitter.subscribe(consumer)

// Emit an event (typed as DateTimeChanged automatically)
await emitter.publish({
	datetime: new Date(),
})

// You should see the event in the console

// f you want, unsubscribe the from subscription
subscription.unsubscribe()
// or from the emitter with the subscription key
emitter.unsubscribe(subscription.key)
```
