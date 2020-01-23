/* eslint-disable jsx-a11y/no-interactive-element-to-noninteractive-role */
/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	PanelBody,
	Popover,
	Spinner,
	Dashicon,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useEffect, useRef,
} from '@wordpress/element'

const HelpTooltip = props => {
	const {
		getAnchorRect,
		title,
		videoUrl,
		description,
		learnMoreUrl,
		learnMore,
	} = props

	// React doesn't add the muted attribute, we need to add it ourselves.
	// @see https://github.com/facebook/react/issues/6544
	const videoRef = useRef()
	useEffect( () => {
		const { current: video } = videoRef

		// Testing <video muted> throws an error.
		// @see https://github.com/testing-library/react-testing-library/issues/470#issuecomment-528308230
		if ( process.env.NODE_ENV !== 'test' ) {
			video.muted = true
		}
		if ( video && ! video.playing ) {
			video.play()
		}
	}, [] )

	// Force Popover to update its location when the videoUrl is changed.
	useEffect( () => {
		window.dispatchEvent( new window.Event( 'resize' ) )
	}, [ props.videoUrl ] )

	return (
		<Popover
			title={ title }
			focusOnMount="container"
			className="ugb-help-tooltip-video"
			position="middle left"
			getAnchorRect={ getAnchorRect }
		>
			<PanelBody>
				<button className="ugb-help-tooltip-video__remove" data-testid="close-button" onClick={ props.onClickClose }><Dashicon icon="no" /></button>
				{ videoUrl &&
					<Fragment >
						<video
							ref={ videoRef }
							width="600"
							autoPlay
							loop
							muted
							role="img"
							aria-labelledby="ugb-help-tooltip-video__description"
							src={ videoUrl }
						/>
						{ ( ! videoRef.current || ! videoRef.current.playing ) && <Spinner /> }
					</Fragment>
				}
				<div className="ugb-help-tooltip-video__description" id="ugb-help-tooltip-video__description">
					{ title && <h4>{ title }</h4> }
					{ description }
					{ learnMoreUrl &&
						<div className="ugb-help-tooltip-video__link">
							<a href={ learnMoreUrl } target="_learn">{ learnMore } <Dashicon icon="external" /></a>
						</div>
					}
				</div>
			</PanelBody>
		</Popover>
	)
}

HelpTooltip.defaultProps = {
	onClickClose: () => {},
	getAnchorRect: null,
	title: __( 'Help', i18n ),
	description: '',
	videoUrl: '',
	learnMoreUrl: '',
	learnMore: __( 'Learn more', i18n ),
}

export default HelpTooltip
