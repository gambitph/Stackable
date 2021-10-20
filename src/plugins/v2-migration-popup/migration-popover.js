/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	Modal, Button, Spinner,
} from '@wordpress/components'
import { useState } from '@wordpress/element'
import { __ } from '@wordpress/i18n'
import { models } from '@wordpress/api'

const MigrationModal = () => {
	const [ isOpen, setIsOpen ] = useState( true )
	const [ isBusy, setIsBusy ] = useState( false )

	if ( ! isOpen ) {
		return null
	}

	const save = ( settings, refresh = false ) => {
		setIsBusy( true )
		const model = new models.Settings( settings )
		model.save().then( () => {
			setIsBusy( false )
			setIsOpen( false )
			// Reload the page.
			if ( refresh ) {
				window.alert( __( 'The page will now reload for the old blocks to load. Please reload it if it does not refresh automatically.', i18n ) ) // eslint-disable-line no-alert
				window.location.href = window.location.href
			}
		} )
	}

	const onClickEnableSometimes = () => {
		save( {
			stackable_v2_editor_compatibility: '', // eslint-disable-line camelcase
			stackable_v2_editor_compatibility_usage: '1', // eslint-disable-line camelcase
			stackable_v2_frontend_compatibility: '1', // eslint-disable-line camelcase
		}, true ) // Refresh.
	}

	const onClickEnableAlways = () => {
		save( {
			stackable_v2_editor_compatibility: '1', // eslint-disable-line camelcase
			stackable_v2_editor_compatibility_usage: '', // eslint-disable-line camelcase
			stackable_v2_frontend_compatibility: '1', // eslint-disable-line camelcase
		}, true ) // Refresh.
	}

	const onClickNo = () => {
		save( {
			stackable_v2_block_detector_disabled: '1', // eslint-disable-line camelcase
		} )
	}

	return (
		<Modal
			className="stk-v2-migration-modal"
			title={ __( 'Stackable V2 Block Detected', i18n ) }
			shouldCloseOnClickOutside={ false }
			onRequestClose={ () => setIsOpen( false ) }
		>
			<p>{ __( 'Hello! 👋', i18n ) }</p>
			<p>{ __( 'We noticed that the page you are editing contains old Stackable version 2 blocks. Starting Stackable version 3, old v2 blocks are not anymore loaded in the editor. This means that you would not be able to edit the old v2 blocks in the editor and any old v2 block would show a block error in the editor.', i18n ) }</p>
			<p>{ __( 'Do you want to enable backward compatibility, so the old blocks will be loaded in the editor?', i18n ) }</p>
			<div className="stk-v2-migration-modal__button-wrapper">
				<Button
					className="button-primary"
					onClick={ onClickEnableSometimes }
				>
					{ __( 'Yes, load V2 Blocks in the editor, but only when V2 blocks are present already', i18n ) }
				</Button>
				<Button
					className="button-primary"
					onClick={ onClickEnableAlways }
				>
					{ __( 'Yes, always load V2 blocks in the editor', i18n ) }
				</Button>
				<Button
					className="button-link-delete"
					onClick={ onClickNo }
				>
					{ __( 'No, don\'t load V2 blocks in the editor', i18n ) }
				</Button>
			</div>
			{ isBusy && <Spinner /> }
		</Modal>
	)
}

export default MigrationModal
