/**
 * Generates a typographic scale based on the given value.
 *
 * This function returns an object where each key represents a text element
 * (e.g., `h1`, `h2`, `p`, etc.) and its value contains a `fontSize` and `fontSizeUnit`,
 * calculated using an exponential scale.
 *
 * @param {string|number} value - The base number to use for the typographic scale.
 * @return {Object|undefined} An object mapping CSS selectors to their corresponding
 *                              font size settings. Returns `undefined` if input is invalid.
 */

export const getAppliedTypeScale = value => {
	const typeScale = Number( value )
	if ( Number.isNaN( typeScale ) ) {
		return
	}
	return {
		h1: { fontSize: String( Math.pow( typeScale, 6 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h2: { fontSize: String( Math.pow( typeScale, 5 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h3: { fontSize: String( Math.pow( typeScale, 4 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h4: { fontSize: String( Math.pow( typeScale, 3 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h5: { fontSize: String( Math.pow( typeScale, 2 ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		h6: { fontSize: String( typeScale.toFixed( 3 ) ), fontSizeUnit: 'rem' },
		p: { fontSize: '1', fontSizeUnit: 'rem' },
		'.stk-subtitle': { fontSize: String( ( 1 / typeScale ).toFixed( 3 ) ), fontSizeUnit: 'rem' },
		'.stk-button__inner-text': { fontSize: '1', fontSizeUnit: 'rem' },
	}
}
