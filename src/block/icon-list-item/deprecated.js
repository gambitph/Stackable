import { Save } from './save'
import { attributes } from './schema'

import { withVersion } from '~stackable/higher-order'
import {
	deprecateBlockShadowColor, deprecateContainerShadowColor, Typography,
} from '~stackable/block-components'
import { semverCompare } from '~stackable/util'

import { addFilter } from '@wordpress/hooks'

// Change tag from <span> to <p> to inherit theme link styles.
addFilter( 'stackable.icon-list-item.save.typography.content', 'stackable/inheritThemeLinkStyles', ( output, props, attrs, textClassNames ) => {
	if ( semverCompare( props.version, '<=', '3.15.3' ) ) {
		return (
			<Typography.Content
				attributes={ attrs }
				className={ textClassNames }
				tagName="span"
			/>
		)
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

			newAttributes = deprecateBlockShadowColor.migrate( newAttributes )
			newAttributes = deprecateContainerShadowColor.migrate( newAttributes )

			return newAttributes
		},
	},
]
export default deprecated
