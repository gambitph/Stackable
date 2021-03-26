/**
 * External dependencies
 */
import classnames from 'classnames'
import VideoBackground from './video-background'

const Div = props => {
	const {
		blockTag: BlockTag,
		className,
		backgroundUrl,
		backgroundUrlTablet,
		backgroundUrlMobile,
		backgroundColorType,
		...propsToPass
	} = props

	const classNames = classnames( [
		className,
	], {
		'stk--has-background-overlay': backgroundColorType === 'gradient' || backgroundUrl || backgroundUrlTablet || backgroundUrlMobile,
	} )

	return (
		<BlockTag className={ classNames } { ...propsToPass }>
			{ props.children }
			<VideoBackground
				videoUrl={ backgroundUrl }
				videoUrlTablet={ backgroundUrlTablet }
				videoUrlMobile={ backgroundUrlMobile }
			/>
		</BlockTag>
	)
}

Div.defaultProps = {
	blockTag: 'div',
	className: '',
	backgroundUrl: '',
	backgroundUrlTablet: '',
	backgroundUrlMobile: '',
	backgroundColorType: '',
}

Div.Content = props => {
	const {
		blockTag: BlockTag,
		className,
		backgroundUrl,
		backgroundUrlTablet,
		backgroundUrlMobile,
		backgroundColorType,
		...propsToPass
	} = props

	const classNames = classnames( [
		className,
	], {
		'stk--has-background-overlay': backgroundColorType === 'gradient' || backgroundUrl || backgroundUrlTablet || backgroundUrlMobile,
	} )

	return (
		<BlockTag className={ classNames } { ...propsToPass }>
			{ props.children }
			<VideoBackground.Content
				videoUrl={ backgroundUrl }
				videoUrlTablet={ backgroundUrlTablet }
				videoUrlMobile={ backgroundUrlMobile }
			/>
		</BlockTag>
	)
}

Div.Content.defaultProps = {
	...Div.defaultProps,
}

export default Div
