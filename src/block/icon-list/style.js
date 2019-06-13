import {
	createTypographyStyles,
	whiteIfDark,
} from '@stackable/util'
import deepmerge from 'deepmerge'
import { getIconSVGBase64 } from './util'
import { sprintf } from '@wordpress/i18n'

export const createStyles = props => {
	const getValue = ( attrName, format = '' ) => {
		const value = typeof props.attributes[ attrName ] === 'undefined' ? '' : props.attributes[ attrName ]
		return value !== '' ? ( format ? sprintf( format, value ) : value ) : undefined
	}

	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		gap,
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
		'.ugb-icon-list li': {
			...createTypographyStyles( 'listText%s', 'desktop', props.attributes ),
			color: whiteIfDark( listTextColor, showBlockBackground && blockBackgroundBackgroundColor ),
			'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
			'--icon-size': iconSize ? `${ iconSize }px` : undefined,
			'--gap': gap ? `${ gap }px` : undefined,
		},
	} )

	// Columns.
	styles.push( {
		'.ugb-icon-list ul': {
			columns: getValue( 'columns' ),
		},
		tablet: {
			'.ugb-icon-list ul': {
				columns: getValue( 'tabletColumns', '%s !important' ),
			},
		},
		mobile: {
			'.ugb-icon-list ul': {
				columns: getValue( 'mobileColumns', '%s !important' ),
			},
		},
	} )

	return deepmerge.all( styles )
}

export default createStyles
