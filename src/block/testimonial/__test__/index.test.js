/**
 * External dependencies
 */
import {
	blockEditableAfterSaveTests, blockMigrationTests, blockSaveSnapshotTests,
} from '~stackable/test/shared'

/**
 * Internal dependencies
 */
import { name, settings } from '../'
import deprecated from '../deprecated'
import save from '../save'

describe( `${ settings.title } block`, () => {
	const defaultAttributes = {
		columns: 2,
		name3: '',
		position3: '',
		testimonial3: '',
	}

	const attributes = {
		columns: 1,
		name2: '',
		name3: '',
		position2: '',
		position3: '',
		testimonial2: '',
		testimonial3: '',
	}

	// Checks whether the save method has changed. This shouldn't change in the normal
	// course of things. This should only change when the block receives an update.
	// When the block gets an update, a new deprecation step should be added,
	// and the snapshot updated.
	blockSaveSnapshotTests.bind( this )( {
		name,
		settings,
		save,
		deprecated,
	} )

	// Checks whether adding the block, saving it then refreshing the editor renders the block valid & editable.
	// Checks whether adding the block, changing values, saving it then refreshing the editor renders the block valid & editable.
	blockEditableAfterSaveTests.bind( this )( {
		name,
		settings,
		save,
		deprecated,
		defaultAttributes,
		attributes,
	} )

	// Checks whether saved HTML of older versioned blocks would migrate and remain valid & editable.
	// Checks whether saved HTML of older versioned blocks with changed values, would migrate and remain valid & editable.
	describe( 'Deprecated migration', () => {
		blockMigrationTests.bind( this )( {
			name,
			settings,
			save,
			deprecated,
		} )
	} )
} )
