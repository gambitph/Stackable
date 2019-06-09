import { withBlockStyles, withUniqueClass } from '@stackable/higher-order'
import { BlockContainer } from '@stackable/components'
import { compose } from '@wordpress/compose'
import createStyles from './style'

const save = props => {
	return (
		<BlockContainer.Save className={ props.className } blockProps={ props } render={ () => null } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
