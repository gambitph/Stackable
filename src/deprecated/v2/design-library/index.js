import { addFilter } from '@wordpress/hooks'
import ModalDesignLibrary from '../components/modal-design-library'

// Add v2 in the design library modal. This enables the design library switch.
addFilter( 'stackable.design-library.versions', 'stackable/v2', versions => {
	versions.push( 'v2' )
	return versions
} )

// Load the v2 design library when switched to.
addFilter( 'stackable.design-library.modal-component', 'stackable/v2', ( component, version ) => {
	return version === 'v2' ? ModalDesignLibrary : component
} )
