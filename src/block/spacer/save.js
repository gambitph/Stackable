/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { hasBackgroundOverlay, createVideoBackground } from '~stackable/util'
import { BlockContainer } from '~stackable/components'
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
	const innerClasses = classnames( [
		'ugb-spacer--inner',
	], {
		'ugb--has-background-overlay': hasBackgroundOverlay( '%s', props.attributes ),
	} )
	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<div className={ innerClasses }>
				{ createVideoBackground( '%s', props ) }
			</div>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
