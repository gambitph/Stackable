import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockBackgroundColorOpacity, deprecateContainerBackgroundColorOpacity, deprecationImageOverlayOpacity,
} from '~stackable/block-components'

import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

addFilter( 'stackable.image.save.wrapper', 'stackable/image-link-wrapper', ( output, props, imageWrapperClasses, image ) => {
	if ( ! props.version ) {
		return output
	}

	if ( ! props.hasWrapper ) { // Image block is the only one with a wrapper
		return output
	}

	// Get the children of wrapped img
	if ( semverCompare( props.version, '<', '3.12.7' ) ) {
		const Wrapper = props.customWrapper
		return (
			<Wrapper>
				{ image }
			</Wrapper>
		 )
	}

	return output
} )

addFilter( 'stackable.image.save.wrapper', 'stackable/image-caption-wrapper', ( output, props, imageWrapperClasses, image ) => {
	if ( ! props.version ) {
		return output
	}

	if ( ! props.hasWrapper ) { // Image block is the only one with a wrapper
		return output
	}

	// Get the children of wrapped img
	if ( semverCompare( props.version, '<', '3.12.3' ) ) {
		const Wrapper = props.customWrapper || 'figure'
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
		attributes: attributes( '3.12.6' ),
		save: withVersion( '3.12.6' )( Save ),
	},
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
