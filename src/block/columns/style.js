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
	const columnRanges = range( numColumns ).map( i => {
		const width = parseInt( getValue( `columns${ i + 1 }` ), 10 )
		return ( width / 100 * columns ).toFixed( 2 ) + 'fr' // Fraction.
	} )
	const tabletColumnRanges = range( numColumns ).map( i => {
		const width = parseInt( getValue( `tabletColumns${ i + 1 }` ), 10 )
		return ( width / 100 * columns ).toFixed( 2 ) + 'fr' // Fraction.
	} )
	styles.push( {
		'> .ugb-inner-block > .ugb-block-content > .ugb-columns__item': {
			gridTemplateColumns: appendImportant( columnRanges.join( ' ' ) ),
		},
		tablet: {
			'> .ugb-inner-block > .ugb-block-content > .ugb-columns__item': {
				gridTemplateColumns: getValue( `tabletColumns1` ) ? appendImportant( tabletColumnRanges.join( ' ' ) ) : undefined,
			},
		},
		editor: {
			'> .ugb-inner-block > .ugb-block-content > .ugb-columns__item > .block-editor-inner-blocks > .block-editor-block-list__layout': {
				gridTemplateColumns: appendImportant( columnRanges.join( ' ' ) ),
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
		[ `` ]: {
			paddingTop: height === 'tall' ? '110px !important' : undefined,
			paddingBottom: height === 'tall' ? '110px !important' : undefined,
			minHeight: height === 'half' ? '50vh' :
				height === 'full' ? '100vh' :
					undefined,
		},
		tablet: {
			[ `` ]: {
				paddingTop: tabletHeight === 'tall' ? '110px !important' : undefined,
				paddingBottom: tabletHeight === 'tall' ? '110px !important' : undefined,
				minHeight: tabletHeight === 'half' ? '50vh' :
					tabletHeight === 'full' ? '100vh' :
						undefined,
			},
		},
		mobile: {
			[ `` ]: {
				paddingTop: mobileHeight === 'tall' ? '110px !important' : undefined,
				paddingBottom: mobileHeight === 'tall' ? '110px !important' : undefined,
				minHeight: mobileHeight === 'half' ? '50vh' :
					mobileHeight === 'full' ? '100vh' :
						undefined,
			},
		},
	} )

	// Column Vertical Align.
	styles.push( ...createResponsiveStyles( `.${ uniqueClass }-content-wrapper > .ugb-column`, '%sColumnVerticalAlign', 'alignItems', '%s', props.attributes, true ) )
	styles.push( ...createResponsiveStyles( `.${ uniqueClass }-content-wrapper > .ugb-column > .ugb-inner-block`, '%sColumnVerticalAlign', 'height', 'auto', props.attributes, true ) )

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
