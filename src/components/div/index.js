/**
 * External dependencies
 */
import classnames from 'classnames'
import VideoBackground from './video-background'
import { getPropsWithDefaults } from '../../util/props'

const Div = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, DIV_DEFAULT_PROPS )
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

const DIV_DEFAULT_PROPS = {
	blockTag: 'div',
	className: '',
	hasBackground: true,
	backgroundUrl: '',
	backgroundUrlTablet: '',
	backgroundUrlMobile: '',
	backgroundColorType: '',
}

Div.Content = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, DIV_CONTENT_DEFAULT_PROPS )
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

const DIV_CONTENT_DEFAULT_PROPS = {
	...DIV_DEFAULT_PROPS,
}

export default Div
