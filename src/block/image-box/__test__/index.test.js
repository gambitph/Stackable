import { blockEditableAfterSaveTests, blockMigrationTests, blockSaveSnapshotTests } from '@stackable/test/shared'
import { name, settings } from '../'
import deprecated from '../deprecated'
import save from '../save'

describe( `${ settings.title } block`, () => {
	const defaultAttributes = {
		description4: '',
		link4: '',
		newTab4: false,
		title4: '',
	}

	const attributes = {
		columns: 2,
		description3: '',
		description4: '',
		link3: '',
		link4: '',
		newTab3: false,
		newTab4: false,
		title3: '',
		title4: '',
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
			attributes,
		} )
	} )
} )
