/**
 * External dependencies
 */
import { withBlockStyles, withUniqueClass } from '../../higher-order'
import { DivBackground } from '../../components'
import { BlockContainer } from '~stackable/components'
import classnames from 'classnames'
import striptags from 'striptags'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { getPlayButton } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

const save = props => {
	const { className } = props
	const {
		videoID,
		playButtonType,
		shadow = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-video-popup--v3',
	], applyFilters( 'stackable.video-popup.mainclasses', {
	}, props ) )

	const boxClasses = classnames( [
		'ugb-video-popup__wrapper',
	], applyFilters( 'stackable.video-popup.boxclasses', {
		[ `ugb--shadow-${ shadow }` ]: shadow !== '',
	}, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ boxClasses }
					backgroundAttrName="preview%s"
					blockProps={ props }
					data-video={ striptags( videoID ) }
				>
					{ /* eslint-disable-next-line */ }
					<button className="ugb-video-popup__overlay" aria-label="Play">
						<span className="ugb-video-popup__play-button">
							{ getPlayButton( playButtonType ) }
						</span>
					</button>
				</DivBackground>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
