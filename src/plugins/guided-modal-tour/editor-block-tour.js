
import { registerPlugin } from '@wordpress/plugins'
import { useEffect, useState } from '@wordpress/element'
import { GuidedModalTour } from '~stackable/components'

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

	return <>
		<GuidedModalTour tourId={ tourId } />
	</>
}

registerPlugin( 'stackable-editor-block-tour', {
	render: EditorBlockTour,
} )
