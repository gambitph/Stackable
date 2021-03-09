/**
 * Internal dependencies
 */
import BaseControlMultiLabel from '../base-control-multi-label'
import DesignControl from '../design-control'
import Image2_1 from './images/2-1.png'
import Image2_2 from './images/2-2.png'
import Image2_3 from './images/2-3.png'
import Image3_1 from './images/3-1.png'
import Image3_2 from './images/3-2.png'
import Image3_3 from './images/3-3.png'
import Image3_4 from './images/3-4.png'
import Image4_1 from './images/4-1.png'
import Image4_2 from './images/4-2.png'
import Image4_3 from './images/4-3.png'
import ImageGrid2_1 from './images/2-1-grid.png'
import ImageGrid2_2 from './images/2-2-grid.png'
import ImageGrid2_3 from './images/2-3-grid.png'
import ImageGrid3_1 from './images/3-1-grid.png'
import ImageGrid3_2 from './images/3-2-grid.png'
import ImageGrid3_3 from './images/3-3-grid.png'
import ImageGrid3_4 from './images/3-4-grid.png'
import ImageGrid4_1 from './images/4-1-grid.png'
import ImageGrid4_2 from './images/4-2-grid.png'
import ImageGrid4_3 from './images/4-3-grid.png'
import ImageUneven2_1 from './images/2-1-uneven.png'
import ImageUneven2_2 from './images/2-2-uneven.png'
import ImageUneven2_3 from './images/2-3-uneven.png'
import ImageUneven3_1 from './images/3-1-uneven.png'
import ImageUneven3_2 from './images/3-2-uneven.png'
import ImageUneven3_3 from './images/3-3-uneven.png'
import ImageUneven3_4 from './images/3-4-uneven.png'
import ImageUneven4_1 from './images/4-1-uneven.png'
import ImageUneven4_2 from './images/4-2-uneven.png'
import ImageUneven4_3 from './images/4-3-uneven.png'
import ColumnSlider from './column-slider'
import ColumnsInputs from './columns-inputs'

/**
 * WordPress dependencies
 */
import { BaseControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { range, isEqual } from 'lodash'
import { AdvancedRangeControl, Button } from '~stackable/components'

const MIN = 10

const COLUMN_PRESETS = {
	'2-1': [ 50, 50 ],
	'2-2': [ 67, 33 ],
	'2-3': [ 33, 67 ],
	'3-1': [ 33, 33, 34 ],
	'3-2': [ 25, 50, 25 ],
	'3-3': [ 50, 25, 25 ],
	'3-4': [ 25, 25, 50 ],
	'4-1': [ 25, 25, 25, 25 ],
	'4-2': [ 40, 20, 20, 20 ],
	'4-3': [ 20, 20, 20, 40 ],
	'5-1': [ 20, 20, 20, 20, 20 ],
	'6-1': [ 16, 17, 17, 17, 17, 16 ],
}

const COLUMN_PRESET_OPTIONS = {
	plain: {
		2: [
			{ value: '2-1', image: Image2_1 },
			{ value: '2-2', image: Image2_2 },
			{ value: '2-3', image: Image2_3 },
		],
		3: [
			{ value: '3-1', image: Image3_1 },
			{ value: '3-2', image: Image3_2 },
			{ value: '3-3', image: Image3_3 },
			{ value: '3-4', image: Image3_4 },
		],
		4: [
			{ value: '4-1', image: Image4_1 },
			{ value: '4-2', image: Image4_2 },
			{ value: '4-3', image: Image4_3 },
		],
	},
	grid: {
		2: [
			{ value: '2-1', image: ImageGrid2_1 },
			{ value: '2-2', image: ImageGrid2_2 },
			{ value: '2-3', image: ImageGrid2_3 },
		],
		3: [
			{ value: '3-1', image: ImageGrid3_1 },
			{ value: '3-2', image: ImageGrid3_2 },
			{ value: '3-3', image: ImageGrid3_3 },
			{ value: '3-4', image: ImageGrid3_4 },
		],
		4: [
			{ value: '4-1', image: ImageGrid4_1 },
			{ value: '4-2', image: ImageGrid4_2 },
			{ value: '4-3', image: ImageGrid4_3 },
		],
	},
	uneven: {
		2: [
			{ value: '2-1', image: ImageUneven2_1 },
			{ value: '2-2', image: ImageUneven2_2 },
			{ value: '2-3', image: ImageUneven2_3 },
		],
		3: [
			{ value: '3-1', image: ImageUneven3_1 },
			{ value: '3-2', image: ImageUneven3_2 },
			{ value: '3-3', image: ImageUneven3_3 },
			{ value: '3-4', image: ImageUneven3_4 },
		],
		4: [
			{ value: '4-1', image: ImageUneven4_1 },
			{ value: '4-2', image: ImageUneven4_2 },
			{ value: '4-3', image: ImageUneven4_3 },
		],
	},
}

const columnWidthSum = columnWidths => {
	return columnWidths.reduce( ( sum, width ) => sum + width, 0 )
}

/**
 * Adjust the given column widths. The resulting column widths will always total
 * to 100.
 *
 * @param {number} newColumnWidth The column width in pixels.
 * @param {number} column The index of the column being adjusted.
 * @param {Array} columnWidths The current widths of the column.
 * @param {boolean} adjustRightFirst If true, adjust the succeeding columns
 * first before the left ones if the new columns do not occupy the available
 * 100%.
 */
const adjustColumns = ( newColumnWidth, column, columnWidths, adjustRightFirst = true ) => {
	columnWidths[ column ] = newColumnWidth

	if ( adjustRightFirst ) {
		for ( let i = column + 1; i < columnWidths.length && columnWidthSum( columnWidths ) !== 100; i++ ) {
			const extra = 100 - columnWidthSum( columnWidths )
			columnWidths[ i ] += extra
			if ( columnWidths[ i ] < MIN ) {
				columnWidths[ i ] = MIN
			}
		}
	}

	for ( let i = column - 1; i >= 0 && columnWidthSum( columnWidths ) !== 100; i-- ) {
		const extra = 100 - columnWidthSum( columnWidths )
		columnWidths[ i ] += extra
		if ( columnWidths[ i ] < MIN ) {
			columnWidths[ i ] = MIN
		}
	}

	if ( ! adjustRightFirst ) {
		for ( let i = column + 1; i < columnWidths.length && columnWidthSum( columnWidths ) !== 100; i++ ) {
			const extra = 100 - columnWidthSum( columnWidths )
			columnWidths[ i ] += extra
			if ( columnWidths[ i ] < MIN ) {
				columnWidths[ i ] = MIN
			}
		}
	}

	return columnWidths
}

const isBlank = columns => columns.every( column => ! column )

const ColumnsWidthControl = props => {
	const [ lastColumnAdjusted, setLastColumnAdjusted ] = useState( -1 )
	const [ adjustRightFirst, setAdjustRightFirst ] = useState( true )
	const [ selectedPreset, setSelectedPreset ] = useState( '' )

	useEffect( () => {
		setSelectedPreset( '' )
	}, [ props.columns ] )

	const designType = props.design === 'grid' ? 'grid' :
		props.design === 'plain' ? 'plain' :
			'uneven'
	const columnPresetOptions = COLUMN_PRESET_OPTIONS[ designType ]

	const resetButton = (
		<Button
			className="ugb-columns-width-control__reset"
			disabled={ ! props.forceBlank ? isEqual( props.values, COLUMN_PRESETS[ selectedPreset || `${ props.columns }-1` ] ) : isBlank( props.values ) }
			onClick={ () => {
				setSelectedPreset( '' )
				if ( ! props.forceBlank ) {
					props.onChange( COLUMN_PRESETS[ selectedPreset || `${ props.columns }-1` ] )
				} else {
					props.onChange( [ '', '', '', '', '', '' ] )
				}
			} }
			isSmall
			isSecondary
		>
			{ __( 'Reset' ) }
		</Button>
	)

	return (
		<BaseControl
			help={ props.help }
			className={ classnames( [ 'ugb-columns-width-control', 'ugb--help-tip-column-width', props.className ] ) }
		>
			{ ( props.hasIndividualControls || ( ! props.hasIndividualControls && columnPresetOptions[ props.columns ] ) ) &&
				<BaseControlMultiLabel
					label={ props.label }
					afterButton={ props.hasIndividualControls ? resetButton : null }
					screens={ props.screens }
				/>
			}
			{ columnPresetOptions[ props.columns ] &&
				<DesignControl
					options={ columnPresetOptions[ props.columns ] }
					onChange={ value => {
						setLastColumnAdjusted( -1 )
						setAdjustRightFirst( true )
						setSelectedPreset( value )
						props.onChange( COLUMN_PRESETS[ value ] )
					} }
				/>
			}
			{ props.hasIndividualControls &&
				<Fragment>
					<ColumnSlider
						value={ isBlank( props.values ) ? COLUMN_PRESETS[ `${ props.columns }-1` ] : props.values }
						onChange={ value => {
							props.onChange( value )
						} }
					/>
					<ColumnsInputs
						value={ isBlank( props.values ) ? ( props.forceBlank ? props.values : COLUMN_PRESETS[ `${ props.columns }-1` ] ) : props.values }
						onChange={ value => {
							props.onChange( value )
						} }
					/>
					{ false && range( props.columns ).map( i => {
						return (
							<div key={ i } className="ugb-columns-width-control__range">
								<span className="ugb-columns-width-control__icon">{ i + 1 }</span>
								<AdvancedRangeControl
									value={ props.values[ i ] }
									onChange={ value => {
										// Check whether we need to adjust the
										// succeeding columns first or the prior
										// columns. This is done to make the UX
										// better.
										const newAdjustRightFirst = lastColumnAdjusted < i ? true :
											lastColumnAdjusted > i ? false :
												adjustRightFirst

										// We need to remember the previous adjustments made.
										setLastColumnAdjusted( i )
										setAdjustRightFirst( newAdjustRightFirst )

										// Perform the column adjustments.
										props.onChange( adjustColumns( value, i, props.values, true ) )
									} }
									min="10"
									max={ 100 - ( ( props.columns - 1 ) * 10 ) }
									step="1"
								/>
								<span className="ugb-columns-width-control__suffix">%</span>
							</div>
						)
					} ) }
				</Fragment>
			}
		</BaseControl>
	)
}

ColumnsWidthControl.defaultProps = {
	columns: 2,
	design: 'plain',
	values: [ '', '' ],
	onChange: () => {},
	help: '',
	label: __( 'Column Widths', i18n ),
	className: '',
	hasIndividualControls: true,
	screens: [ 'desktop' ],
	forceBlank: false, // If true, the value will be blank by default and can be reset to blank. Used for mobile/desktop options.
}

export default ColumnsWidthControl
