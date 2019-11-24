/**
 * External dependencies
 */
import { createBackgroundStyleSet, __getValue } from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const show = showOptions( props )

	const {
	} = props.attributes

	const styles = []

	if ( show.containerWidth ) {
		styles.push( {
			'.ugb-video-popup__wrapper': {
				maxWidth: getValue( 'width' ) !== '' ? getValue( 'width', '%spx' ) : undefined,
			},
			tablet: {
				'.ugb-video-popup__wrapper': {
					maxWidth: getValue( 'tabletWidth' ) !== '' ? getValue( 'tabletWidth', '%spx' ) : undefined,
				},
			},
			mobile: {
				'.ugb-video-popup__wrapper': {
					maxWidth: getValue( 'mobileWidth' ) !== '' ? getValue( 'mobileWidth', '%spx' ) : undefined,
				},
			},
		} )
	}

	styles.push( {
		'.ugb-video-popup__wrapper': {
			height: getValue( 'height' ) !== '' ? getValue( 'height', '%spx !important' ) : undefined,
			borderRadius: show.borderRadius ? ( getValue( 'borderRadius' ) !== '' ? getValue( 'borderRadius', '%spx' ) : undefined ) : undefined,
		},
		'.ugb-video-popup__play-button svg': {
			fill: getValue( 'playButtonColor' ) !== '' ? getValue( 'playButtonColor', '%s !important' ) : undefined,
			height: getValue( 'playButtonSize' ) !== '' ? getValue( 'playButtonSize', '%spx' ) : undefined,
			width: getValue( 'playButtonSize' ) !== '' ? getValue( 'playButtonSize', '%spx' ) : undefined,
			opacity: getValue( 'playButtonOpacity' ) !== '' ? getValue( 'playButtonOpacity' ) : undefined,
		},
		tablet: {
			'.ugb-video-popup__wrapper': {
				height: getValue( 'tabletHeight' ) !== '' ? getValue( 'tabletHeight', '%spx !important' ) : undefined,
			},
			'.ugb-video-popup__play-button svg': {
				height: getValue( 'tabletPlayButtonSize' ) !== '' ? getValue( 'tabletPlayButtonSize', '%spx' ) : undefined,
				width: getValue( 'tabletPlayButtonSize' ) !== '' ? getValue( 'tabletPlayButtonSize', '%spx' ) : undefined,
			},
		},
		mobile: {
			'.ugb-video-popup__wrapper': {
				height: getValue( 'mobileHeight' ) !== '' ? getValue( 'mobileHeight', '%spx !important' ) : undefined,
			},
			'.ugb-video-popup__play-button svg': {
				height: getValue( 'mobilePlayButtonSize' ) !== '' ? getValue( 'mobilePlayButtonSize', '%spx' ) : undefined,
				width: getValue( 'mobilePlayButtonSize' ) !== '' ? getValue( 'mobilePlayButtonSize', '%spx' ) : undefined,
			},
		},
	} )

	styles.push( {
		...createBackgroundStyleSet( 'preview%s', 'ugb-video-popup__wrapper', props.attributes ),
	} )

	const {
		previewBackgroundTintStrength = '',
		previewBackgroundColor = '',
	} = props.attributes
	if ( previewBackgroundTintStrength || previewBackgroundColor ) {
		styles.push( {
			'.ugb-video-popup__wrapper:hover:before': {
				opacity: previewBackgroundColor && previewBackgroundTintStrength === '' ? 0.2 :
					previewBackgroundTintStrength >= 5 ? ( previewBackgroundTintStrength / 10 ) - 0.3 :
						( previewBackgroundTintStrength / 10 ) + 0.3,

			},
		} )
	}

	return deepmerge.all( styles )
}

export default createStyles
