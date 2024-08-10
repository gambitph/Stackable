import { setDefaultBlockName } from '@wordpress/blocks'

export const TextDefaultBlock = () => {
	// Set the default block to stackable/text
	setDefaultBlockName( 'stackable/text' )

	return null
}
