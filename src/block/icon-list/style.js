/**
 * External dependencies
 */
import {
	createTypographyStyles,
	whiteIfDark,
	appendImportant,
	__getValue,
} from '~stackable/util'

/**
 * Internal dependencies
 */
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const {
		iconColor,
		showBlockBackground = '',
		blockBackgroundBackgroundColor = '',
		listTextColor = '',
	} = props.attributes

	const styles = []

	styles.push( {
		li: {
			...createTypographyStyles( 'listText%s', 'desktop', props.attributes ),
			color: whiteIfDark( listTextColor, showBlockBackground && blockBackgroundBackgroundColor ),
		},
		tablet: {
			li: {
				...createTypographyStyles( 'listText%s', 'tablet', props.attributes ),
			},
		},
		mobile: {
			li: {
				...createTypographyStyles( 'listText%s', 'mobile', props.attributes ),
			},
		},
	} )

	// Icon.
	styles.push( {
		'.ugb-icon-inner-svg': {
			height: appendImportant( getValue( 'iconSize', '%spx' ) ),
			width: appendImportant( getValue( 'iconSize', '%spx' ) ),
		},
		'.ugb-icon-inner-svg > svg': {
			height: appendImportant( getValue( 'iconSize', '%spx' ) ),
			width: appendImportant( getValue( 'iconSize', '%spx' ) ),
			opacity: appendImportant( getValue( 'opacity' ) ),
			transform: appendImportant( getValue( 'Rotation', 'rotate(%sdeg)' ) ),
			fill: appendImportant( whiteIfDark( iconColor, showBlockBackground && blockBackgroundBackgroundColor ) ),
			color: appendImportant( whiteIfDark( iconColor, showBlockBackground && blockBackgroundBackgroundColor ) ),
		},
		editor: {
			'.ugb-svg-icon-placeholder': {
				height: appendImportant( getValue( 'iconSize', '%spx' ) ),
				width: appendImportant( getValue( 'iconSize', '%spx' ) ),
			},
		},
	} )

	// Spacing.
	styles.push( {
		li: {
			marginBottom: appendImportant( getValue( 'gap', '%spx' ) ),
		},
		// Nested list spacing.
		'li ul': {
			marginBottom: appendImportant( getValue( 'gap', '%spx' ) ),
		},
	} )

	// Columns.
	const {
		displayAsGrid = false,
	} = props.attributes
	const columnsNum = attrName => getValue( attrName ) ? parseInt( getValue( attrName ), 10 ) : 1
	const getGridColumns = columns => ( new Array( columns + 1 ).join( '1fr ' ) ).trim()
	styles.push( {
		'.ugb-icon-list ul': {
			columns: getValue( 'columns' ),
			gridTemplateColumns: getValue( 'columns' ) && displayAsGrid ? getGridColumns( columnsNum( 'columns' ) ) : undefined,
		},
		tablet: {
			'.ugb-icon-list ul': {
				columns: getValue( 'tabletColumns', '%s !important' ),
				gridTemplateColumns: getValue( 'tabletColumns' ) && displayAsGrid ? getGridColumns( columnsNum( 'tabletColumns' ) ) + ' !important' : undefined,
			},
		},
		mobile: {
			'.ugb-icon-list ul': {
				columns: getValue( 'mobileColumns', '%s !important' ),
				gridTemplateColumns: getValue( 'mobileColumns' ) && displayAsGrid ? getGridColumns( columnsNum( 'mobileColumns' ) ) + ' !important' : undefined,
			},
		},
	} )

	return deepmerge.all( styles )
}

export default createStyles
