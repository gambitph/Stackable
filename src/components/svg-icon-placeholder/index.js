/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components'
import { withInstanceId, withState } from '@wordpress/compose'

/**
 * External dependencies
 */
import { IconSearchPopover, SvgIcon } from '~stackable/components'

const SvgIconPlaceholder = withInstanceId( withState( {
	openPopover: false,
	clickedOnButton: false,
} )( props => {
	const {
		instanceId,
		openPopover,
		clickedOnButton,
		setState,
		isOpen,
	} = props

	return (
		<div className={ `ugb-svg-icon-placeholder ugb-svg-icon-placeholder-${ instanceId }` }>
			<Button
				className="ugb-svg-icon-placeholder__button"
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
				<SvgIcon
					className={ props.className }
					color={ props.color }
					style={ props.style }
					value={ props.value }
				/>
			</Button>
			{ ( ( isOpen !== null && isOpen ) || ( isOpen === null && openPopover ) ) &&
				<IconSearchPopover
					onClickOutside={ event => {
						// This statement checks whether the close was triggered by clicking on the button that opens this.
						// This is needed or else the popup will always open when spam clicking the button.
						if ( event.target ) {
							if ( event.target.closest( `.ugb-svg-icon-placeholder-${ instanceId }` ) ) {
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
					onChange={ props.onChange }
				/>
			}
		</div>
	)
} ) )

SvgIconPlaceholder.defaultProps = {
	isOpen: null,
	className: '',
	color: '',
	value: '',
	style: {},
	onChange: () => {},
}

export default SvgIconPlaceholder
