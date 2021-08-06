/**
 * Internal dependencies
 */
import './context'
import { addAttributes } from './attributes'
import { Edit } from './edit'

export const Context = () => {
	return null
}

export * from './hooks'

Context.addAttributes = addAttributes

Context.InspectorControls = Edit
