/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { BlockContainer } from '~stackable/components'

/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

const save = props => {
	return (
		<BlockContainer.Save className={ props.className } blockProps={ props } render={ () => null } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
