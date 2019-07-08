import { createVideoBackground, hasBackgroundOverlay } from '@stackable/util'
import { withBlockStyles, withUniqueClass } from '@stackable/higher-order'
import { applyFilters } from '@wordpress/hooks'
import { BlockContainer } from '@stackable/components'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
import { Fragment } from '@wordpress/element'
import { getPlayButton } from './util'

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
		'ugb-video-popup',
		'ugb-video-popup--v3',
	], applyFilters( 'stackable.video-popup.mainclasses', {
	}, props ) )

	const boxClasses = classnames( [
		'ugb-video-popup__wrapper',
		`ugb--shadow-${ shadow }`,
	], applyFilters( 'stackable.video-popup.boxclasses', {
		'ugb--has-background-overlay': hasBackgroundOverlay( 'preview%s', props.attributes ),
		[ `ugb--background-opacity-${ previewBackgroundTintStrength }` ]: hasBackgroundOverlay( 'preview%s', props.attributes ),
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className={ boxClasses } data-video={ videoID }>
					{ /* eslint-disable-next-line */ }
					<a href="#" className="ugb-video-popup__overlay" />
					<span className="ugb-video-popup__play-button">
						{ getPlayButton( playButtonType ) }
					</span>
					{ createVideoBackground( 'preview%s', props ) }
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
