import { name, settings } from '../'
import blockEditableAfterSaveTests from '@stackable/test/shared/block-editable-after-save'
import blockMigrationTests from '@stackable/test/shared/block-migration'
import deprecated from '../deprecated'
import save from '../save'

describe( `${ settings.title } block`, () => {
	const defaultAttributes = {
		columns: 2,
		description3: '',
		name3: '',
		position3: '',
		mediaURL3: '',
	}

	const attributes = {
		columns: 1,
		description2: '',
		description3: '',
		name2: '',
		name3: '',
		position2: '',
		position3: '',
		mediaURL2: '',
		mediaURL3: '',
	}

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
