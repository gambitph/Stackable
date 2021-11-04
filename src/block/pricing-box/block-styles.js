/**
 * External dependencies
 */
import { i18n, isPro } from 'stackable'
import { defaultsDeep, remove } from 'lodash'

/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { createBlock } from '@wordpress/blocks'

/**
 * Internal dependencies
 */
import ImageDefault from './images/default.svg'
import ImageCompact from './images/compact.svg'
import ImageBanner from './images/banner.svg'
import ImageColored from './images/colored.svg'
import ImageSectioned from './images/sectioned.svg'
import { createUniqueClass } from '~stackable/block-components/block-div/use-unique-id'

const withDefault = ( migrate = {} ) => defaultsDeep( {
	attributes: {},
	innerBlocks: [],
	options: {
		imageAttributes: {},
		bannerAttributes: {},
	},
}, migrate )

export const blockStyles = applyFilters(
	'stackable.pricing-box.block-styles',
	[
		{
			name: 'default',
			label: __( 'Default', i18n ),
			icon: ImageDefault,
			onSelect: ( attributes, innerBlocks ) => {
				return createBlock( 'stackable/pricing-box', attributes, innerBlocks )
			},
		},
		{
			name: 'compact',
			label: __( 'Compact', i18n ),
			icon: ImageCompact,
			migrate: ( attributes, innerBlocks, options ) => {
				const newInnerBlocks = []
				let imageAttributes = null
				innerBlocks.forEach( innerBlock => {
					if ( ! imageAttributes && innerBlock.name === 'stackable/columns' ) {
						const maybeImageBlock = innerBlock.innerBlocks[ 0 ].innerBlocks[ 0 ]
						if ( maybeImageBlock.name === 'stackable/image' ) {
							imageAttributes = maybeImageBlock.attributes
							newInnerBlocks.push( ...innerBlock.innerBlocks[ 1 ].innerBlocks )
							return
						}
					}

					newInnerBlocks.push( innerBlock )
				} )

				return withDefault( {
					attributes, innerBlocks: newInnerBlocks, options: { imageAttributes, bannerAttributes: options.bannerAttributes || {} },
				} )
			},
			onSelect: ( attributes, _innerBlocks, options ) => {
				const { imageAttributes } = options
				const innerBlocks = [ ..._innerBlocks ]
				const iconListBlocks = remove( innerBlocks, ( { name } ) => name === 'stackable/icon-list' )

				const newColumnsBlock = createBlock( 'stackable/columns', {}, [
					createBlock( 'stackable/column', {}, [
						createBlock( 'stackable/image', imageAttributes, [] ),
					] ),
					createBlock( 'stackable/column', { contentAlign: 'left' }, innerBlocks ),
				] )

				newColumnsBlock.attributes.uniqueId = createUniqueClass( newColumnsBlock.clientId )

				return createBlock( 'stackable/pricing-box', attributes, [
					newColumnsBlock,
					...iconListBlocks,
				] )
			},
		},
		{
			name: 'banner',
			label: __( 'Banner', i18n ),
			icon: ImageBanner,
			isPremium: ! isPro,
		},
		{
			name: 'colored',
			label: __( 'Colored', i18n ),
			icon: ImageColored,
			isPremium: ! isPro,
		},
		{
			name: 'sectioned',
			label: __( 'Sectioned', i18n ),
			icon: ImageSectioned,
			isPremium: ! isPro,
		},
	],
	withDefault
)
