/**
 * Internal dependencies
 */
import { ColumnsControl } from './column-settings-button'
import { getRowsFromColumns } from '../column/util'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedRangeControl,
	AdvancedToggleControl,
	ColumnsWidthControl,
	ColumnsWidthMultiControl,
	ControlSeparator,
	InspectorLayoutControls,
	SortControl,
} from '~stackable/components'
import { getAttributeName } from '~stackable/util'
import {
	useBlockAttributesContext,
	useBlockSetAttributesContext,
	useDeviceType,
} from '~stackable/hooks'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	select, dispatch, useSelect,
} from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useState } from '@wordpress/element'

export const Controls = props => {
	const [ , setColumnsUpdate ] = useState( 0 )
	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const {
		numInnerBlocks, innerBlocks,
	} = useSelect(
		select => {
			const { getBlock } = select( 'core/block-editor' )
			const innerBlocks = getBlock( clientId )?.innerBlocks

			return {
				innerBlocks,
				numInnerBlocks: innerBlocks.length,
			}
		},
		[ clientId ]
	)

	const {
		multiClientIds, multiInnerBlocks, hasMultiSelectedBlocks,
	} = useSelect( select => {
		const multiClientIds = select( 'core/block-editor' ).getMultiSelectedBlockClientIds()
		const multiInnerBlocks = {}

		multiClientIds.forEach( clientId => {
			const innerBlocks = select( 'core/block-editor' ).getBlock( clientId )?.innerBlocks
			multiInnerBlocks[ clientId ] = innerBlocks
		} )

		return {
			multiClientIds,
			multiInnerBlocks,
			hasMultiSelectedBlocks: multiClientIds.length > 1,
		}
	} )
	const attributes = useBlockAttributesContext( attributes => {
		return {
			columnArrangementTablet: attributes.columnArrangementTablet,
			columnArrangementMobile: attributes.columnArrangementMobile,
			columnWrapDesktop: attributes.columnWrapDesktop,
		}
	} )
	const setMultiBlockAttributes = ( _clientId, attrs ) => {
		dispatch( 'core/block-editor' ).updateBlockAttributes( multiClientIds, attrs ) // eslint-disable-line stackable/no-update-block-attributes
	}
	const setSingleBlockAttributes = useBlockSetAttributesContext()

	const setAttributes = attrs => {
		if ( multiClientIds.length ) {
			multiClientIds.forEach( _clientId => setMultiBlockAttributes( _clientId, attrs ) )
		} else {
			setSingleBlockAttributes( attrs )
		}
	}

	const columnWidths = []
	const columnWidthsTablet = []
	const columnWidthsMobile = []
	let hasTabletColumnWidths = false
	let hasMobileColumnWidths = false

	innerBlocks.forEach( ( { clientId } ) => {
		const attributes = select( 'core/block-editor' ).getBlockAttributes( clientId )
		if ( attributes ) {
			// check if attributes exist because there might be a delay in updating the inner blocks
			// e.g. a column block may not exist anymore but the inner blocks may still have its client id
			// this fixes the block error when adjusting the number of columns from higher to lower in shared controls
			columnWidths.push( attributes.columnWidth )
			columnWidthsTablet.push( attributes.columnWidthTablet )
			columnWidthsMobile.push( attributes.columnWidthMobile )

			if ( attributes.columnWidthTablet ) {
				hasTabletColumnWidths = true
			}
			if ( attributes.columnWidthMobile ) {
				hasMobileColumnWidths = true
			}
		}
	} )

	const defaultArrangement = range( numInnerBlocks ).map( i => ( i + 1 ).toString() ).join( ',' )
	const sortValues = deviceType === 'Desktop' ? defaultArrangement
		: deviceType === 'Tablet' ? ( attributes.columnArrangementTablet || defaultArrangement )
			: ( attributes.columnArrangementMobile || defaultArrangement )

	return (
		<>
			{ props.hasColumnsControl && <ColumnsControl /> }
			{ numInnerBlocks > 1 && deviceType === 'Desktop' &&
				<AdvancedToggleControl
					label={ __( 'Allow Column Wrapping', i18n ) }
					attribute="columnWrapDesktop"
				/>
			}
			{ numInnerBlocks > 1 && deviceType !== 'Tablet' && deviceType !== 'Mobile' && ! attributes.columnWrapDesktop &&
				<ColumnsWidthControl
					columns={ numInnerBlocks }
					values={ columnWidths }
					hasTabletValue={ hasTabletColumnWidths }
					hasMobileValue={ hasMobileColumnWidths }
					responsive="all"
					onChange={ columnWidths => {
						const clientIds = []
						const attributes = {}
						const columnWidthName = getAttributeName( 'columnWidth', deviceType )
						const columnAdjacentCount = getAttributeName( 'columnAdjacentCount', deviceType )
						if ( hasMultiSelectedBlocks ) {
							Object.values( multiInnerBlocks ).forEach( innerBlocks => {
								innerBlocks.forEach( ( block, i ) => {
									clientIds.push( block.clientId )
									attributes[ block.clientId ] = {
										[ columnWidthName ]: columnWidths[ i ],
										[ columnAdjacentCount ]: columnWidths.length,
									}
								} )
							} )
						} else {
							innerBlocks.forEach( ( block, i ) => {
								clientIds.push( block.clientId )
								attributes[ block.clientId ] = {
									[ columnWidthName ]: columnWidths[ i ],
									[ columnAdjacentCount ]: columnWidths.length,
								}
							} )
						}
						dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
						setColumnsUpdate( Math.random() )
					} }
				/>
			}
			{ numInnerBlocks > 1 && ( deviceType === 'Tablet' || deviceType === 'Mobile' || attributes.columnWrapDesktop ) &&
				<ColumnsWidthMultiControl
					columns={ numInnerBlocks }
					values={ deviceType === 'Desktop' ? columnWidths
						: deviceType === 'Tablet' ? columnWidthsTablet
						 : columnWidthsMobile }
					responsive="all"
					hasTabletValue={ hasTabletColumnWidths }
					hasMobileValue={ hasMobileColumnWidths }
					placeholders={ deviceType === 'Mobile' ? Array( numInnerBlocks ).fill( '100' ) : columnWidths }
					allowReset={ true }
					onChange={ columnWidths => {
						const columnRows = getRowsFromColumns( columnWidths )

						const clientIds = []
						const attributes = {}
						const columnWidthName = getAttributeName( 'columnWidth', deviceType )
						const columnAdjacentCount = getAttributeName( 'columnAdjacentCount', deviceType )
						if ( hasMultiSelectedBlocks ) {
							Object.values( multiInnerBlocks ).forEach( innerBlocks => {
								innerBlocks.forEach( ( block, i ) => {
									clientIds.push( block.clientId )
									attributes[ block.clientId ] = {
										[ columnWidthName ]: columnWidths[ i ],
										[ columnAdjacentCount ]: columnRows.filter( n => n === columnRows[ i ] ).length,
									}
								} )
							} )
						} else {
							innerBlocks.forEach( ( block, i ) => {
								clientIds.push( block.clientId )
								attributes[ block.clientId ] = {
									[ columnWidthName ]: columnWidths[ i ],
									[ columnAdjacentCount ]: columnRows.filter( n => n === columnRows[ i ] ).length,
								}
							} )
						}
						dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
						setColumnsUpdate( Math.random() )
					} }
				/>
			}
			{ numInnerBlocks > 1 && (
				<SortControl
					responsive="all"
					attribute="columnArrangement"
					axis={ deviceType !== 'Mobile' ? 'x' : 'y' }
					values={ sortValues }
					num={ numInnerBlocks }
					allowReset={ true }
					onChange={ ( value, { oldIndex, newIndex } ) => {
						if ( deviceType !== 'Tablet' && deviceType !== 'Mobile' ) {
							if ( hasMultiSelectedBlocks ) {
								for ( const multiClientId in multiInnerBlocks ) {
									dispatch( 'core/block-editor' ).moveBlockToPosition(
										multiInnerBlocks[ multiClientId ][ oldIndex ].clientId,
										multiClientId,
										multiClientId,
										newIndex,
									)
								}
							} else {
								dispatch( 'core/block-editor' ).moveBlockToPosition(
									innerBlocks[ oldIndex ].clientId,
									clientId,
									clientId,
									newIndex,
								)
							}
						} else {
							const attrName = getAttributeName( 'columnArrangement', deviceType )
							setAttributes( { [ attrName ]: ( value || [] ).join( ',' ) } )
						}
					} }
				/>
			) }
			<ControlSeparator />
			{ props.hasGap && (
				<>
					<AdvancedRangeControl
						label={ __( 'Inner Column Spacing', i18n ) }
						attribute="columnSpacing"
						responsive="all"
						units={ [ 'px', 'em', 'vw' ] }
						defaultLocked={ true }
						min={ [ 0, 0 ] }
						sliderMax={ [ 200, 30 ] }
						placeholder={ numInnerBlocks === 1 ? '0' : '12' }
						visualGuide={ {
							selector: '.stk-%s-column > * > * > [data-type="stackable/column"] > * > .stk-column > .stk-inner-blocks',
							highlight: 'column-spacing',
							defaultValue: '12px',
						} }
						// TODO: Sample of how to use the new helpTooltip
						helpTooltip={ {
							// Add a working video
							description: __( 'Sets column paddings, the space inside the block between the block elements and the column container border', i18n ),
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						attribute="columnGap"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						visualGuide={ {
							selector: '.stk-%s-column > * > *',
							highlight: 'columns:column-gap',
							responsive: [ 'desktop' ],
						} }
						helpTooltip={ {
							video: 'column-gap',
							description: __( 'Sets the distance between two or more columns', i18n ),
						} }
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						attribute="rowGap"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
						helpTooltip={ {
							// TODO: Add a working video
							description: __( 'Sets the distance between two or more columns', i18n ),
						} }
					/>
				</>
			) }
		</>
	)
}

export const Edit = props => {
	return (
		<InspectorLayoutControls>
			<Controls { ...props } />
		</InspectorLayoutControls>
	)
}

Edit.defaultProps = {
	hasColumnsControl: true,
	hasGap: true,
}

Edit.Controls = Controls
