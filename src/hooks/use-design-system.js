import { useSelect } from '@wordpress/data'
import { omit } from 'lodash'
import { generateStyles } from '~stackable/block-components'
import { createTypographyDescription, createTypographyStyles } from '~stackable/util'

export const useDesignSystem = () => {
	const {
		colors, typography, designSystemStyles,
	} = useSelect( select => {
		const colors = select( 'stackable/global-colors' ).getSettings().stackableColors || []
		const _typography = select( 'stackable/global-typography' ).getSettings() || {}

		const stylesObject = {}
		const typography = {
			desktop: [],
			tablet: [],
			mobile: [],
		}

		const typographySelectors = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', '.stk-subtitle', '.stk-button__inner-text' ]
		typographySelectors.forEach( key => {
			if ( _typography[ key ] ) {
				const value = _typography[ key ]
				const stylesForPreview = omit( value, [ 'lineHeight', 'tabletLineHeight', 'mobileLineHeight' ] )
				stylesObject[ `${ key }.ugb-style-guide__typography-preview` ] = createTypographyStyles( '%s', 'desktop', value, { important: false } )
				stylesObject[ `${ key }.ugb-style-guide__typography-preview:not([data-device="desktop"]) ` ] = createTypographyStyles( '%s', 'tablet', value, { important: false } )
				stylesObject[ `${ key }.ugb-style-guide__typography-preview[data-device="mobile"] ` ] = createTypographyStyles( '%s', 'mobile', value, { important: false } )
				typography.desktop.push( [ key, createTypographyDescription( stylesForPreview, 'desktop', ' / ' ) ] )
				typography.tablet.push( [ key, createTypographyDescription( stylesForPreview, 'tablet', ' / ' ) ] )
				typography.mobile.push( [ key, createTypographyDescription( stylesForPreview, 'mobile', ' / ' ) ] )
			}
		} )

		const designSystemStyles = generateStyles( stylesObject, '' ).join( '' )

		// TODO: get other settings in the design system

		return {
			colors, typography, designSystemStyles,
		}
	}, [] )

	return {
		colors,
		typography,
		designSystemStyles,
	}
}
