
import { registerPlugin } from '@wordpress/plugins'
import GuidedModalTour from './index'

const EditorBlockTour = () => {
	return <GuidedModalTour tourId="blocks" />
}

registerPlugin( 'stackable-editor-block-tour', {
	render: EditorBlockTour,
} )
