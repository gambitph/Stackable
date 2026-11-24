/**
 * Internal dependencies
 */
import { blockStyleGenerators } from '../lazy-components/style-guide/block-style-generators'
import { CssSaveCompiler } from '~stackable/components/block-css'
import { replaceBlockStyleSelectors } from '~stackable/util/block-style-css'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { __, sprintf } from '@wordpress/i18n'

export const generateSiteKitBlockStyles = ( portableStyles, version ) => {
	const generators = applyFilters( 'stackable.site-kits.block-style-generators', blockStyleGenerators )
	return Object.entries( portableStyles ).reduce( ( generated, [ blockName, styles ] ) => {
		const generator = generators[ blockName ]
		if ( ! generator ) {
			throw new Error( sprintf(
				/* translators: %s is a block type name. */
				__( 'The block style generator for %s is unavailable.', i18n ),
				blockName
			) )
		}

		generated[ blockName ] = styles.map( ( style, index ) => {
			const uniqueId = `site-kit-${ index }`
			const clientId = `site-kit-${ blockName.replace( '/', '-' ) }-${ index }`
			const attributes = { ...style.attributes, uniqueId }
			const attributeNames = generator.getAttributesWithValues( attributes )
			const definitions = generator.getBlockStyles( attributeNames )
			const compiler = new CssSaveCompiler()
			const saveCss = generator.generateBlockStylesForSave( compiler, attributes, definitions, { version } )
			const editCss = generator.generateBlockStylesForEditor( attributes, definitions, {
				blockState: 'normal',
				clientId,
				generateForAllBlockStates: true,
				instanceId: '',
				uniqueId,
				version,
			} )

			return {
				...style,
				saveCss: replaceBlockStyleSelectors( saveCss, uniqueId, clientId, style.slug ),
				editCss: replaceBlockStyleSelectors( editCss, uniqueId, clientId, style.slug, 'edit' ),
			}
		} )
		return generated
	}, {} )
}
