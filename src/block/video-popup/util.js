import { __ } from '@wordpress/i18n'
import SVGCircleIcon from './images/play-circle.svg'
import SVGNormalIcon from './images/play-normal.svg'
import SVGOutlineIcon from './images/play-outline.svg'

const playButton = {
	normal: <SVGNormalIcon className="ugb-play-button-normal" width="30" height="30" />,
	circle: <SVGCircleIcon className="ugb-play-button-cirle" width="50" height="50" />,
	outline: <SVGOutlineIcon className="ugb-play-button-outline" width="50" height="50" />,
}

export const playButtonTypes = [
	{ value: 'normal', label: __( 'Normal Play Button' ) },
	{ value: 'circle', label: __( 'Play Button with Circle' ) },
	{ value: 'outline', label: __( 'Outline Play Button' ) },
]

export const getPlayButton = name => {
	return playButton[ name ]
}
