/**
 * Internal dependencies
 */
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
import ColumnSlider from './column-slider'
import ColumnsInputs from './columns-inputs'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { DesignControl } from '~stackable/components'
import { BaseControl } from '../base-control2'

const COLUMN_PRESETS = {
	'2-1': [ 50, 50 ],
	'2-2': [ 66.666, 33.333 ],
	'2-3': [ 33.333, 66.666 ],
	'3-1': [ 33.333, 33.333, 33.333 ],
	'3-2': [ 25, 50, 25 ],
	'3-3': [ 50, 25, 25 ],
	'3-4': [ 25, 25, 50 ],
	'4-1': [ 25, 25, 25, 25 ],
	'4-2': [ 40, 20, 20, 20 ],
	'4-3': [ 20, 20, 20, 40 ],
	'5-1': [ 20, 20, 20, 20, 20 ],
	'6-1': [ 16.666, 16.666, 16.666, 16.666, 16.666, 16.666 ],
}

const COLUMN_PRESET_OPTIONS = {
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
}

const isBlank = columns => columns.every( column => ! column )

const ColumnsWidthControl = props => {
	return (
		<BaseControl
			label={ props.label }
			help={ props.help }
			responsive={ props.responsive }
			className={ classnames( [ 'ugb-columns-width-control', 'ugb--help-tip-column-width', props.className ] ) }
		>
			{ COLUMN_PRESET_OPTIONS[ props.columns ] &&
				<DesignControl
					options={ COLUMN_PRESET_OPTIONS[ props.columns ] }
					onChange={ value => {
						props.onChange( COLUMN_PRESETS[ value ] )
					} }
				/>
			}
			<ColumnSlider
				value={ isBlank( props.values ) ? COLUMN_PRESETS[ `${ props.columns }-1` ] : props.values }
				onChange={ props.onChange }
			/>
			<ColumnsInputs
				value={ isBlank( props.values ) ? ( props.forceBlank ? props.values : COLUMN_PRESETS[ `${ props.columns }-1` ] ) : props.values }
				onChange={ props.onChange }
			/>
		</BaseControl>
	)
}

ColumnsWidthControl.defaultProps = {
	columns: 2,
	values: [ '', '' ],
	onChange: () => {},
	help: '',
	label: __( 'Column Widths', i18n ),
	className: '',
	responsive: false,
}

export default ColumnsWidthControl
