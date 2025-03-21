
export const convertToObj = colorSchemes => {
	const obj = {}

	colorSchemes.forEach( scheme => {
		obj[ scheme.key ] = scheme.colorScheme
	} )

	return obj
}

const camelToKebab = property => {
	const result = property.replace( /([a-z0-9])([A-Z])/g, '$1-$2' )

	// Convert the result to lowercase and return with '--stk-' prefix
	return '--stk-' + result.toLowerCase()
}

const getInheritedValue = ( property, currentState ) => {
	let value = property?.[ currentState ]

	if ( ! value && currentState === 'desktopHover' ) {
		value = property?.desktopParentHover
	}

	if ( ! value && currentState !== 'desktop' ) {
		value = property?.desktop
	}

	return value
}

const isGradient = value => value?.startsWith( 'linear-' ) || value?.startsWith( 'radial-' )

export const getCSS = ( scheme, mode = '' ) => {
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

			const inheritedValue = getInheritedValue( scheme[ property ], state )
			if ( state === 'desktopHover' && ! scheme[ property ]?.[ state ] && inheritedValue ) {
				decls[ state ].push( `${ customProperty }${ suffix }: ${ inheritedValue };` )
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

	return addThemeCompatibility( decls, scheme )
}

const addThemeCompatibility = ( decls, scheme ) => {
	const themeRegex = /stk--is-\w+-theme/gm
	const theme = document.querySelector( 'body' ).className.match( themeRegex )?.[ 0 ]

	if ( theme === 'stk--is-blocksy-theme' ) {
		const backgroundColor = camelToKebab( 'buttonBackgroundColor' )
		const textColor = camelToKebab( 'buttonTextColor' )

		const _decls = {
			desktop: [],
			desktopParentHover: [],
		}
		Object.keys( _decls ).forEach( state => {
			if ( scheme.buttonBackgroundColor?.[ state ] ) {
				_decls[ state ].push( `${ backgroundColor }: ${ scheme.buttonBackgroundColor?.[ state ] };` )
			}

			if ( scheme.buttonTextColor?.[ state ] ) {
				_decls[ state ].push( `${ textColor }: ${ scheme.buttonTextColor?.[ state ] };` )
			}
		} )

		if ( _decls.desktop.length ) {
			decls.desktop.push( `.stk-block-button{ ${ _decls.desktop.join( '' ) }}` )
		}
		if ( _decls.desktopParentHover.length ) {
			decls.desktopParentHover.push( `.stk-block-button{ ${ _decls.desktopParentHover.join( '' ) }}` )
		}
	}

	return decls
}
