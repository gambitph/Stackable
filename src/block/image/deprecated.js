import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'

import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

addFilter( 'stackable.image.save.wrapper', 'stackable/newWrapper', ( output, imageWrapperClasses, version, image, Wrapper, hasWrapper ) => {
	if ( ! hasWrapper ) { // Image block is the only one with a wrapper
		return output
	}

	// Get the children of wrapped img
	if ( semverCompare( version, '<', '3.11.5' ) ) {
		return (
			<Wrapper className={ imageWrapperClasses }>
				{ image.props.children }
			</Wrapper>
		 )
	}

	return output
} )

const deprecated = [
	// Support new margin-top/bottom classes.
	{
		attributes: attributes( '3.7.9' ),
		save: withVersion( '3.7.9' )( Save ),
	},
]
export default deprecated
