/**
 * External dependencies
 */
import {
	appendImportantAll,
	appendImportant,
	createResponsiveStyles,
	createBorderStyleSet,
	__getValue,
	whiteIfDarkBlackIfLight,
} from '~stackable/util'
import {
	createBackgroundStyleSet,
} from '../../util'
import deepmerge from 'deepmerge'
import { first } from 'lodash'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	const show = showOptions( props )

	const {
		uniqueClass = '',
	} = props.attributes

	// Border radius.
	if ( show.borderRadius ) {
		styles.push( {
			[ `.${ uniqueClass }-column-wrapper` ]: {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
			// Block editor only styles. This is needed since in the editor, we don't hide overflow
			// so that the block controls wouldn't be cut off from view.
			editor: {
				[ `.${ uniqueClass }-wrapper > .ugb-video-background, ` +
				  `.${ uniqueClass }-wrapper:before` ]: {
					borderRadius: getValue( 'borderRadius', '%spx !important' ) || '12px !important',
				},
			},
		} )
	}

	if ( show.border ) {
		styles.push( {
			...createBorderStyleSet( 'column%s', `.${ uniqueClass }-column-wrapper`, props.attributes ),
		} )
	}

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
		importantBackgroundSize: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', `${ uniqueClass }-column-wrapper`, props.attributes, columnBackgroundOptions ) : {} ),
	} )

	// Content Vertical Align
	styles.push( {
		saveOnly: first( createResponsiveStyles( '> .ugb-inner-block > .ugb-block-content > *', '%sColumnContentVerticalAlign', 'justifyContent', '%s', props.attributes, { important: true } ) ),
		editor: first( createResponsiveStyles( '> .ugb-inner-block > .ugb-block-content > .ugb-column__item', '%sColumnContentVerticalAlign', 'justifyContent', '%s', props.attributes, { important: true } ) ),
	} )

	// Content Width
	styles.push( {
		[ `.${ uniqueClass }-column-wrapper .ugb-column__content-wrapper` ]: {
			width: appendImportant( getValue( 'contentWidth', `%s${ getValue( 'contentWidthUnit' ) || '%' }` ) ),
		},
		tablet: {
			[ `.${ uniqueClass }-column-wrapper .ugb-column__content-wrapper` ]: {
				width: appendImportant( getValue( 'contentTabletWidth', `%s${ getValue( 'contentTabletWidthUnit' ) || '%' }` ) ),
			},
		},
		mobile: {
			[ `.${ uniqueClass }-column-wrapper .ugb-column__content-wrapper` ]: {
				width: appendImportant( getValue( 'contentMobileWidth', `%s${ getValue( 'contentMobileWidthUnit' ) || '%' }` ) ),
			},
		},
	} )

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
				'> .ugb-inner-block > .ugb-block-content > .ugb-column__item': appendImportantAll( {
					paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
					paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
					paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
					paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
				} ),
			},
			tabletOnly: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-column__item': appendImportantAll( {
					paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
					paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
					paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
					paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
				} ),
			},
			mobile: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-column__item': appendImportantAll( {
					paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
					paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
					paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
					paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
				} ),
			},
		},
	} )

	// Content Horizontal Align
	const {
		contentWidth = '',
		contentTabletWidth = '',
		contentMobileWidth = '',
	} = props.attributes
	if ( contentWidth ) {
		styles.push( {
			[ `.${ uniqueClass }-column-wrapper` ]: {
				alignItems: appendImportant( getValue( 'contentHorizontalAlign' ) ),
			},
		} )
	}
	if ( contentWidth || contentTabletWidth ) {
		styles.push( {
			tablet: {
				[ `.${ uniqueClass }-column-wrapper` ]: {
					alignItems: appendImportant( getValue( 'contentTabletHorizontalAlign' ) ),
				},
			},
		} )
	}
	if ( contentWidth || contentTabletWidth || contentMobileWidth ) {
		styles.push( {
			mobile: {
				[ `.${ uniqueClass }-column-wrapper` ]: {
					alignItems: appendImportant( getValue( 'contentMobileHorizontalAlign' ) ),
				},
			},
		} )
	}

	// Text Colors.
	const {
		columnBackgroundColor = '',
		headingColor = '',
		bodyTextColor = '',
	} = props.attributes
	styles.push( {
		[ 'h1, ' +
		  'h2, ' +
		  'h3, ' +
		  'h4, ' +
		  'h5, ' +
		  'h6' ]: {
			color: getValue( 'headingColor' ),
		},
		[ 'p, ' +
		  'li, ' +
		  'label, ' +
		  'table' ]: {
			color: getValue( 'bodyTextColor' ),
		},
		saveOnly: {
			[ 'a, ' +
				'a:visited, ' +
				'a:focus' ]: {
				color: getValue( 'linkColor' ),
			},
		},
		'a:hover': {
			color: getValue( 'linkHoverColor' ),
		},
	} )
	styles.push( {
		editor: {
			[ 'a, ' +
				'a:visited, ' +
				'a:focus' ]: {
				color: appendImportant( getValue( 'linkColor' ) ),
			},
		},
	} )

	// When there's a background color, change the text colors of all immediate core block children.
	// Don't color all children since Stackable blocks and others might have their own background colors.
	styles.push( {
		[ `.${ uniqueClass }-column-wrapper > * > h1, ` +
		  `.${ uniqueClass }-column-wrapper > * > h2, ` +
		  `.${ uniqueClass }-column-wrapper > * > h3, ` +
		  `.${ uniqueClass }-column-wrapper > * > h4, ` +
		  `.${ uniqueClass }-column-wrapper > * > h5, ` +
		  `.${ uniqueClass }-column-wrapper > * > h6` ]: {
			color: whiteIfDarkBlackIfLight( headingColor, show.columnBackground && columnBackgroundColor ),
		},
		[ `.${ uniqueClass }-column-wrapper > * > p, ` +
		  `.${ uniqueClass }-column-wrapper > * > ol li, ` +
		  `.${ uniqueClass }-column-wrapper > * > ul li` ]: {
			color: whiteIfDarkBlackIfLight( bodyTextColor, show.columnBackground && columnBackgroundColor ),
		},

		// Editor only styles for colorizing the headings & text of immediate inner blocks.
		// This doesn't get rendered in the frontend.
		editor: {
			[ `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/heading"] h1, ` +
			  `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/heading"] h2, ` +
			  `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/heading"] h3, ` +
			  `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/heading"] h4, ` +
			  `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/heading"] h5, ` +
			  `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/heading"] h6` ]: {
				color: whiteIfDarkBlackIfLight( headingColor, show.columnBackground && columnBackgroundColor ),
			},
			[ `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/paragraph"] p, ` +
			  `.${ uniqueClass }-column-wrapper > * > * > * > [data-type*="core/list"] li` ]: {
				color: whiteIfDarkBlackIfLight( bodyTextColor, show.columnBackground && columnBackgroundColor ),
			},
		},
	} )

	return deepmerge.all( styles )
}

export default createStyles
