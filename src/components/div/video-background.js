/**
 * External dependencies
 */
import { urlIsVideo } from '~stackable/util'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

const _VideoBackground = props => {
	let backgroundSrc = props.videoUrl
	if ( props.previewDeviceType !== 'Desktop' && props.videoUrlTablet ) {
		backgroundSrc = props.videoUrlTablet
	}
	if ( props.previewDeviceType === 'Mobile' && props.videoUrlMobile ) {
		backgroundSrc = props.videoUrlMobile
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
		/>
	)
}

_VideoBackground.defaultProps = {
	videoUrl: '',
	videoUrlTablet: '',
	videoUrlMobile: '',
}

const VideoBackground = compose( [
	withSelect( select => {
		const {
			__experimentalGetPreviewDeviceType,
		} = select( 'core/edit-post' )

		return {
			previewDeviceType: __experimentalGetPreviewDeviceType(),
		}
	} ),
] )( _VideoBackground )

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
				/>
			}
		</Fragment>
	)
}

VideoBackground.Content.defaultProps = {
	videoUrl: '',
	videoUrlTablet: '',
	videoUrlMobile: '',
}

export default VideoBackground
