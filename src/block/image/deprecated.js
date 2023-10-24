import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecationImageOverlayOpacity,
} from '~stackable/block-components'

import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

addFilter( 'stackable.image.save.wrapper', 'stackable/newWrapper', ( output, imageWrapperClasses, version, image, Wrapper, hasWrapper ) => {
	if ( ! hasWrapper ) { // Image block is the only one with a wrapper
		return output
	}

	// Get the children of wrapped img
	if ( semverCompare( version, '<', '3.12.3' ) ) {
		return (
			<Wrapper className={ imageWrapperClasses }>
				{ image.props.children }
			</Wrapper>
		 )
	}

	return output
} )

const deprecated = [
	{
		attributes: attributes( '3.11.9' ),
		save: withVersion( '3.11.9' )( Save ),
		isEligible: attributes => {
			const hasContainerOpacity = deprecateContainerBackgroundColorOpacity.isEligible( attributes )
			const hasBlockOpacity = deprecateBlockBackgroundColorOpacity.isEligible( attributes )
			const hasImageOpacity = deprecationImageOverlayOpacity.isEligible( attributes )

			return hasContainerOpacity || hasBlockOpacity || hasImageOpacity
		},
		migrate: attributes => {
			let newAttributes = { ...attributes }

			newAttributes = deprecationImageOverlayOpacity.migrate( newAttributes )
			newAttributes = deprecateContainerBackgroundColorOpacity.migrate( newAttributes )
			newAttributes = deprecateBlockBackgroundColorOpacity.migrate( newAttributes )

			return newAttributes
		},
	},
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
		migrate: attributes => {
			let newAttributes = deprecateContainerBackgroundColorOpacity.migrate( attributes )
			newAttributes = deprecationImageOverlayOpacity.migrate( attributes )
			return deprecateBlockBackgroundColorOpacity.migrate( newAttributes )
		},
	},
]
export default deprecated
