/**
 * Internal dependencies
 */
import { Button, BaseControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Popover, ToggleControl, PanelBody,
} from '@wordpress/components'
import {
	memo, useEffect, useState,
} from '@wordpress/element'
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'

const ButtonIconPopoverControl = memo( props => {
	const [ isOpen, setIsOpen ] = useState( false )

	useEffect( () => {
		if ( isOpen ) {
			const handleOnClickOutside = ev => {
				// If the Media Manager is open, do not do anything since this might
				// interfere with how the Media Manager works.
				if ( window.wp?.media?.frame?.el?.clientHeight ) {
					return
				}

				if ( ! ev.target.closest( '.ugb-button-icon-control__popover' ) &&
					! ev.target.closest( '.ugb-button-icon-control__edit' ) &&
					! ev.target.closest( '.components-color-picker' ) &&
					! ev.target.closest( '.react-autosuggest__suggestions-container' ) ) {
					setIsOpen( false )
				}
			}

			document.addEventListener( 'mousedown', handleOnClickOutside ) // eslint-disable-line @wordpress/no-global-event-listener
			return () => document.removeEventListener( 'mousedown', handleOnClickOutside ) // eslint-disable-line @wordpress/no-global-event-listener
		}
	}, [ isOpen ] )

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
				<Button
					onClick={ () => setIsOpen( isOpen => ! isOpen ) }
					className="ugb-button-icon-control__edit"
					label={ __( 'Edit', i18n ) }
					isSecondary
					icon="edit"
				/>
				{ isOpen && (
					<Popover
						className="ugb-button-icon-control__popover"
						focusOnMount="container"
					>
						<PanelBody>
							{ ( typeof props.popoverLabel !== 'undefined' ? props.popoverLabel : props.label ) &&
								<h2 className="components-panel__body-title">{ props.popoverLabel || props.label }</h2>
							}
							{ props.children }
						</PanelBody>
					</Popover>
				) }
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
