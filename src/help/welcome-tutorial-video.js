/**
 * External dependencies
 */
import { ModalWelcomeTutorial } from '~stackable/components'

/**
 * WordPress dependencies
 */
import {
	Fragment, useEffect, useState,
} from '@wordpress/element'
import apiFetch from '@wordpress/api-fetch'
import { createHigherOrderComponent } from '@wordpress/compose'

// When the modal was closed, don't let it open again.
// Need this here to make it affect across all blocks.
let wasShown = false

const withWelcomeTutorialModal = createHigherOrderComponent( BlockEdit => {
	return props => {
		const { isSelected, name } = props
		const [ isOpen, setOpen ] = useState( false )
		const [ openTimeout, setOpenTimeout ] = useState( null )

		// Close method.
		const closeModal = () => {
			// Hide the modal.
			setOpen( false )

			// Save the option to not show the video again.
			apiFetch( {
				path: `/wp/v2/stk_welcome_video_closed`,
				method: 'POST',
			} )
		}

		useEffect( () => {
			// If the block is selected, and the video hasn't been shown yet, show it after a short delay.
			if ( isSelected && name.match( /^ugb\// ) && ! isOpen && ! wasShown ) {
				setOpenTimeout( setTimeout( () => {
					if ( ! wasShown ) {
						wasShown = true
						setOpenTimeout( null )
						setOpen( true )
					}
				}, 1000 ) )
			}

			// Cleanup function.
			return function cleanup() {
				if ( openTimeout ) {
					clearTimeout( openTimeout )
				}
			}
		}, [ isOpen, isSelected ] )

		return (
			<Fragment>
				<BlockEdit { ...props } />
				{ isOpen &&
					<ModalWelcomeTutorial
						onRequestClose={ closeModal }
					/>
				}
			</Fragment>
		)
	}
}, 'withWelcomeTutorialModal' )

export default withWelcomeTutorialModal
