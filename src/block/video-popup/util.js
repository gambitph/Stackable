import { __ } from '@wordpress/i18n'
import SVGCircleIcon from './images/play-circle.svg'
import SVGNormalIcon from './images/play-normal.svg'
import SVGOutlineIcon from './images/play-outline.svg'

const playButton = {
	normal: style => <SVGNormalIcon style={ style } width="30" height="30" />,
	circle: style => <SVGCircleIcon style={ style } width="50" height="50" />,
	outline: style => <SVGOutlineIcon style={ style } width="50" height="50" />,
}

export const playButtonTypes = [
	{ value: 'normal', label: __( 'Normal Play Button' ) },
	{ value: 'circle', label: __( 'Play Button with Circle' ) },
	{ value: 'outline', label: __( 'Outline Play Button' ) },
]

export const getPlayButton = ( name, fill = null ) => {
	return playButton[ name ]( { fill } )
}
