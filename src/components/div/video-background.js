/**
 * External dependencies
 */
import classnames from 'classnames'
import { urlIsVideo } from '~stackable/util'
import { useDeviceType } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'

const VideoBackground = props => {
	let backgroundSrc = props.videoUrl
	let backgroundThumbnailSrc = props.videoThumbnailUrl
	const deviceType = useDeviceType()
	if ( deviceType !== 'Desktop' && props.videoUrlTablet ) {
		backgroundSrc = props.videoUrlTablet
	}
	if ( deviceType === 'Mobile' && props.videoUrlMobile ) {
		backgroundSrc = props.videoUrlMobile
	}

	if ( deviceType !== 'Desktop' && props.videoThumbnailUrlTablet ) {
		backgroundThumbnailSrc = props.videoThumbnailUrlTablet
	}
	if ( deviceType === 'Mobile' && props.videoThumbnailUrlMobile ) {
		backgroundThumbnailSrc = props.videoThumbnailUrlMobile
	}

	if ( ! urlIsVideo( backgroundSrc ) ) {
		return null
	}

	return (
		<video
			className="stk-video-background"
			autoPlay
			muted
			loop
			playsinline
			src={ backgroundSrc }
			poster={ backgroundThumbnailSrc }
		/>
	)
}

VideoBackground.defaultProps = {
	videoUrl: '',
	videoUrlTablet: '',
	videoUrlMobile: '',
	videoThumbnailUrl: '',
	videoThumbnailUrlTablet: '',
	videoThumbnailUrlMobile: '',
}

VideoBackground.Content = props => {
	const desktopClassNames = classnames( [
		'stk-video-background',
	], {
		'stk--hide-tablet': props.videoUrlTablet,
		'stk--hide-mobile': props.videoUrlTablet || props.videoUrlMobile,
	} )
	const tabletClassNames = classnames( [
		'stk-video-background',
	], {
		'stk--hide-desktop': true,
		'stk--hide-mobile': props.videoUrlMobile,
	} )
	const mobileClassNames = classnames( [
		'stk-video-background',
	], {
		'stk--hide-desktop': true,
		'stk--hide-tablet': true,
	} )

	return (
		<Fragment>
			{ urlIsVideo( props.videoUrl ) &&
				<video
					className={ desktopClassNames }
					autoPlay
					muted
					loop
					playsinline
					src={ props.videoUrl }
					poster={ props.videoThumbnailUrl }
				/>
			}
			{ urlIsVideo( props.videoUrlTablet ) &&
				<video
					className={ tabletClassNames }
					autoPlay
					muted
					loop
					playsinline
					src={ props.videoUrlTablet }
					poster={ props.videoThumbnailUrlTablet }
				/>
			}
			{ urlIsVideo( props.videoUrlMobile ) &&
				<video
					className={ mobileClassNames }
					autoPlay
					muted
					loop
					playsinline
					src={ props.videoUrlMobile }
					poster={ props.videoThumbnailUrlMobile }
				/>
			}
		</Fragment>
	)
}

VideoBackground.Content.defaultProps = {
	videoUrl: '',
	videoUrlTablet: '',
	videoUrlMobile: '',
	videoThumbnailUrl: '',
	videoThumbnailUrlTablet: '',
	videoThumbnailUrlMobile: '',
}

export default VideoBackground
