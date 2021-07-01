/**
 * External dependencies
 */
import {
	appendImportant,
	__getValue,
	createResponsiveStyles,
} from '~stackable/util'
import deepmerge from 'deepmerge'
import { range } from 'lodash'

/**
 * Internal dependencies
 */
import { showOptions, getColumnCountFromDesign } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const styles = []

	const {
		design = 'plain',
		columns = 2,
		uniqueClass = '',
	} = props.attributes

	const show = showOptions( props )

	// Columns.
	const numColumns = getColumnCountFromDesign( columns, design )
	let columnRanges = range( numColumns ).map( i => {
		if ( ! getValue( `columns${ i + 1 }` ) ) {
			return '1.00fr'
		}
		const width = parseInt( getValue( `columns${ i + 1 }` ), 10 )
		return ( width / 100 * columns ).toFixed( 2 ) + 'fr' // Fraction.
	} )

	// Fix column ranges for uneven columns that should be even, e.g. 33, 33, 34.
	if ( numColumns === 3 && range( numColumns ).every( i => [ 33, 34 ].includes( getValue( `columns${ i + 1 }` ) ) ) ) {
		columnRanges = [ '1.00fr', '1.00fr', '1.00fr' ]
	} else if ( numColumns === 6 && range( numColumns ).every( i => [ 16, 17 ].includes( getValue( `columns${ i + 1 }` ) ) ) ) {
		columnRanges = [ '1.00fr', '1.00fr', '1.00fr', '1.00fr', '1.00fr', '1.00fr' ]
	}

	let tabletColumnRanges = range( numColumns ).map( i => {
		if ( ! getValue( `tabletColumns${ i + 1 }` ) ) {
			return '1.00fr'
		}
		const width = parseInt( getValue( `tabletColumns${ i + 1 }` ), 10 )
		return ( width / 100 * columns ).toFixed( 2 ) + 'fr' // Fraction.
	} )

	// Fix column ranges for uneven columns that should be even, e.g. 33, 33, 34.
	if ( numColumns === 3 && range( numColumns ).every( i => [ 33, 34 ].includes( getValue( `tabletColumns${ i + 1 }` ) ) ) ) {
		tabletColumnRanges = [ '1.00fr', '1.00fr', '1.00fr' ]
	} else if ( numColumns === 6 && range( numColumns ).every( i => [ 16, 17 ].includes( getValue( `tabletColumns${ i + 1 }` ) ) ) ) {
		tabletColumnRanges = [ '1.00fr', '1.00fr', '1.00fr', '1.00fr', '1.00fr', '1.00fr' ]
	}

	styles.push( {
		'> .ugb-inner-block > .ugb-block-content > .ugb-columns__item': {
			gridTemplateColumns: ! columnRanges.every( c => c === '1.00fr' ) ? appendImportant( columnRanges.join( ' ' ) ) : undefined,
		},
		tablet: {
			'> .ugb-inner-block > .ugb-block-content > .ugb-columns__item': {
				gridTemplateColumns: getValue( `tabletColumns1` ) && ! tabletColumnRanges.every( c => c === '1.00fr' ) ? appendImportant( tabletColumnRanges.join( ' ' ) ) : undefined,
			},
		},
		editor: {
			'> .ugb-inner-block > .ugb-block-content > .ugb-columns__item > .block-editor-inner-blocks > .block-editor-block-list__layout': {
				gridTemplateColumns: ! columnRanges.every( c => c === '1.00fr' ) ? appendImportant( columnRanges.join( ' ' ) ) : undefined,
			},
			tablet: {
				'> .ugb-inner-block > .ugb-block-content > .ugb-columns__item > .block-editor-inner-blocks > .block-editor-block-list__layout': {
					gridTemplateColumns: getValue( `tabletColumns1` ) && ! tabletColumnRanges.every( c => c === '1.00fr' ) ? appendImportant( tabletColumnRanges.join( ' ' ) ) : undefined,
				},
			},
		},
	} )

	// No paddings.
	const {
		noPaddings = '',
	} = props.attributes
	if ( show.noPaddings && noPaddings ) {
		styles.push( {
			'': {
				paddingLeft: appendImportant( 0 ),
				paddingRight: appendImportant( 0 ),
			},
		} )
	}

	// Height.
	const {
		height = '',
		tabletHeight = '',
		mobileHeight = '',
	} = props.attributes
	styles.push( {
		[ `.${ uniqueClass }-content-wrapper` ]: {
			minHeight: height === 'half' ? '50vh !important' :
				height === 'full' ? '100vh !important' :
					height === 'custom' ? appendImportant( getValue( 'heightNum', '%s' + getValue( 'heightNumUnit', '%s', 'px' ) ) ) :
						undefined,
		},
		tablet: {
			[ `.${ uniqueClass }-content-wrapper` ]: {
				minHeight: tabletHeight === 'half' ? '50vh !important' :
					tabletHeight === 'full' ? '100vh !important' :
						tabletHeight === 'custom' ? appendImportant( getValue( 'tabletHeightNum', '%s' + getValue( 'tabletHeightNumUnit', '%s', 'px' ) ) ) :
							undefined,
			},
		},
		mobile: {
			[ `.${ uniqueClass }-content-wrapper` ]: {
				minHeight: mobileHeight === 'half' ? '50vh !important' :
					mobileHeight === 'full' ? '100vh !important' :
						mobileHeight === 'custom' ? appendImportant( getValue( 'mobileHeightNum', '%s' + getValue( 'mobileHeightNumUnit', '%s', 'px' ) ) ) :
							undefined,
			},
		},
	} )

	// Column Vertical Align.
	styles.push( ...createResponsiveStyles( `.${ uniqueClass }-content-wrapper > .ugb-column`, '%sColumnVerticalAlign', 'alignItems', '%s', props.attributes, { important: true } ) )
	styles.push( ...createResponsiveStyles( `.${ uniqueClass }-content-wrapper > .ugb-column > .ugb-inner-block`, '%sColumnVerticalAlign', 'height', 'auto', props.attributes, { important: true } ) )

	// Column Vertical Align editor only.
	const {
		columnVerticalAlign = '',
		tabletColumnVerticalAlign = '',
		mobileColumnVerticalAlign = '',
	} = props.attributes
	const columnEditorSelector = `.${ uniqueClass }-content-wrapper > .block-editor-inner-blocks > .block-editor-block-list__layout > .block-editor-block-list__block`
	styles.push( {
		editor: {
			[ `${ columnEditorSelector } > .ugb-column` ]: {
				height: appendImportant( columnVerticalAlign && columnVerticalAlign !== 'stretch' ? 'auto' : undefined ),
			},
			[ columnEditorSelector ]: {
				justifyContent: getValue( 'columnVerticalAlign' ),
			},
			tablet: {
				[ `${ columnEditorSelector } > .ugb-column` ]: {
					height: appendImportant( tabletColumnVerticalAlign && tabletColumnVerticalAlign !== 'stretch' ? 'auto' : undefined ),
				},
				[ columnEditorSelector ]: {
					justifyContent: getValue( 'tabletColumnVerticalAlign' ),
				},
			},
			mobile: {
				[ `${ columnEditorSelector } > .ugb-column` ]: {
					height: appendImportant( mobileColumnVerticalAlign && mobileColumnVerticalAlign !== 'stretch' ? 'auto' : undefined ),
				},
				[ columnEditorSelector ]: {
					justifyContent: getValue( 'mobileColumnVerticalAlign' ),
				},
			},
		},
	} )

	// Text Colors.
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

	return deepmerge.all( styles )
}

export default createStyles
