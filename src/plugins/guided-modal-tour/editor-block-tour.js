
import { registerPlugin } from '@wordpress/plugins'
import { GuidedModalTour } from '~stackable/components'

const EditorBlockTour = () => {
	return <GuidedModalTour tourId="blocks" />
}

registerPlugin( 'stackable-editor-block-tour', {
	render: EditorBlockTour,
} )
