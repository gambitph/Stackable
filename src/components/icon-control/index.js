/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { BaseControl, Button } from '@wordpress/components'
import { withInstanceId, withState } from '@wordpress/compose'
import SVGIconControl from './images/smile.svg'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import { omit } from 'lodash'
import { IconSearchPopover, SvgIcon } from '~stackable/components'
import { faGetSVGIcon } from '~stackable/util'

const IconControl = withInstanceId( withState( {
	openPopover: false,
	clickedOnButton: false,
} )( props => {
	const {
		instanceId,
		openPopover,
		clickedOnButton,
		setState,
	} = props

	return (
		<BaseControl
			className={ `ugb-icon-control ugb-icon-control-${ instanceId }` }
			{ ...omit( props, [ 'onChange', 'value' ] ) }
		>
			<div className="ugb-icon-control__wrapper">
				<div className="ugb-icon-control__button-wrapper">
					<Button
						isDefault
						className="ugb-icon-control__icon-button"
						onClick={ () => {
							if ( ! clickedOnButton ) {
								setState( { openPopover: true } )
							} else {
								// If the popup closed because this button was clicked (while the popup was open) ensure the popup is closed.
								// This is needed or else the popup will always open when spam clicking the button.
								setState( {
									openPopover: false,
									clickedOnButton: false,
								} )
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
										setState( { clickedOnButton: true } )
										return
									}
								}
								setState( {
									openPopover: false,
									clickedOnButton: false,
								} )
							} }
							onClose={ () => setState( { openPopover: false } ) }
							onChange={ ( iconValue, iconPrefix, iconName ) => {
								if ( props.valueType === 'svg' ) {
									props.onChange( faGetSVGIcon( iconPrefix, iconName ) )
								} else {
									props.onChange( iconValue )
								}
							} }
						/>
					}
				</div>
				<Button
					onClick={ () => {
						props.onChange( '' )
						setState( { openPopover: false } )
					} }
					isSmall
					isDefault
					className="components-range-control__reset"
				>
					{ __( 'Reset', i18n ) }
				</Button>
			</div>
		</BaseControl>
	)
} ) )

IconControl.defaultProps = {
	label: __( 'Icon', i18n ),
	value: '',
	valueType: 'iconName', // This can either be iconName or svg. If SVG, the value returned will be an svg.
	onChange: () => {},
}

export default IconControl
