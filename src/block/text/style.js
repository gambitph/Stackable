/**
 * External dependencies
 */
import {
	createTypographyStyles,
	createResponsiveStyles,
	__getValue,
	appendImportant,
	appendImportantAll,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import { showOptions } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const show = showOptions( props )

	const styles = []

	// Container
	const {
		columnPaddingUnit = 'px',
		tabletColumnPaddingUnit = 'px',
		mobileColumnPaddingUnit = 'px',
	} = props.attributes
	styles.push( {
		saveOnly: {
			desktopTablet: {
				'> .ugb-inner-block > .ugb-block-content > *': appendImportantAll( {
					paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
					paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
					paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
					paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
				} ),
			},
			tabletOnly: {
				'> .ugb-inner-block > .ugb-block-content > *': appendImportantAll( {
					paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
					paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
					paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
					paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
				} ),
			},
			mobile: {
				'> .ugb-inner-block > .ugb-block-content > *': appendImportantAll( {
					paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
					paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
					paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
					paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
				} ),
			},
		},
		editor: {
			desktopTablet: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-text__text-wrapper': appendImportantAll( {
					paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
					paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
					paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
					paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
				} ),
			},
			tabletOnly: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-text__text-wrapper': appendImportantAll( {
					paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
					paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
					paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
					paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
				} ),
			},
			mobile: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-text__text-wrapper': appendImportantAll( {
					paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
					paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
					paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
					paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
				} ),
			},
		},
	} )

	// Column rule.
	const {
		showColumnRule = false,
	} = props.attributes
	if ( showColumnRule ) {
		styles.push( {
			'.ugb-text__rule': appendImportantAll( {
				background: getValue( 'columnRuleColor' ),
				width: getValue( 'columnRuleWidth', '%spx' ),
				height: getValue( 'columnRuleHeight', '%s%' ),
			} ),
		} )
	}

	// Title.
	const {
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-text__title-wrapper': {
				justifyContent: appendImportant( getValue( 'titleVerticalAlign' ) ),
			},
			'.ugb-text__title': {
				color: getValue( 'titleColor' ),
				...createTypographyStyles( 'title%s', 'desktop', props.attributes ),
				textAlign: getValue( 'titleAlign' ) || getValue( 'contentAlign' ),
			},
			tablet: {
				'.ugb-text__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes ),
					textAlign: getValue( 'titleTabletAlign' ) || getValue( 'tabletContentAlign' ),
				},
			},
			mobile: {
				'.ugb-text__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes ),
					textAlign: getValue( 'titleMobileAlign' ) || getValue( 'mobileContentAlign' ),
				},
			},
		} )
	}

	// Subtitle.
	const {
		showSubtitle = true,
	} = props.attributes
	if ( showSubtitle ) {
		styles.push( {
			'.ugb-text__subtitle': {
				...createTypographyStyles( 'subtitle%s', 'desktop', props.attributes ),
				color: getValue( 'subtitleColor' ),
				textAlign: getValue( 'subtitleAlign' ),
			},
			tablet: {
				'.ugb-text__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'tablet', props.attributes ),
					textAlign: getValue( 'subtitleTabletAlign' ),
				},
			},
			mobile: {
				'.ugb-text__subtitle': {
					...createTypographyStyles( 'subtitle%s', 'mobile', props.attributes ),
					textAlign: getValue( 'subtitleMobileAlign' ),
				},
			},
		} )
	}

	// Text.
	styles.push( {
		'.ugb-text__text p': {
			...createTypographyStyles( 'text%s', 'desktop', props.attributes ),
			color: getValue( 'textColor' ),
			textAlign: getValue( 'textAlign' ),
		},
		tablet: {
			'.ugb-text__text p': {
				...createTypographyStyles( 'text%s', 'tablet', props.attributes ),
				textAlign: getValue( 'textTabletAlign' ),
			},
		},
		mobile: {
			'.ugb-text__text p': {
				...createTypographyStyles( 'text%s', 'mobile', props.attributes ),
				textAlign: getValue( 'textMobileAlign' ),
			},
		},
	} )

	// Spacing.
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-text__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	if ( show.subtitleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-text__subtitle', 'subtitle%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )
	}
	styles.push( ...createResponsiveStyles( '.ugb-text__text', 'text%sBottomMargin', 'marginBottom', '%spx', props.attributes, { important: true } ) )

	return deepmerge.all( styles )
}

export default createStyles
