/**
 * Internal dependencies
 */
import { ColumnsControl } from './column-settings-button'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	AdvancedRangeControl,
	ColumnsWidthControl,
	ColumnsWidthMultiControl,
	ControlSeparator,
	InspectorLayoutControls,
	SortControl,
} from '~stackable/components'
import { getAttributeName } from '~stackable/util'
import {
	useBlockAttributesContext, useBlockContext, useBlockSetAttributesContext, useDeviceType,
} from '~stackable/hooks'
import { range } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { select, dispatch } from '@wordpress/data'
import { useBlockEditContext } from '@wordpress/block-editor'
import { useState } from '@wordpress/element'

export const Controls = props => {
	const [ , setColumnsUpdate ] = useState( 0 )
	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const { numInnerBlocks, innerBlocks } = useBlockContext()
	const attributes = useBlockAttributesContext( attributes => {
		return {
			columnArrangementTablet: attributes.columnArrangementTablet,
			columnArrangementMobile: attributes.columnArrangementMobile,
		}
	} )
	const setAttributes = useBlockSetAttributesContext()

	const columnWidths = []
	const columnWidthsTablet = []
	const columnWidthsMobile = []
	let hasTabletColumnWidths = false
	let hasMobileColumnWidths = false

	innerBlocks.forEach( ( { clientId } ) => {
		const attributes = select( 'core/block-editor' ).getBlockAttributes( clientId )
		columnWidths.push( attributes.columnWidth )
		columnWidthsTablet.push( attributes.columnWidthTablet )
		columnWidthsMobile.push( attributes.columnWidthMobile )

		if ( attributes.columnWidthTablet ) {
			hasTabletColumnWidths = true
		}
		if ( attributes.columnWidthMobile ) {
			hasMobileColumnWidths = true
		}
	} )

	const defaultArrangement = range( numInnerBlocks ).map( i => ( i + 1 ).toString() ).join( ',' )
	const sortValues = deviceType === 'Desktop' ? defaultArrangement
		: deviceType === 'Tablet' ? ( attributes.columnArrangementTablet || defaultArrangement )
			: ( attributes.columnArrangementMobile || defaultArrangement )

	return (
		<>
			{ props.hasColumnsControl && <ColumnsControl /> }
			{ numInnerBlocks > 1 && deviceType !== 'Tablet' && deviceType !== 'Mobile' &&
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
						innerBlocks.forEach( ( block, i ) => {
							clientIds.push( block.clientId )
							attributes[ block.clientId ] = {
								[ columnWidthName ]: columnWidths[ i ],
							}
						} )
						dispatch( 'core/block-editor' ).updateBlockAttributes( clientIds, attributes, true ) // eslint-disable-line stackable/no-update-block-attributes
						setColumnsUpdate( Math.random() )
					} }
				/>
			}
			{ numInnerBlocks > 1 && ( deviceType === 'Tablet' || deviceType === 'Mobile' ) &&
				<ColumnsWidthMultiControl
					columns={ numInnerBlocks }
					values={ deviceType === 'Tablet' ? columnWidthsTablet : columnWidthsMobile }
					responsive="all"
					hasTabletValue={ hasTabletColumnWidths }
					hasMobileValue={ hasMobileColumnWidths }
					placeholders={ deviceType === 'Tablet' ? columnWidths : Array( numInnerBlocks ).fill( '100' ) }
					allowReset={ true }
					onChange={ columnWidths => {
						const clientIds = []
						const attributes = {}
						const columnWidthName = getAttributeName( 'columnWidth', deviceType )
						innerBlocks.forEach( ( block, i ) => {
							clientIds.push( block.clientId )
							attributes[ block.clientId ] = {
								[ columnWidthName ]: columnWidths[ i ],
							}
						} )
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
							dispatch( 'core/block-editor' ).moveBlockToPosition(
								innerBlocks[ oldIndex ].clientId,
								clientId,
								clientId,
								newIndex,
							)
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
						units={ [ 'px', 'em' ] }
						defaultLocked={ true }
						min={ [ 0, 0 ] }
						sliderMax={ [ 200, 30 ] }
						placeholder={ numInnerBlocks === 1 ? '0' : '12' }
					/>
					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						attribute="columnGap"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
					/>
					<AdvancedRangeControl
						label={ __( 'Row Gap', i18n ) }
						attribute="rowGap"
						responsive="all"
						min={ 0 }
						sliderMax={ 100 }
						placeholder="0"
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
