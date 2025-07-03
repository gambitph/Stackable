import { kebabCase } from 'lodash'

import { applyFilters } from '@wordpress/hooks'

/*
 * colorSchemes is originally an array of objects:
 * [ {
 * name: 'Default Scheme',
 * key: 'scheme-default-1',
 * colorScheme: Object
 * hideInPicker: false,
 * }, ... ]
 *
 * This returns an object with the color scheme key as the key
 * and the color scheme object as the value:
 *
 */
export const convertToObj = colorSchemes => {
	const obj = {}

	colorSchemes.forEach( scheme => {
		obj[ scheme.key ] = scheme.colorScheme
	} )

	return obj
}

// Check if the color scheme contains a value for any of the states
export const schemeHasValue = scheme => {
	const hasValue = Object.values( scheme ).some( states => {
		return Object.values( states ).some( value => value !== '' )
	} )

	return hasValue
}

const camelToKebab = property => {
	const result = kebabCase( property )

	// Convert the result to lowercase and return with '--stk-' prefix
	return '--stk-' + result
}

const getInheritedValue = ( property, currentState, inheritParentHover = true ) => {
	let value = property?.[ currentState ]

	// The block should inherit the desktopParentHover value on hover state if it is a container scheme
	if ( ! value && currentState === 'desktopHover' && inheritParentHover ) {
		value = property?.desktopParentHover
	}

	if ( ! value && currentState !== 'desktop' ) {
		value = property?.desktop
	}

	return value
}

const isGradient = value => value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

export const getCSS = ( scheme, currentHoverState = 'normal', mode = '' ) => {
	const states = [ 'desktop', 'desktopHover', 'desktopParentHover' ]
	const properties = [
		'backgroundColor',
		'headingColor',
		'textColor',
		'linkColor',
		'accentColor',
		'buttonBackgroundColor',
		'buttonTextColor',
		'buttonOutlineColor',
	]

	const decls = {
		desktop: [],
		desktopHover: [],
		desktopParentHover: [],
	}

	states.forEach( state => {
		const suffix = state === 'desktopHover' ? '-hover' : ''
		properties.forEach( property => {
			const varname = mode === 'background' ? 'block' : 'container'
			const customProperty = property === 'backgroundColor'
				? `--stk-${ varname }-background-color` : camelToKebab( property )

			// Add background color only if it is a background or container scheme
			if ( property === 'backgroundColor' && ! mode ) {
				return
			}

			if ( scheme[ property ]?.[ state ] ) {
				decls[ state ].push( `${ customProperty }${ suffix }: ${ scheme[ property ]?.[ state ] };` )

				if ( property === 'accentColor' ) {
					decls[ state ].push( `${ camelToKebab( 'subtitleColor' ) }${ suffix }: ${ scheme[ property ]?.[ state ] };` )
				}
			}

			const inheritedValue = getInheritedValue( scheme[ property ], state )
			// const inheritedNormalValue = getInheritedValue( scheme[ property ], state, false )
			if ( state === 'desktopParentHover' && currentHoverState !== 'normal' && property !== 'backgroundColor' && inheritedValue ) {
				decls.desktopHover.push( `${ customProperty }-parent-hover: ${ inheritedValue };` )

				if ( property === 'accentColor' ) {
					decls[ state ].push( `${ camelToKebab( 'subtitleColor' ) }-parent-hover: ${ inheritedValue };` )
				}
			}

			/**
			 * DEV NOTE: The code below is commented out because it is the initial implementation.
			 * Before, we set the `*-hover` properties to inherit the normal/parent-hover values.
			 * However, this was causing some issues with the hover states.
			 *
			 * The new implementation now relies on CSS variables and fallback values.
			 */
			// Inherit the normal value on hover state
			/* if ( state === 'desktopHover' && ! scheme[ property ]?.[ state ] && inheritedNormalValue ) {
			 	decls.desktop.push( `${ customProperty }${ suffix }: ${ inheritedNormalValue };` )
			}

			// Inherit the parent-hover value on hover state
			if ( state === 'desktopHover' && ! scheme[ property ]?.[ state ] && inheritedValue ) {
				decls.desktopParentHover.push( `${ customProperty }${ suffix }: ${ inheritedValue };` )
			} */

			// If button background color is gradient, plain style buuttons should use the button outline color.
			if ( property === 'buttonBackgroundColor' && isGradient( scheme[ property ]?.[ state ] ) ) {
				decls[ state ].push( `:where(.is-style-plain){ --stk-button-plain-text-color${ suffix }: var(--stk-button-outline-color${ suffix }); }` )
			}
		} )
	} )

	/**
	 * DEV NOTE: The code below is commented out because it is the initial implementation.
	 * Before, we set the `*-hover` properties to inherit the normal/parent-hover values.
	 * However, this was causing some issues with the hover states.
	 *
	 * The new implementation now relies on CSS variables and fallback values.
	 */
	// if the button background color is gradient on normal or parent-hover states,
	// and there's no button background color set on hover,
	// plain-style buttons will turn black.
	// To prevent this, use button-outline-color-hover.
	/* if ( isGradient( scheme.buttonBackgroundColor?.desktop ) && ! scheme.buttonBackgroundColor?.desktopHover ) {
	 	decls.desktopHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color-hover: var(--stk-button-outline-color-hover); }` )
	 }

	if ( isGradient( scheme.buttonBackgroundColor?.desktopParentHover ) && ! scheme.buttonBackgroundColor?.desktopHover ) {
	 	decls.desktopParentHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color-hover: var(--stk-button-outline-color-hover); }` )
	} */

	// if the button background color is gradient on normal state and solid on parent-hover state,
	// we need to unset the --stk-button-plain-text-color,
	// so that plain-style buttons on parent-hover state will use the button background color.
	if ( isGradient( scheme.buttonBackgroundColor?.desktop ) &&
		scheme.buttonBackgroundColor?.desktopParentHover && ! isGradient( scheme.buttonBackgroundColor?.desktopParentHover ) ) {
		decls.desktopParentHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color: unset;--stk-button-plain-text-color-hover:unset; }` )
	}

	return addThemeCompatibility( decls, scheme, mode )
}

// These colors are used when there are color schemes but the default container scheme is empty
export const getDefaultColors = () => {
	let decls = ''

	decls += '--stk-background-color: var(--stk-default-container-background-color, #fff);'
	decls += '--stk-heading-color: var(--stk-default-heading-color, initial);'
	decls += '--stk-text-color: var(--stk-container-color, initial);'
	decls += '--stk-link-color: var(--stk-default-link-color, var(--stk-text-color, initial));'
	decls += '--stk-accent-color: #ddd;'
	decls += '--stk-subtitle-color: #39414d;'
	decls += '--stk-default-icon-color: var(--stk-icon-color);'
	decls += '--stk-button-background-color: var(--stk-default-button-background-color, #008de4);'
	decls += '--stk-button-text-color: var(--stk-default-button-text-color, #fff);'
	decls += '--stk-button-outline-color: var(--stk-default-button-background-color, #008de4);'

	return decls
}

export const unsetDefaultColors = () => {
	let decls = ''

	decls += '--stk-default-icon-color: unset;'

	return decls
}

const addThemeCompatibility = ( decls, scheme, mode ) => {
	const themeRegex = /stk--is-\w+-theme/gm
	const theme = document.querySelector( 'body' ).className.match( themeRegex )?.[ 0 ]

	decls = applyFilters( 'stackable.global-settings.global-color-schemes.add-theme-compatibility', decls, scheme, mode, theme )

	return decls
}
