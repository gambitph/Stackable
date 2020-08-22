/**
 * External dependencies
 */
import {
	createTypographyStyles,
	createResponsiveStyles,
	whiteIfDark,
	appendImportant,
	__getValue,
} from '~stackable/util'
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import { convertSVGStringToBase64 } from './util'
import deepmerge from 'deepmerge'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const {
		icon,
		iconColor,
		showBlockBackground = '',
		blockBackgroundBackgroundColor = '',
		listTextColor = '',
	} = props.attributes

	const base64IconString = convertSVGStringToBase64( icon, whiteIfDark( iconColor, showBlockBackground && blockBackgroundBackgroundColor ) )

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
	const generateIconStyles = () => {
		const iconStyle = {}
		range( 1, 21 ).forEach( index => {
			if ( getValue( `icon${ index }` ) ) {
				const iconBase64 = convertSVGStringToBase64( getValue( `icon${ index }` ), whiteIfDark( iconColor, showBlockBackground && blockBackgroundBackgroundColor ) )
				iconStyle[ `li:nth-child(${ index }):before` ] = {
					backgroundImage: `url('data:image/svg+xml;base64,${ getValue( `icon${ index }` ) ? iconBase64 : base64IconString }')`,
				}
			}
		} )
		return iconStyle
	}

	// This is for the text-indend & padding-left trick (see style.scss for details).
	styles.push( ...createResponsiveStyles( 'li', 'icon%sSize', '--icon-size', '%spx', props.attributes, { important: true } ) )
	// Icon size.
	styles.push( ...createResponsiveStyles( 'li::before', 'icon%sSize', 'width', '%spx', props.attributes, { important: true } ) )
	styles.push( ...createResponsiveStyles( 'li::before', 'icon%sSize', 'height', '%spx', props.attributes, { important: true } ) )

	// Icon styles.
	styles.push( {
		'li::before': {
			opacity: appendImportant( getValue( 'opacity' ) ),
			transform: appendImportant( getValue( 'Rotation', 'rotate(%sdeg)' ) ),
			backgroundImage: base64IconString ? `url('data:image/svg+xml;base64,${ base64IconString }')` : undefined,
		},
		...generateIconStyles(),
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
