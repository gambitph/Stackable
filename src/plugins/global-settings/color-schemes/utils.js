export const convertToObj = colorSchemes => {
	const obj = {}

	colorSchemes.forEach( scheme => {
		obj[ scheme.key ] = scheme.colorScheme
	} )

	return obj
}

export const schemeHasValue = scheme => {
	const hasValue = Object.values( scheme ).some( states => {
		return Object.values( states ).some( value => value !== '' )
	} )

	return hasValue
}

const camelToKebab = property => {
	const result = property.replace( /([a-z0-9])([A-Z])/g, '$1-$2' )

	// Convert the result to lowercase and return with '--stk-' prefix
	return '--stk-' + result.toLowerCase()
}

const getInheritedValue = ( property, currentState, mode ) => {
	let value = property?.[ currentState ]

	if ( ! value && currentState === 'desktopHover' && mode === 'container' ) {
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

			if ( property === 'backgroundColor' && ! mode ) {
				return
			}

			if ( scheme[ property ]?.[ state ] ) {
				decls[ state ].push( `${ customProperty }${ suffix }: ${ scheme[ property ]?.[ state ] };` )
			}

			const inheritedValue = getInheritedValue( scheme[ property ], state, mode )
			if ( state === 'desktopParentHover' && currentHoverState !== 'normal' && property !== 'backgroundColor' && inheritedValue ) {
				decls.desktopHover.push( `${ customProperty }-parent-hover: ${ inheritedValue };` )
			}

			if ( state === 'desktopHover' && ! scheme[ property ]?.[ state ] && inheritedValue ) {
				decls[ state ].push( `${ customProperty }${ suffix }: ${ inheritedValue };` )
			}

			if ( currentHoverState !== 'normal' ) {
				const currentHover = mode === '' && currentHoverState === 'parent-hover' ? '' : `-${ currentHoverState }`
				decls.desktopHover.push( `${ customProperty }-current-hover: var(${ customProperty }${ currentHover });` )
			}

			if ( property === 'buttonBackgroundColor' && isGradient( scheme[ property ]?.[ state ] ) ) {
				decls[ state ].push( `:where(.is-style-plain){ --stk-button-plain-text-color${ suffix }: var(--stk-button-outline-color${ suffix }); }` )
			}
		} )
	} )

	if ( isGradient( scheme.buttonBackgroundColor?.desktop ) && ! scheme.buttonBackgroundColor?.desktopHover ) {
		decls.desktopHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color-hover: var(--stk-button-outline-color-hover); }` )
	}

	if ( isGradient( scheme.buttonBackgroundColor?.desktopParentHover ) && ! scheme.buttonBackgroundColor?.desktopHover ) {
		decls.desktopParentHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color-hover: var(--stk-button-outline-color-hover); }` )
	}

	if ( isGradient( scheme.buttonBackgroundColor?.desktop ) &&
		scheme.buttonBackgroundColor?.desktopParentHover && ! isGradient( scheme.buttonBackgroundColor?.desktopParentHover ) ) {
		decls.desktopParentHover.push( `:where(.is-style-plain){ --stk-button-plain-text-color: unset;--stk-button-plain-text-color-hover:unset; }` )
	}

	return addThemeCompatibility( decls, scheme, mode )
}

const addThemeCompatibility = ( decls, scheme, mode ) => {
	const themeRegex = /stk--is-\w+-theme/gm
	const theme = document.querySelector( 'body' ).className.match( themeRegex )?.[ 0 ]

	if ( theme === 'stk--is-blocksy-theme' ) {
		let buttonSelector = ''
		const backgroundProperty = camelToKebab( 'buttonBackgroundColor' )
		const textProperty = camelToKebab( 'buttonTextColor' )

		switch ( mode ) {
			case 'background':
				buttonSelector = [
					' > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])',
					' > :where(.stk-inner-blocks) > :where(div) > :where(div) > :where([data-type="stackable/button-group"]) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])',
				].join( ',' )
				break
			case 'container':
				buttonSelector = ' > :where(div) > :where(div) > :where([data-type="stackable/button-group"]) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])'
				break
			default:
				buttonSelector = ' :where([data-type="stackable/button-group"]) > :where(.stk-block:not(.stk-block-background)) > :where(.stk-button-group) > :where(div) > :where(div) > div:where([data-type="stackable/button"])'
		}

		const _decls = {
			desktop: [],
			desktopParentHover: [],
		}

		Object.keys( _decls ).forEach( state => {
			const bgValue = getInheritedValue( scheme.buttonBackgroundColor, state, mode )
			decls[ state ].push( `${ buttonSelector }{${ backgroundProperty }: ${ bgValue };}` )

			const textValue = getInheritedValue( scheme.buttonTextColor, state, mode )
			decls[ state ].push( `${ buttonSelector }{${ textProperty }: ${ textValue };}` )
		} )
	}

	return decls
}
