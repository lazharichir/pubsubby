const getUUIDReplacer = (char: string) => {
	const r = (Math.random() * 16) | 0
	const v = char == `x` ? r : (r & 0x3) | 0x8
	return v.toString(16)
}

export const getUUID = () => {
	return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, getUUIDReplacer)
}
