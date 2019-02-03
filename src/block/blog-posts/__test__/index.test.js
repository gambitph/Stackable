import { name, settings } from '../'
import blockEditableAfterSaveTests from '@stackable/test/shared/block-editable-after-save'
import save from '../save'

describe( `${ settings.title } block`, () => {
	// Checks whether adding the block, saving it then refreshing the editor renders the block valid & editable.
	// Checks whether adding the block, changing values, saving it then refreshing the editor renders the block valid & editable.
	blockEditableAfterSaveTests.bind( this )( {
		name,
		settings,
		save,
	} )
} )
