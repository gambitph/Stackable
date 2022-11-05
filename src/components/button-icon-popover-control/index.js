/**
 * Internal dependencies
 */
import { Button, BaseControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { ToggleControl, Dropdown } from '@wordpress/components'
import { memo } from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'

const popoverProps = {
	placement: 'left-start',
	offset: 36,
	shift: true,
}

const ButtonIconPopoverControl = memo( props => {
	return (
		<BaseControl
			help={ props.help }
			label={ props.label }
			id="ugb-button-icon-control"
			className={ classnames( 'ugb-button-icon-control', props.className ) }
			allowReset={ true }
			showReset={ props.allowReset || ( props.onToggle ? props.checked : false ) }
			onReset={ () => {
				props.onReset()
				if ( props.onToggle ) {
					props.onToggle( false )
				}
			} }
			hasLabel={ ! props.onToggle }
		>
			{ props.onToggle && (
				<ToggleControl
					label={ props.label }
					checked={ props.checked }
					onChange={ props.onToggle }
				/>
			) }
			<div className="ugb-button-icon-control__wrapper">
				<Dropdown
					popoverProps={ popoverProps }
					focusOnMount="container"
					renderToggle={ props => (
						<Button
							onClick={ props.onToggle }
							className="ugb-button-icon-control__edit"
							label={ __( 'Edit', i18n ) }
							isSecondary
							icon="edit"
							aria-expanded={ props.isOpen }
						/>
					) }
					renderContent={ () => (
						<div className="stk-button-icon-popover__popover-container">
							{ ( typeof props.popoverLabel !== 'undefined' ? props.popoverLabel : props.label ) &&
								<h2 className="stk-button-icon-popover__popover-title">{ props.popoverLabel || props.label }</h2>
							}
							{ props.children }
						</div>
					) }
				/>
			</div>
		</BaseControl>
	)
} )

ButtonIconPopoverControl.defaultProps = {
	help: '',
	label: '',
	popoverLabel: undefined,
	className: '',
	allowReset: false,
	onReset: () => {},
	checked: false,
	onToggle: undefined,
}

export default ButtonIconPopoverControl
