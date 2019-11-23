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
import { getIconSVGBase64 } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		showBlockBackground = '',
		blockBackgroundBackgroundColor = '',
		listTextColor = '',
	} = props.attributes

	const iconSVGString = getIconSVGBase64(
		icon,
		iconShape,
		whiteIfDark( iconColor, showBlockBackground && blockBackgroundBackgroundColor )
	)

	const styles = []

	styles.push( {
		li: {
			...createTypographyStyles( 'listText%s', 'desktop', props.attributes ),
			color: whiteIfDark( listTextColor, showBlockBackground && blockBackgroundBackgroundColor ),
		},
	} )

	// Icon.
	styles.push( {
		// This is for the text-indend & padding-left trick (see style.scss for details).
		li: {
			'--icon-size': iconSize ? `${ iconSize }px` : undefined,
		},
		'li::before': {
			height: appendImportant( getValue( 'iconSize', '%spx' ) ),
			width: appendImportant( getValue( 'iconSize', '%spx' ) ),
			backgroundImage: 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
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
