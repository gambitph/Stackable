/**
 * External dependencies
 */
import classnames from 'classnames'
import VideoBackground from './video-background'

const Div = props => {
	const {
		blockTag: BlockTag,
		className,
		hasBackground,
		backgroundUrl,
		backgroundUrlTablet,
		backgroundUrlMobile,
		backgroundThumbnailUrl,
		backgroundThumbnailUrlTablet,
		backgroundThumbnailUrlMobile,
		backgroundColorType,
		...propsToPass
	} = props

	const classNames = classnames( [
		className,
	], {
		'stk--has-background-overlay': hasBackground && ( backgroundColorType === 'gradient' || backgroundUrl || backgroundUrlTablet || backgroundUrlMobile ),
	} )

	return (
		<BlockTag className={ classNames } { ...propsToPass }>
			{ props.children }
			<VideoBackground
				videoUrl={ backgroundUrl }
				videoUrlTablet={ backgroundUrlTablet }
				videoUrlMobile={ backgroundUrlMobile }
				videoThumbnailUrl={ backgroundThumbnailUrl }
				videoThumbnailUrlTablet={ backgroundThumbnailUrlTablet }
				videoThumbnailUrlMobile={ backgroundThumbnailUrlMobile }
			/>
		</BlockTag>
	)
}

Div.defaultProps = {
	blockTag: 'div',
	className: '',
	hasBackground: true,
	backgroundUrl: '',
	backgroundUrlTablet: '',
	backgroundUrlMobile: '',
	backgroundColorType: '',
}

Div.Content = props => {
	const {
		blockTag: BlockTag,
		className,
		hasBackground,
		backgroundUrl,
		backgroundUrlTablet,
		backgroundUrlMobile,
		backgroundThumbnailUrl,
		backgroundThumbnailUrlTablet,
		backgroundThumbnailUrlMobile,
		backgroundColorType,
		...propsToPass
	} = props

	const classNames = classnames( [
		className,
	], {
		'stk--has-background-overlay': hasBackground && ( backgroundColorType === 'gradient' || backgroundUrl || backgroundUrlTablet || backgroundUrlMobile ),
	} )

	return (
		<BlockTag className={ classNames } { ...propsToPass }>
			{ props.children }
			<VideoBackground.Content
				videoUrl={ backgroundUrl }
				videoUrlTablet={ backgroundUrlTablet }
				videoUrlMobile={ backgroundUrlMobile }
				videoThumbnailUrl={ backgroundThumbnailUrl }
				videoThumbnailUrlTablet={ backgroundThumbnailUrlTablet }
				videoThumbnailUrlMobile={ backgroundThumbnailUrlMobile }
			/>
		</BlockTag>
	)
}

Div.Content.defaultProps = {
	...Div.defaultProps,
}

export default Div
