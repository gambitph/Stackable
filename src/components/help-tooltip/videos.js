/**
 * Internal dependencies
 */
import generalBorderRadius from './videos/general-border-radius.mp4'
import generalShadow from './videos/general-shadow.mp4'
import imageSizeNoCrop from './videos/image-size-no-crop.mp4'
import imageBorderRadius from './videos/image-border-radius.mp4'
import backgroundColorOpacity from './videos/background-color-opacity.mp4'
import backgroundTint from './videos/background-tint.mp4'
import backgroundFixed from './videos/background-fixed.mp4'
import gradientDirection from './videos/gradient-direction.mp4' // video is just still
import gradientLocation from './videos/gradient-location.mp4'
import backgroundImagePosition from './videos/background-image-position.mp4'
import backgroundImageRepeat from './videos/background-image-repeat.mp4'
import backgroundImageSize from './videos/background-image-size.mp4'
import backgroundBlendMode from './videos/background-blend-mode.mp4'
import advancedOpacity from './videos/advanced-opacity.mp4'
import advancedZindex from './videos/advanced-zindex.mp4'
import advancedBlockMargins from './videos/advanced-block-margins.mp4'
import advancedBlockPaddings from './videos/advanced-block-paddings.mp4'
import advancedBlockHeight from './videos/advanced-block-height.mp4'
import advancedBlockVerticalAlign from './videos/advanced-block-vertical-align.mp4'
import advancedBlockContentWidth from './videos/advanced-block-content-width.mp4'
import advancedBlockHorizontalAlign from './videos/advanced-block-horizontal-align.mp4'
import advancedColumnPaddings from './videos/advanced-column-paddings.mp4'
import advancedColumnGap from './videos/advanced-column-gap.mp4'
import advancedColumnContentVerticalAlign from './videos/advanced-column-content-vertical-align.mp4'

/**
 * External dependencies
 */
import { srcUrl, cdnUrl } from 'stackable'

// Assign all videos to specific IDs so we can reference the videos by ID.
const VIDEOS = {
	'inner-block-padding': advancedColumnPaddings,

	'column-gap': advancedColumnGap,
	'advanced-block-paddings': advancedBlockPaddings,

	'image-size': imageSizeNoCrop,
	'image-border-radius': imageBorderRadius,

	'advanced-opacity': advancedOpacity,
	'advanced-zindex': advancedZindex,

	'content-horizontal-align': advancedBlockHorizontalAlign,
	'block-height': advancedBlockHeight,
	'advanced-block-margin': advancedBlockMargins,
	'content-vertical-align': advancedColumnContentVerticalAlign,
	'column-vertical-align': advancedBlockVerticalAlign,
	'max-content-width': advancedBlockContentWidth,

	'gradient-direction': gradientDirection,
	'gradient-location': gradientLocation,

	'background-color-opacity': backgroundColorOpacity,
	'background-blend-mode': backgroundBlendMode,
	'background-tint': backgroundTint,
	'background-fixed': backgroundFixed,
	'background-image-position': backgroundImagePosition,
	'background-image-repeat': backgroundImageRepeat,
	'background-image-size': backgroundImageSize,
	'general-border-radius': generalBorderRadius,

	'general-shadow': generalShadow,

}

const getVideoUrl = id => {
	const video = VIDEOS[ id ] || ''
	// Provides the URL of the video. If during development, use the local copies; if production, use the CDN.
	return `${ process.env.NODE_ENV === 'development' ? srcUrl : cdnUrl }/${ video }`
}

export default getVideoUrl
