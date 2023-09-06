import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'

import { addFilter } from '@wordpress/hooks'
import { semverCompare } from '~stackable/util'

addFilter( 'stackable.image.save.wrapper', 'stackable/newWrapper', ( output, imageWrapperClasses, version, notImageBlock, Wrapper, blockName ) => {
	if ( blockName !== 'stackable/image' ) {
		return output
	}

	if ( semverCompare( version, '<', '3.11.4' ) ) {
		return (
			<Wrapper className={ imageWrapperClasses }>
				{ notImageBlock }
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
