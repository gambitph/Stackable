import { name, settings } from '../'
import blockEditableAfterSaveTests from '@stackable/test/shared/block-editable-after-save'
import blockSaveSnapshotTests from '@stackable/test/shared/block-save-snapshot'
import save from '../save'

describe( `${ settings.title } block`, () => {
	// Checks whether the save method has changed. This shouldn't change in the normal
	// course of things. This should only change when the block receives an update.
	// When the block gets an update, a new deprecation step should be added,
	// and the snapshot updated.
	blockSaveSnapshotTests.bind( this )( {
		name,
		settings,
		save,
	} )

	// Checks whether adding the block, saving it then refreshing the editor renders the block valid & editable.
	// Checks whether adding the block, changing values, saving it then refreshing the editor renders the block valid & editable.
	blockEditableAfterSaveTests.bind( this )( {
		name,
		settings,
		save,
	} )
} )
