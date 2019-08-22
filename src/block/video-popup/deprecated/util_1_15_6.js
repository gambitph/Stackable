/**
 * Internal dependencies
 */
import SVGCircleIcon from './images_1_15_6/play-circle.svg'
import SVGNormalIcon from './images_1_15_6/play-normal.svg'
import SVGOutlineIcon from './images_1_15_6/play-outline.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

const playButton = {
	normal: style => <SVGNormalIcon style={ style } width="30" height="30" />,
	circle: style => <SVGCircleIcon style={ style } width="50" height="50" />,
	outline: style => <SVGOutlineIcon style={ style } width="50" height="50" />,
}

export const playButtonTypes = [
	{ value: 'normal', label: __( 'Normal Play Button', i18n ) },
	{ value: 'circle', label: __( 'Play Button with Circle', i18n ) },
	{ value: 'outline', label: __( 'Outline Play Button', i18n ) },
]

export const getPlayButton = ( name, fill = null ) => {
	return playButton[ name ]( { fill } )
}
