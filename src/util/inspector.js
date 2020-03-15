import { supportsBlockCollections } from './collections'

export const supportsInspectorPositionSticky = () => {
	return supportsBlockCollections()
}
