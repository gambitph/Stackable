import { useBlockColorSchemes } from '../../hooks/use-block-color-schemes'
import { useBlockLayoutDefaults } from '../../hooks/use-global-block-layout-defaults'

import { settings } from 'stackable'
import { generateStyles } from '~stackable/block-components'
import { createTypographyStyles } from '~stackable/util/typography/styles'
import { createTypographyDescription } from '~stackable/util/typography/description'
import { renderGlobalBlockLayoutStyles } from '~stackable/plugins/global-settings/utils/use-block-layout-editor-loader'
import { renderGlobalBlockStyleStyles } from '~stackable/plugins/global-settings/block-styles/editor-loader'
import { renderGlobalColorSchemeStyles } from '~stackable/plugins/global-settings/color-schemes/editor-loader'
import classnames from 'classnames'
import { omit } from 'lodash'

import { useSelect } from '@wordpress/data'
import { useMemo } from '@wordpress/element'

const NOOP = () => {}

export const useDesignSystem = () => {
	const {
		colors, _typography, buttonsAndIcons, spacingAndBorders, allBlockStyles,
	} = useSelect( select => {
		const colors = select( 'stackable/global-colors' ).getSettings().stackableColors || []
		const _typography = select( 'stackable/global-typography' ).getSettings() || {}
		const buttonsAndIcons = select( 'stackable/global-buttons-and-icons' ).getBlockLayouts() || {}
		const spacingAndBorders = select( 'stackable/global-spacing-and-borders' ).getBlockLayouts() || {}
		const _allBlockStyles = select( 'stackable/global-block-styles' ).getAllBlockStyles() || {}

		// Sort allBlockStyles alphabetically by key, keeping it as an object
		const allBlockStyles = Object.keys( _allBlockStyles )
			.sort()
			.reduce( ( acc, key ) => {
				acc[ key ] = _allBlockStyles[ key ]
				return acc
			}, {} )

		return {
			colors, _typography, buttonsAndIcons, spacingAndBorders, allBlockStyles,
		}
	}, [] )

	const { typography, typographyStyles } = useMemo( () => {
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
				stylesObject[ `${ key }.ugb-style-guide__typography-preview, .ugb-style-guide__preview-root ${ key }` ] = createTypographyStyles( '%s', 'desktop', value, { important: false } )
				stylesObject[ `${ key }.ugb-style-guide__typography-preview:not([data-device="desktop"]) ` ] = createTypographyStyles( '%s', 'tablet', value, { important: false } )
				stylesObject[ `${ key }.ugb-style-guide__typography-preview[data-device="mobile"] ` ] = createTypographyStyles( '%s', 'mobile', value, { important: false } )
				typography.desktop.push( [ key, createTypographyDescription( stylesForPreview, 'desktop', ' / ' ) ] )
				typography.tablet.push( [ key, createTypographyDescription( stylesForPreview, 'tablet', ' / ' ) ] )
				typography.mobile.push( [ key, createTypographyDescription( stylesForPreview, 'mobile', ' / ' ) ] )
			}
		} )

		const typographyStyles = generateStyles( stylesObject, '' ).join( '' )

		return { typography, typographyStyles }
	}, [ _typography ] )

	const { defaults: blockLayoutDefaults } = useBlockLayoutDefaults()

	const buttonIconStyles = useMemo( () => {
		return renderGlobalBlockLayoutStyles( buttonsAndIcons, blockLayoutDefaults, NOOP, 'normal', null, null, true )?.replaceAll( ':root', '.ugb-style-guide__preview-root' ) || ''
	}, [ buttonsAndIcons, blockLayoutDefaults ] )

	const spacingBorderStyles = useMemo( () => {
		return renderGlobalBlockLayoutStyles( spacingAndBorders, blockLayoutDefaults, NOOP, 'normal', null, null, true )?.replaceAll( ':root', '.ugb-style-guide__preview-root, .ugb-style-guide__preview' ) || ''
	}, [ spacingAndBorders, blockLayoutDefaults ] )

	const {
		getSortedColorSchemes,
		allColorSchemes,
		baseColorScheme,
		backgroundModeColorScheme,
		containerModeColorScheme,
	} = useBlockColorSchemes()

	const { colorSchemes, colorSchemeStyles } = useMemo( () => {
		const colorSchemes = getSortedColorSchemes()

		const _colorSchemeStyles = renderGlobalColorSchemeStyles(
			NOOP, allColorSchemes, baseColorScheme,
			backgroundModeColorScheme, containerModeColorScheme,
			'normal', true
		) ?? ''

		const colorSchemeStyles = _colorSchemeStyles.replaceAll( ':root', '.ugb-style-guide__preview-root' )

		return { colorSchemes, colorSchemeStyles }
	}, [ baseColorScheme, backgroundModeColorScheme, containerModeColorScheme, allColorSchemes ] )

	const BlockStyleStyles = useMemo( () => {
		return renderGlobalBlockStyleStyles( NOOP, allBlockStyles, true, true ) || ''
	}, [ allBlockStyles ] )

	const designSystemStyles = useMemo( () => [ typographyStyles, buttonIconStyles, spacingBorderStyles, colorSchemeStyles, BlockStyleStyles ].join( '\n' ), [
		typographyStyles,
		buttonIconStyles,
		spacingBorderStyles,
		colorSchemeStyles,
		BlockStyleStyles,
	] )

	const previewClassNames = useMemo( () => {
		return classnames( {
			'stk-has-block-style-inheritance': ! settings.disable_block_style_inheritance,
			'stk-has-color-schemes': colorSchemes.length > 0,
			'stk-has-design-system-buttons-and-icons': typeof buttonsAndIcons === 'object' && Object.keys( buttonsAndIcons ).length > 0,
			'stk-has-design-system-spacing-and-borders': typeof spacingAndBorders === 'object' && Object.keys( spacingAndBorders ).length > 0,
		} )
	}, [ colorSchemes, buttonsAndIcons, spacingAndBorders ] )

	return {
		colors,
		typography,
		allBlockStyles,
		colorSchemes: colorSchemes.length ? colorSchemes : undefined,
		designSystemStyles,
		previewClassNames,
	}
}
