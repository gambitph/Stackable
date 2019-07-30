/**
 * By default, dropdown popups will close when something that's not
 * its child is clicked on. Popovers are located outside dropdowns and
 * will trigger the dropdown to close.
 *
 * e.g. The custom color picker in a color palette control will close
 */
import { Dropdown } from '@wordpress/components'

class DropdownPreventPopoverClickClose extends Dropdown {
	closeIfClickOutside( event ) {
		// If the target is a popover control, stop the dropdown from closing.
		if ( event.target.closest( '.components-popover' ) ) {
			return
		}

		// Normal close behavior.
		return super.closeIfClickOutside( event )
	}
}

export default DropdownPreventPopoverClickClose
