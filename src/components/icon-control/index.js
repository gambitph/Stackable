/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * Internal dependencies
 */
import SVGIconControl from './images/smile.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { omit } from 'lodash'
import {
	IconSearchPopover, SvgIcon, Button, BaseControl,
} from '~stackable/components'
import { Dropdown } from '@wordpress/components'

const popoverProps = {
	placement: 'left-start',
	offset: 36,
	shift: true,
}

const IconControl = props => {
	return (
		<BaseControl
			className="ugb-icon-control stk-control"
			{ ...omit( props, [ 'onChange', 'value' ] ) }
			allowReset={ true }
			value={ props.value }
			defaultValue={ props.defaultValue }
			onChange={ props.onChange }
			hasPanelModifiedIndicator={ props.hasPanelModifiedIndicator }
		>
			<div className="ugb-icon-control__wrapper">
				<div className="ugb-icon-control__button-wrapper">
					<Dropdown
						popoverProps={ popoverProps }
						renderToggle={ ( { onToggle, isOpen } ) => (
							<Button
								isSecondary
								onClick={ onToggle }
								className="ugb-icon-control__icon-button"
								aria-expanded={ isOpen }
							>
								{ props.value && <SvgIcon value={ props.value } /> }
								{ ! props.value && <SVGIconControl style={ { opacity: 0.3 } } /> }
							</Button>
						) }
						renderContent={ ( { onClose } ) => (
							<IconSearchPopover
								onClose={ onClose }
								returnSVGValue={ props.returnSVGValue }
								onChange={ props.onChange }
								defaultValue={ props.defaultValue }
							/>
						) }
					/>
				</div>
			</div>
		</BaseControl>
	)
}

IconControl.defaultProps = {
	label: __( 'Icon', i18n ),
	value: '',
	returnSVGValue: true, // If true, the value provided in onChange will be the SVG markup of the icon. If false, the value will be a prefix-iconName value.
	onChange: () => {},
	defaultValue: '',
	hasPanelModifiedIndicator: true,
}

export default IconControl
