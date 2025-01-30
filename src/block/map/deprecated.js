import { getIconOptions } from './util'

import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import { semverCompare, createElementFromHTMLString } from '~stackable/util'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity,
	deprecateBlockShadowColor, deprecateContainerShadowColor,
} from '~stackable/block-components'

import { addFilter } from '@wordpress/hooks'

const getIconOptions_3_13_0 = attributes => {
	const newAttributes = { ...attributes }
	if ( ! attributes.icon ) {
		return null
	}
	const svgEl = createElementFromHTMLString( attributes.icon )

	if ( ! svgEl || ! svgEl.firstElementChild ) {
		return null
	}
	svgEl.firstElementChild.setAttribute( 'fill', 'currentColor' )
	newAttributes.icon = svgEl.outerHTML
	return getIconOptions( newAttributes )
}

addFilter( 'stackable.map.icon-options', 'stackable/3.13.0', ( output, attribute, props ) => {
	if ( semverCompare( props.version, '<', '3.13.0' ) ) {
		return getIconOptions_3_13_0( attribute )
	}
	return output
} )

const deprecated = [
	{
		// Support the new shadow color.
		attributes: attributes( '3.12.11' ),
		save: withVersion( '3.12.11' )( Save ),
		isEligible: attributes => {
			const hasBlockShadow = deprecateBlockShadowColor.isEligible( attributes )
			const hasContainerShadow = deprecateContainerShadowColor.isEligible( attributes )

			return hasBlockShadow || hasContainerShadow
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
	// Support the new combined opacity and color.
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )

			return hasContainerOpacity || hasBlockOpacity
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
