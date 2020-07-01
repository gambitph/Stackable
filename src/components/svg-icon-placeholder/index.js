/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components'
import { withInstanceId } from '@wordpress/compose'
import { useState } from '@wordpress/element'

/**
 * External dependencies
 */
import { IconSearchPopover, SvgIconHelper } from '~stackable/components'

const SvgIconPlaceholder = withInstanceId( ( props => {
	const [ openPopover, setOpenPopover ] = useState( false )
	const [ clickedOnButton, setClickedOnButton ] = useState( false )

	const {
		instanceId,
		isOpen,
		onChange,
		...propsToPass
	} = props

	return (
		<div className={ `ugb-svg-icon-placeholder ugb-svg-icon-placeholder-${ instanceId }` }>
			<Button
				className="ugb-svg-icon-placeholder__button"
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
				<SvgIconHelper { ...propsToPass } />
			</Button>
			{ ( ( isOpen !== null && isOpen ) || ( isOpen === null && openPopover ) ) &&
				<IconSearchPopover
					onClickOutside={ event => {
						// This statement checks whether the close was triggered by clicking on the button that opens this.
						// This is needed or else the popup will always open when spam clicking the button.
						if ( event.target ) {
							if ( event.target.closest( `.ugb-svg-icon-placeholder-${ instanceId }` ) ) {
								setClickedOnButton( true )
								return
							}
						}
						setOpenPopover( false )
						setClickedOnButton( false )
					} }
					onClose={ () => setOpenPopover( false ) }
					onChange={ onChange }
				/>
			}
		</div>
	)
} ) )

SvgIconPlaceholder.defaultProps = {
	isOpen: null,
	className: '',
	value: '',
	onChange: () => {},
}

export default SvgIconPlaceholder
