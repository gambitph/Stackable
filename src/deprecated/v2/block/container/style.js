/**
 * External dependencies
 */
import {
	appendImportantAll,
	appendImportant,
	createBorderStyleSet,
	whiteIfDarkBlackIfLight,
	__getValue,
} from '~stackable/util'
import {
	createBackgroundStyleSet,
} from '../../util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	const {
		uniqueClass = '',
	} = props.attributes

	const show = showOptions( props )

	if ( show.borderRadius ) {
		styles.push( {
			[ `.${ uniqueClass }-wrapper.ugb-container__wrapper` ]: {
				borderRadius: getValue( 'borderRadius', '%spx !important' ),
			},
			// Block editor only styles. This is needed since in the editor, we don't hide overflow
			// so that the block controls wouldn't be cut off from view.
			editor: {
				[ `.${ uniqueClass }-wrapper.ugb-container__wrapper > .ugb-video-background, ` +
				  `.${ uniqueClass }-wrapper.ugb-container__wrapper:before` ]: {
					borderRadius: getValue( 'borderRadius', '%spx !important' ) || '12px !important',
				},
			},
		} )
	}

	if ( show.border ) {
		styles.push( {
			...createBorderStyleSet( 'column%s', `.${ uniqueClass }-wrapper.ugb-container__wrapper`, props.attributes ),
		} )
	}

	// Define the column vertical align here since it doesn't work.
	// The default way of doing "column vertical align" is disabled in `index.js`
	styles.push( {
		saveOnly: {
			'> .ugb-inner-block > .ugb-block-content > *': {
				justifyContent: appendImportant( getValue( 'columnContentVerticalAlign' ) ),
			},
			tablet: {
				'> .ugb-inner-block > .ugb-block-content > *': {
					justifyContent: appendImportant( getValue( 'tabletColumnContentVerticalAlign' ) ),
				},
			},
			mobile: {
				'> .ugb-inner-block > .ugb-block-content > *': {
					justifyContent: appendImportant( getValue( 'mobileColumnContentVerticalAlign' ) ),
				},
			},
		},
		editor: {
			'> .ugb-inner-block > .ugb-block-content > .ugb-container__wrapper': {
				justifyContent: appendImportant( getValue( 'columnContentVerticalAlign' ) ),
			},
			tablet: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-container__wrapper': {
					justifyContent: appendImportant( getValue( 'tabletColumnContentVerticalAlign' ) ),
				},
			},
			mobile: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-container__wrapper': {
					justifyContent: appendImportant( getValue( 'mobileColumnContentVerticalAlign' ) ),
				},
			},
		},
	} )

	// Height.
	const {
		height = '',
		tabletHeight = '',
		mobileHeight = '',
	} = props.attributes
	styles.push( {
		[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
			paddingTop: height === 'short' ? '35px !important'
				: height === 'tall' ? '120px !important'
					: undefined,
			paddingBottom: height === 'short' ? '35px !important'
				: height === 'tall' ? '120px !important'
					: undefined,
		},
		[ `.${ uniqueClass }-wrapper.ugb-container__wrapper` ]: {
			minHeight: height === 'half' ? '50vh'
				: height === 'full' ? '100vh'
					: undefined,
			// Remove top/bottom padding for the short/tall height to display properly.
			paddingTop: height === 'short' || height === 'tall' ? '0 !important' : undefined,
			paddingBottom: height === 'short' || height === 'tall' ? '0 !important' : undefined,
		},
		tablet: {
			[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
				paddingTop: tabletHeight === 'short' ? '35px !important'
					: tabletHeight === 'tall' ? '120px !important'
						: undefined,
				paddingBottom: tabletHeight === 'short' ? '35px !important'
					: tabletHeight === 'tall' ? '120px !important'
						: undefined,
			},
			[ `.${ uniqueClass }-wrapper.ugb-container__wrapper` ]: {
				minHeight: tabletHeight === 'half' ? '50vh'
					: tabletHeight === 'full' ? '100vh'
						: undefined,
				// Remove top/bottom padding for the short/tall height to display properly.
				paddingTop: tabletHeight === 'short' || tabletHeight === 'tall' ? '0 !important' : undefined,
				paddingBottom: tabletHeight === 'short' || tabletHeight === 'tall' ? '0 !important' : undefined,
			},
		},
		mobile: {
			[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
				paddingTop: mobileHeight === 'short' ? '35px !important'
					: mobileHeight === 'tall' ? '120px !important'
						: undefined,
				paddingBottom: mobileHeight === 'short' ? '35px !important'
					: mobileHeight === 'tall' ? '120px !important'
						: undefined,
			},
			[ `.${ uniqueClass }-wrapper.ugb-container__wrapper` ]: {
				minHeight: mobileHeight === 'half' ? '50vh'
					: mobileHeight === 'full' ? '100vh'
						: undefined,
				// Remove top/bottom padding for the short/tall height to display properly.
				paddingTop: mobileHeight === 'short' || mobileHeight === 'tall' ? '0 !important' : undefined,
				paddingBottom: mobileHeight === 'short' || mobileHeight === 'tall' ? '0 !important' : undefined,
			},
		},
	} )

	// Vertical align
	const wrapperHasHeight = height && ( height === 'half' || height === 'full' )
	const wrapperTabletHasHeight = tabletHeight && ( tabletHeight === 'half' || tabletHeight === 'full' )
	const wrapperMobileHasHeight = mobileHeight && ( mobileHeight === 'half' || mobileHeight === 'full' )
	if ( wrapperHasHeight ) {
		styles.push( {
			[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
				justifyContent: getValue( 'contentVerticalAlign' ),
			},
		} )
	}
	if ( wrapperHasHeight || wrapperTabletHasHeight ) {
		styles.push( {
			tablet: {
				[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
					justifyContent: getValue( 'contentTabletVerticalAlign' ),
				},
			},
		} )
	}
	if ( wrapperHasHeight || wrapperTabletHasHeight || wrapperMobileHasHeight ) {
		styles.push( {
			mobile: {
				[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
					justifyContent: getValue( 'contentMobileVerticalAlign' ),
				},
			},
		} )
	}

	// Content width.
	styles.push( {
		desktopTablet: {
			[ `.${ uniqueClass }-content-wrapper.ugb-container__content-wrapper` ]: {
				width: appendImportant( getValue( 'contentWidth', '%s%' ) ),
			},
		},
		tabletOnly: {
			[ `.${ uniqueClass }-content-wrapper.ugb-container__content-wrapper` ]: {
				width: appendImportant( getValue( 'contentTabletWidth', '%s%' ) ),
			},
		},
		mobile: {
			[ `.${ uniqueClass }-content-wrapper.ugb-container__content-wrapper` ]: {
				width: appendImportant( getValue( 'contentMobileWidth', '%s%' ) ),
			},
		},
	} )

	// Content horizontal align.
	styles.push( {
		[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
			alignItems: appendImportant( getValue( 'contentHorizontalAlign' ) ),
		},
		tablet: {
			[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
				alignItems: appendImportant( getValue( 'contentTabletHorizontalAlign' ) ),
			},
		},
		mobile: {
			[ `.${ uniqueClass }-wrapper > .ugb-container__side` ]: {
				alignItems: appendImportant( getValue( 'contentMobileHorizontalAlign' ) ),
			},
		},
	} )

	// Column Background.
	const columnBackgroundOptions = {
		importantBackgroundColor: true,
		importantBackgroundSize: true,
	}
	styles.push( {
		...( show.columnBackground ? createBackgroundStyleSet( 'column%s', `${ uniqueClass }-wrapper.ugb-container__wrapper`, props.attributes, columnBackgroundOptions ) : {} ),
	} )

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
		[ 'a, ' +
		  'a:visited, ' +
		  'a:focus' ]: {
			color: getValue( 'linkColor' ),
		},
		'a:hover': {
			color: getValue( 'linkHoverColor' ),
		},
	} )

	// Container.
	const {
		columnPaddingUnit = 'px',
		tabletColumnPaddingUnit = 'px',
		mobileColumnPaddingUnit = 'px',
	} = props.attributes

	const containerSelector = applyFilters( 'stackable.container.spacing-paddings.selector', '> .ugb-inner-block > .ugb-block-content > *', props )
	const containerSelectorEditor = applyFilters( 'stackable.container.spacing-paddings.selector', '> .ugb-inner-block > .ugb-block-content > .ugb-container__wrapper', props )
	styles.push( {
		saveOnly: {
			desktopTablet: {
				[ containerSelector ]: appendImportantAll( {
					paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
					paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
					paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
					paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
				} ),
			},
			tabletOnly: {
				[ containerSelector ]: appendImportantAll( {
					paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
					paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
					paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
					paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
				} ),
			},
			mobile: {
				[ containerSelector ]: appendImportantAll( {
					paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
					paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
					paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
					paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
				} ),
			},
		},
		editor: {
			desktopTablet: {
				[ containerSelectorEditor ]: appendImportantAll( {
					paddingTop: getValue( 'columnPaddingTop', `%s${ columnPaddingUnit }` ),
					paddingBottom: getValue( 'columnPaddingBottom', `%s${ columnPaddingUnit }` ),
					paddingRight: getValue( 'columnPaddingRight', `%s${ columnPaddingUnit }` ),
					paddingLeft: getValue( 'columnPaddingLeft', `%s${ columnPaddingUnit }` ),
				} ),
			},
			tabletOnly: {
				[ containerSelectorEditor ]: appendImportantAll( {
					paddingTop: getValue( 'tabletColumnPaddingTop', `%s${ tabletColumnPaddingUnit }` ),
					paddingRight: getValue( 'tabletColumnPaddingRight', `%s${ tabletColumnPaddingUnit }` ),
					paddingBottom: getValue( 'tabletColumnPaddingBottom', `%s${ tabletColumnPaddingUnit }` ),
					paddingLeft: getValue( 'tabletColumnPaddingLeft', `%s${ tabletColumnPaddingUnit }` ),
				} ),
			},
			mobile: {
				[ containerSelectorEditor ]: appendImportantAll( {
					paddingTop: getValue( 'mobileColumnPaddingTop', `%s${ mobileColumnPaddingUnit }` ),
					paddingRight: getValue( 'mobileColumnPaddingRight', `%s${ mobileColumnPaddingUnit }` ),
					paddingBottom: getValue( 'mobileColumnPaddingBottom', `%s${ mobileColumnPaddingUnit }` ),
					paddingLeft: getValue( 'mobileColumnPaddingLeft', `%s${ mobileColumnPaddingUnit }` ),
				} ),
			},
		},
	} )

	// When there's a background color, change the text colors of all immediate core block children.
	// Don't color all children since Stackable blocks and others might have their own background colors.
	styles.push( {
		[ `.${ uniqueClass }-content-wrapper > h1, ` +
		  `.${ uniqueClass }-content-wrapper > h2, ` +
		  `.${ uniqueClass }-content-wrapper > h3, ` +
		  `.${ uniqueClass }-content-wrapper > h4, ` +
		  `.${ uniqueClass }-content-wrapper > h5, ` +
		  `.${ uniqueClass }-content-wrapper > h6` ]: {
			color: whiteIfDarkBlackIfLight( headingColor, show.columnBackground && columnBackgroundColor ),
		},
		[ `.${ uniqueClass }-content-wrapper > p, ` +
		  `.${ uniqueClass }-content-wrapper > ol li, ` +
		  `.${ uniqueClass }-content-wrapper > ul li` ]: {
			color: whiteIfDarkBlackIfLight( bodyTextColor, show.columnBackground && columnBackgroundColor ),
		},

		// Editor only styles for colorizing the headings & text of immediate inner blocks.
		// This doesn't get rendered in the frontend.
		editor: {
			[ `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/heading"] h1, ` +
			  `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/heading"] h2, ` +
			  `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/heading"] h3, ` +
			  `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/heading"] h4, ` +
			  `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/heading"] h5, ` +
			  `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/heading"] h6` ]: {
				color: whiteIfDarkBlackIfLight( headingColor, show.columnBackground && columnBackgroundColor ),
			},
			[ `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/paragraph"] p, ` +
			  `.${ uniqueClass }-content-wrapper > * > * [data-type*="core/list"] li` ]: {
				color: whiteIfDarkBlackIfLight( bodyTextColor, show.columnBackground && columnBackgroundColor ),
			},
		},
	} )

	return deepmerge.all( styles )
}

export default createStyles
