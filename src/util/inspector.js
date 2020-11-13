import { supportsBlockCollections } from './collections'

export const supportsInspectorPositionSticky = () => {
	return supportsBlockCollections()
}

export const generatePanelProps = ( title, styleOpenedPanelTitle ) => ( {
	title,
	initialOpen: styleOpenedPanelTitle === title,
} )
