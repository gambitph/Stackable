/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useInstanceId } from '@wordpress/compose'
import { useState } from '@wordpress/element'

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

const IconControl = props => {
	const [ openPopover, setOpenPopover ] = useState( false )
	const [ clickedOnButton, setClickedOnButton ] = useState( false )

	const instanceId = useInstanceId( IconControl, 'iconControl' )

	return (
		<BaseControl
			className={ `ugb-icon-control ugb-icon-control-${ instanceId }` }
			{ ...omit( props, [ 'onChange', 'value' ] ) }
			allowReset={ true }
			value={ props.value }
			onChange={ props.onChange }
		>
			<div className="ugb-icon-control__wrapper">
				<div className="ugb-icon-control__button-wrapper">
					<Button
						isSecondary
						className="ugb-icon-control__icon-button"
						onClick={ () => {
							if ( ! clickedOnButton ) {
								setOpenPopover( true )
							} else {
								// If the popup closed because this button was clicked (while the popup was open) ensure the popup is closed.
								// This is needed or else the popup will always open when spam clicking the button.
								setOpenPopover( false )
								setClickedOnButton( false )
							}
						} }
					>
						{ props.value && <SvgIcon value={ props.value } /> }
						{ ! props.value && <SVGIconControl style={ { opacity: 0.3 } } /> }
					</Button>
					{ openPopover &&
						<IconSearchPopover
							onClickOutside={ event => {
								// This statement checks whether the close was triggered by clicking on the button that opens this.
								// This is needed or else the popup will always open when spam clicking the button.
								if ( event.target ) {
									if ( event.target.closest( `.ugb-icon-control-${ instanceId }` ) ) {
										setClickedOnButton( true )
										return
									}
								}

								setOpenPopover( false )
								setClickedOnButton( false )
							} }
							onClose={ () => setOpenPopover( false ) }
							returnSVGValue={ props.returnSVGValue }
							onChange={ props.onChange }
						/>
					}
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
}

export default IconControl
