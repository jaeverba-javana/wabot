export const save = (user) => {

}

export const update = (user) => {

}

export const get = () => {}

export const clean = (user) => {
	const o = {}
	Object.getOwnPropertyNames(user._doc).forEach(i => {
		if (!['password'].includes(i))
			o[i] = user[i]
	})
	return o
}