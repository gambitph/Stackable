import { name, settings } from '../'
import blockEditableAfterSaveTests from '@stackable/test/shared/block-editable-after-save'
import blockMigrationTests from '@stackable/test/shared/block-migration'
import deprecated from '../deprecated'
import save from '../save'

describe( `${ settings.title } block`, () => {
	// Override auto-generated attributes since < 3 columns will make #3 attributes blank.
	const attributes = {
		columns: 2,
		description3: '',
		linkText3: '',
		linkUrl3: '',
		newTab3: false,
		title3: '',
	}

	// Checks whether adding the block, saving it then refreshing the editor renders the block valid & editable.
	// Checks whether adding the block, changing values, saving it then refreshing the editor renders the block valid & editable.
	blockEditableAfterSaveTests.bind( this )( {
		name,
		settings,
		save,
		deprecated,
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
