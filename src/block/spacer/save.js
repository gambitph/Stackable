/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { BlockContainer, DivBackground } from '~stackable/components'
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

const save = props => {
	const mainClasses = classnames( [
		props.className,
		'ugb-spacer--v2',
	] )
	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<DivBackground
				className="ugb-spacer--inner"
				backgroundAttrName="%s"
				blockProps={ props }
			/>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
