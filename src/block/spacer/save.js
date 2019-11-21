/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { BlockContainer } from '~stackable/components'
import { hasBackgroundOverlay } from '~stackable/util'
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
	], {
		'ugb--has-background-overlay': hasBackgroundOverlay( '%s', props.attributes ),
	} )
	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ null } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
