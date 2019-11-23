/**
 * External dependencies
 */
import { hasBackgroundOverlay } from '~stackable/util'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import { BlockContainer, DivBackground } from '~stackable/components'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { getPlayButton } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

const save = props => {
	const { className } = props
	const {
		videoID,
		playButtonType,
		shadow = 3,
		previewBackgroundTintStrength = 5,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-video-popup--v3',
	], applyFilters( 'stackable.video-popup.mainclasses', {
	}, props ) )

	const boxClasses = classnames( [
		'ugb-video-popup__wrapper',
		`ugb--shadow-${ shadow }`,
	], applyFilters( 'stackable.video-popup.boxclasses', {
		// TODO: generate this as styles instead of using class. Also remove from style.scss
		[ `ugb--background-opacity-${ previewBackgroundTintStrength }` ]: hasBackgroundOverlay( 'preview%s', props.attributes ),
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ boxClasses }
					backgroundAttrName="preview%s"
					blockProps={ props }
					data-video={ videoID }
				>
					{ /* eslint-disable-next-line */ }
					<a href="#" className="ugb-video-popup__overlay" />
					<span className="ugb-video-popup__play-button">
						{ getPlayButton( playButtonType ) }
					</span>
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
