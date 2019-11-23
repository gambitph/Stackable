/**
 * External dependencies
 */
import {
	createBackgroundStyleSet,
	createTypographyStyles,
	createResponsiveStyles,
	whiteIfDark,
	appendImportant,
	__getValue,
} from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const show = showOptions( props )

	const styles = []

	styles.push( {
		...( show.containerBackground ? createBackgroundStyleSet( 'container%s', 'ugb-blockquote__item', props.attributes, {
			importantBackgroundColor: true,
		} ) : {} ),
	} )
	if ( show.containerBackground ) {
		styles.push( {
			'.ugb-blockquote__item': {
				borderRadius: show.borderRadius ? getValue( 'borderRadius', '%spx !important' ) : undefined,
			},
		} )
	}

	// Quote.
	const {
		showQuote = true,
	} = props.attributes
	if ( showQuote ) {
		styles.push( {
			'.ugb-blockquote__quote': {
				fill: appendImportant( getValue( 'quoteColor' ) ),
				opacity: getValue( 'quoteOpacity' ),
			},
		} )
		styles.push( ...createResponsiveStyles( '.ugb-blockquote__quote', 'quote%sSize', 'width', '%spx', props.attributes, true ) )
		styles.push( ...createResponsiveStyles( '.ugb-blockquote__quote', 'quote%sSize', 'height', '%spx', props.attributes, true ) )
		styles.push( ...createResponsiveStyles( '.ugb-blockquote__quote', 'quote%sX', 'left', '%spx', props.attributes, true ) )
		styles.push( ...createResponsiveStyles( '.ugb-blockquote__quote', 'quote%sY', 'top', '%spx', props.attributes, true ) )
	}

	// Text.
	const {
		containerBackgroundColor = '',
		textColor = '',
	} = props.attributes
	styles.push( {
		'.ugb-blockquote__text': {
			...createTypographyStyles( 'text%s', 'desktop', props.attributes, { important: true } ),
			color: whiteIfDark( textColor, show.containerBackground && containerBackgroundColor ),
		},
		tablet: {
			'.ugb-blockquote__text': {
				...createTypographyStyles( 'text%s', 'tablet', props.attributes, { important: true } ),
			},
		},
		mobile: {
			'.ugb-blockquote__text': {
				...createTypographyStyles( 'text%s', 'mobile', props.attributes, { important: true } ),
			},
		},
	} )
	styles.push( ...createResponsiveStyles( '.ugb-blockquote__item', 'text%sAlign', 'textAlign', '%s', props.attributes, true ) )

	return deepmerge.all( styles )
}

export default createStyles
