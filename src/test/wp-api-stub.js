/**
 * This stub is needed for wp.api calls.
 */
module.exports = {
	loadPromise: Promise.resolve(),
	models: {
		Settings: () => {
			return {
				save: () => {},
				fetch: () => Promise.resolve( {} ),
			}
		},
	},
}
