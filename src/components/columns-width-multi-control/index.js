/**
 * Internal dependencies
 */
import { AdvancedRangeControl } from '~stackable/components'
import { BaseControl } from '../base-control2'
import { ResetButton } from '../base-control2/reset-button'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { range } from 'lodash'

const ColumnsWidthMultiControl = props => {
	return (
		<BaseControl
			label={ props.label }
			help={ props.help }
			responsive={ props.responsive }
			className={ classnames( [ 'ugb-columns-width-multi-control', 'ugb--help-tip-column-width', props.className ] ) }
		>
			{ range( props.columns ).map( i => {
				return (
					<div key={ i } className="stk-columns-width-multi-control__range">
						<span className="stk-columns-width-multi-control__range__icon">{ i + 1 }</span>
						<div className="stk-columns-width-multi-control__range__range-control">
							<AdvancedRangeControl
								className="stk--no-padding"
								value={ props.values[ i ] }
								max={ 100 }
								min={ 0 }
								onChange={ value => {
									const newValues = [ ...props.values ]
									newValues[ i ] = value
									props.onChange( newValues )
								} }
								allowReset={ false }
								placeholder={ props.placeholders ? props.placeholders[ i ] : '' }
								forcePlaceholder={ true }
							/>
							{ props.allowReset && (
								<ResetButton
									allowReset={ props.allowReset }
									value={ props.values[ i ] }
									default=""
									onChange={ value => {
										const newValues = [ ...props.values ]
										newValues[ i ] = value
										props.onChange( newValues )
									} }
								/>
							) }
						</div>
						<span className="stk-columns-width-multi-control__range__suffix">%</span>
					</div>
				)
			} ) }
		</BaseControl>
	)
}

ColumnsWidthMultiControl.defaultProps = {
	columns: 2,
	values: [ '', '' ],
	onChange: () => {},
	help: '',
	label: __( 'Column Widths', i18n ),
	className: '',
	responsive: false,
	placeholders: null,
}

export default ColumnsWidthMultiControl
