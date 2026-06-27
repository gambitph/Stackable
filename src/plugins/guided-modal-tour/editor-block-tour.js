
import { registerPlugin } from '@wordpress/plugins'
import { useEffect, useState } from '@wordpress/element'
import { GuidedModalTour } from '~stackable/components'

// These tours render inside their own modal.
// Rendering the tours here creates duplicate tour modals and
// can close the owning modal unexpectedly.
const MODAL_OWNED_TOURS = [
	'design-library',
]

const EditorBlockTour = () => {
	const [ tourId, setTourId ] = useState( 'blocks' )
	useEffect( () => {
		// Check the GET parameter for the tour ID.
		const params = new URLSearchParams( window?.location?.search || '' )
		const _tourId = params.get( 'tour' )

		if ( _tourId !== 'blocks' ) {
			setTourId( _tourId )
		}
	}, [] )

	// Do not load if there is no tourId.
	if ( ! tourId || MODAL_OWNED_TOURS.includes( tourId ) ) {
		return null
	}

	return <>
		<GuidedModalTour tourId={ tourId } />
	</>
}

registerPlugin( 'stackable-editor-block-tour', {
	render: EditorBlockTour,
} )
