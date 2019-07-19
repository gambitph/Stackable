import {
	createBackgroundStyleSet, createButtonStyleSet, createTypographyStyles, whiteIfDark,
} from '@stackable/util'
import deepmerge from 'deepmerge'
import { showOptions } from '.'
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const {
		columnBackgroundColor = '',
		columnBackgroundColorOpacity = 1,
	} = props.attributes

	const show = showOptions( props )

	const styles = []

	styles.push( {
		'.ugb-cta__title, .ugb-cta__description, .ugb-button-container': {
			textAlign: getValue( 'contentAlign' ),
		},
		tablet: {
			'.ugb-cta__title, .ugb-cta__description, .ugb-button-container': {
				textAlign: getValue( 'tabletContentAlign' ),
			},
		},
		mobile: {
			'.ugb-cta__title, .ugb-cta__description, .ugb-button-container': {
				textAlign: getValue( 'mobileContentAlign' ),
			},
		},
	} )

	if ( show.borderRadius ) {
		styles.push( {
			'.ugb-cta__item': {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
		} )
	}

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', 'ugb-cta__item', props.attributes, columnBackgroundOptions ) : {} ),
	} )

	if ( show.titleSpacing ) {
		styles.push( {
			'.ugb-cta__title': {
				marginBottom: getValue( 'titleBottomMargin', '%spx !important' ),
			},
			tablet: {
				'.ugb-cta__title': {
					marginBottom: getValue( 'titleTabletBottomMargin', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-cta__title': {
					marginBottom: getValue( 'titleMobileBottomMargin', '%spx !important' ),
				},
			},
		} )
	}
	if ( show.descriptionSpacing ) {
		styles.push( {
			'.ugb-cta__description': {
				marginBottom: getValue( 'descriptionBottomMargin', '%spx !important' ),
			},
			tablet: {
				'.ugb-cta__description': {
					marginBottom: getValue( 'descriptionTabletBottomMargin', '%spx !important' ),
				},
			},
			mobile: {
				'.ugb-cta__description': {
					marginBottom: getValue( 'descriptionMobileBottomMargin', '%spx !important' ),
				},
			},
		} )
	}

	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-cta__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes, { importantSize: true } ),
				color: whiteIfDark( titleColor, columnBackgroundColorOpacity !== 0 ? columnBackgroundColor : null ),
				textAlign: getValue( 'titleAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-cta__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-cta__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	const {
		descriptionColor = '',
		showDescription = true,
	} = props.attributes
	if ( showDescription ) {
		styles.push( {
			'.ugb-cta__description': {
				...createTypographyStyles( 'description%s', 'desktop', props.attributes ),
				color: whiteIfDark( descriptionColor, columnBackgroundColorOpacity !== 0 ? columnBackgroundColor : null ),
				textAlign: getValue( 'descriptionAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-cta__description': {
					...createTypographyStyles( 'description%s', 'tablet', props.attributes ),
					textAlign: getValue( 'descriptionTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-cta__description': {
					...createTypographyStyles( 'description%s', 'mobile', props.attributes ),
					textAlign: getValue( 'descriptionMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	const {
		showButton = true,
	} = props.attributes
	if ( showButton ) {
		styles.push( {
			...createButtonStyleSet( 'button%s', 'ugb-button', props.attributes ),
		} )
		styles.push( {
			'.ugb-button-container': {
				textAlign: getValue( 'buttonAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-button-container': {
					textAlign: getValue( 'buttonTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-button-container': {
					textAlign: getValue( 'buttonMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	return deepmerge.all( styles )
}

export default createStyles
