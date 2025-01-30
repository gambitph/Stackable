/**
 * External dependencies
 */
import { range } from 'lodash'

export const addStyles = ( blockStyleGenerator, props = {} ) => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		hasRowGap = true,
		columnWrapDesktopSaveStyleRule = '',
	} = props

	blockStyleGenerator.addBlockStyles( 'columnSpacing', [ {
		...propsToPass,
		selector: '.%s-column',
		styleRule: '--stk-columns-spacing',
		attrName: 'columnSpacing',
		hasUnits: 'px',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'columnGap', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: '--stk-column-gap',
		attrName: 'columnGap',
		format: '%spx',
		responsive: 'all',
	}, {
		...propsToPass,
		renderIn: 'edit',
		selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
		styleRule: '--stk-column-gap',
		attrName: 'columnGap',
		format: '%spx',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyles( 'columnWrapDesktop', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: columnWrapDesktopSaveStyleRule || 'flexWrap',
		attrName: 'columnWrapDesktop',
		valueCallback: value => value ? 'wrap' : undefined,
	}, {
		...propsToPass,
		renderIn: 'edit',
		selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
		styleRule: 'flexWrap',
		attrName: 'columnWrapDesktop',
		valueCallback: value => value ? 'wrap' : undefined,
	} ] )

	// Desktop columns stretch to the whole width because of flex-grow, we need
	// to force it to not grow or else we cannot specify a column that's 50%
	// (and alone without any column beside it) because it will always stretch
	// to 100%.
	blockStyleGenerator.addBlockStyles( 'columnWrapDesktop', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: '--stk-flex-grow',
		attrName: 'columnWrapDesktop',
		valueCallback: value => value ? '0' : undefined,
	} ] )

	if ( hasRowGap ) {
		blockStyleGenerator.addBlockStyles( 'rowGap', [ {
			...propsToPass,
			renderIn: 'save',
			selector: '.%s-column',
			styleRule: 'rowGap',
			attrName: 'rowGap',
			format: '%spx',
			responsive: 'all',
		}, {
			...propsToPass,
			renderIn: 'edit',
			selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
			styleRule: 'rowGap',
			attrName: 'rowGap',
			format: '%spx',
			responsive: 'all',
		} ] )
	}

	blockStyleGenerator.addBlockStyles( 'columnJustify', [ {
		...propsToPass,
		renderIn: 'save',
		selector: '.%s-column',
		styleRule: 'justifyContent',
		attrName: 'columnJustify',
		responsive: 'all',
	}, {
		...propsToPass,
		renderIn: 'edit',
		selector: '.%s-column > .block-editor-inner-blocks > .block-editor-block-list__layout',
		styleRule: 'justifyContent',
		attrName: 'columnJustify',
		responsive: 'all',
	} ] )

	blockStyleGenerator.addBlockStyleConditionally( ( attributes, addBlockCssFunc ) => {
		const numColumns = ( attributes.columnArrangementMobile || attributes.columnArrangementTablet || '' ).split( ',' ).length

		range( 1, numColumns + 1 ).forEach( i => {
			addBlockCssFunc( {
				...propsToPass,
				// In the editor, target the specific column to change the order.
				renderIn: 'edit',
				selector: `> .stk-block-content > .block-editor-inner-blocks > .block-editor-block-list__layout > :nth-child(${ i })`,
				styleRule: 'order',
				responsive: 'all',
				attrName: 'columnArrangement',
				valueCallback: value => {
					// Look for the order in the values list for the column i
					return ( value.split( ',' ) || [] ).indexOf( i.toString() ) + 1
				},
				valuePreCallback: ( value, getAttribute, device ) => {
					const tabletAttribute = getAttribute( 'columnArrangement', 'tablet' )
					if ( device === 'mobile' && ! value && tabletAttribute ) {
						return [ ...Array( numColumns ).keys() ].map( i => i + 1 ).join( ',' )
					}
					return value
				},
			} )

			addBlockCssFunc( {
				// In the frontend, use the css custom property to specify the order.
				// See style.scss We do this because we cannot use the direct descendent
				// selector ">" in the saved CSS or else non-admin users in multisite
				// will encounter block errors (this is a WP issue)
				renderIn: 'save',
				styleRule: `--stk-col-order-${ i }`,
				responsive: 'all',
				attrName: 'columnArrangement',
				valueCallback: value => {
					// Look for the order in the values list for the column i
					return ( value.split( ',' ) || [] ).indexOf( i.toString() ) + 1
				},
				valuePreCallback: ( value, getAttribute, device ) => {
					const tabletAttribute = getAttribute( 'columnArrangement', 'tablet' )
					if ( device === 'mobile' && ! value && tabletAttribute ) {
						return [ ...Array( numColumns ).keys() ].map( i => i + 1 ).join( ',' )
					}
					return value
				},
			} )
		} )
	} )
}
