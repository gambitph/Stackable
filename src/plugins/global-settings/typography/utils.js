/**
 * Returns the reversely computed typescale based on the typography settings and device type
 *
 * @param {Object} typographySettings - The typography settings object
 * @param {string} deviceType - The device type
 * @return {string} The computed typescale. Values can be none, custom, or the numeric scale.
 */
export const getTypographyTypeScale = ( typographySettings, deviceType ) => {
	const fontSizeKey = getDevicePropertyKey( 'fontSize', deviceType )
	const fontSizeUnitKey = getDevicePropertyKey( 'fontSizeUnit', deviceType )
	const tags = Object.keys( typographySettings )

	// Reversely compute the type scale from the font sizes
	let typeScale = typographySettings?.h6?.[ fontSizeKey ]
	typeScale = typeScale && parseFloat( typeScale ).toString()

	if ( typeScale ) {
		const computedApplied = getAppliedTypeScale( typeScale, deviceType ) ?? {}
		for ( const tag of tags ) {
			// console.log( typographySettings[ tag ]?.[ fontSizeKey ], computedApplied[ tag ]?.[ fontSizeKey ] )
			// If font size mismatch, set typography scale to Custom
			if ( typographySettings[ tag ]?.[ fontSizeKey ] !== computedApplied[ tag ]?.[ fontSizeKey ] ||
					typographySettings[ tag ]?.[ fontSizeUnitKey ] !== computedApplied[ tag ]?.[ fontSizeUnitKey ]
			) {
				typeScale = 'custom'
			}
		}
	} else {
		typeScale = 'none'
		for ( const tag of tags ) {
			if ( typographySettings[ tag ]?.[ fontSizeKey ] ) {
				typeScale = 'custom'
			}
		}
	}
	return typeScale
}

/**
 * Returns the property key adjusted for the given device type.
 *
 * @param {string} baseProperty - The base property name
 * @param {string} deviceType - The device type
 * @return {string} The adjusted property key based on the device type.
 *
 */
export const getDevicePropertyKey = ( baseProperty, deviceType ) => {
	deviceType = deviceType.toLowerCase()
	if ( deviceType && deviceType !== 'desktop' ) {
		return `${ deviceType }${ baseProperty.charAt( 0 ).toUpperCase() }${ baseProperty.slice( 1 ) }`
	}
	return baseProperty
}

/**
 * Generates a typographic scale based on the given value.
 *
 * This function returns an object where each key represents a text element
 * (e.g., `h1`, `h2`, `p`, etc.) and its value contains a `fontSize` and `fontSizeUnit`,
 * calculated using an exponential scale.
 *
 * @param {string|number} value - The base number to use for the typographic scale.
 * @param {string} deviceType - The device type
 * @return {Object|undefined} An object mapping CSS selectors to their corresponding
 *                              font size settings. Returns `undefined` if input is invalid.
 */

export const getAppliedTypeScale = ( value, deviceType = '' ) => {
	const typeScale = Number( value )
	if ( Number.isNaN( typeScale ) ) {
		return
	}

	const headings = {
		h1: 6,
		h2: 5,
		h3: 4,
		h4: 3,
		h5: 2,
		h6: 1,
		p: 0,
		'.stk-subtitle': -1,
		'.stk-button__inner-text': 0,
	}

	const result = {}

	Object.entries( headings ).forEach( ( [ key, power ] ) => {
		let fontSize
		if ( power > 0 ) {
			fontSize = String( Math.pow( typeScale, power ).toFixed( 3 ) )
		} else if ( power === 0 ) {
			fontSize = '1'
		} else {
			fontSize = String( ( 1 / typeScale ).toFixed( 3 ) )
		}

		const fontSizeKey = getDevicePropertyKey( 'fontSize', deviceType )
		const fontSizeUnitKey = getDevicePropertyKey( 'fontSizeUnit', deviceType )

		result[ key ] = {
			[ fontSizeKey ]: fontSize,
			[ fontSizeUnitKey ]: 'rem',
		}
	} )

	return result
}

/**
 * Remove empty string properties from the given styles object
 *
 * @param {Object} styles - The typography styles object
 * @return {Object} An object with removed empty string properties
 */

export const cleanTypographyStyle = styles => {
	if ( ! styles ) {
		return {}
	}
	return Object.fromEntries(
		Object.entries( styles ).filter( ( [ , value ] ) => value !== '' )
	)
}
