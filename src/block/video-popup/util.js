/**
 * Internal dependencies
 */
import SVGCircleIcon from './images/play-circle.svg'
import SVGNormalIcon from './images/play-normal.svg'
import SVGOutlineIcon from './images/play-outline.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

const playButton = {
	normal: <SVGNormalIcon className="ugb-play-button-normal" width="30" height="30" />,
	circle: <SVGCircleIcon className="ugb-play-button-cirle" width="50" height="50" />,
	outline: <SVGOutlineIcon className="ugb-play-button-outline" width="50" height="50" />,
}

export const playButtonTypes = [
	{ value: 'normal', label: __( 'Normal Play Button', i18n ) },
	{ value: 'circle', label: __( 'Play Button with Circle', i18n ) },
	{ value: 'outline', label: __( 'Outline Play Button', i18n ) },
]

export const getPlayButton = name => {
	return playButton[ name ]
}

export const showOptions = blockProps => {
	const {
		showBlockBackground = false,
		blockInnerWidth = '',
		align = '',
	} = blockProps.attributes

	const previewIsFullWidth = ( ! showBlockBackground && align === 'full' ) || ( showBlockBackground && blockInnerWidth === 'full' )

	return applyFilters( 'stackable.video-popup.show', {
		containerWidth: ! previewIsFullWidth,
		borderRadius: ! previewIsFullWidth,
	}, blockProps )
}
