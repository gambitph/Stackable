/**
 * Internal deprendencies
 */
import BlockDesigns from './block-designs'
import UIKits from './ui-kits'

/**
 * External deprendencies
 */
import { i18n } from 'stackable'

/**
 * WordPress deprendencies
 */
import { __ } from '@wordpress/i18n'
import {
	ButtonGroup, Button, Modal,
} from '@wordpress/components'
import {
	Fragment, useState, useEffect,
} from '@wordpress/element'

// Used to remember last opened tab and UI Kit.
const cache = {
	uiKits: {},
	blockDesigns: {},
	hasSelectedUIKit: false,
}

const ModalDesignLibrary = props => {
	const [ activeTab, setActiveTab ] = useState( cache.hasSelectedUIKit ? 'ui-kits' : 'block-designs' )

	// Focus on the search bar.
	useEffect( () => {
		let isMounted = true

		setTimeout( () => {
			if ( isMounted ) {
				const input = document.querySelector( '.ugb-modal-design-library__cover-inner input' )
				if ( input ) {
					input.focus()
				}
			}
		}, 1 )

		return () => {
			isMounted = false
		}
	}, [ activeTab ] )

	return (
		<Modal
			className="ugb-modal-design-library"
			onRequestClose={ props.onClose }
			title={
				<Fragment>
					{ __( 'Stackable Design Library', i18n ) }
					<ButtonGroup className="ugb-modal-design-library__header-buttons">

						<Button
							className={ activeTab === 'block-designs' ? 'is-active' : undefined }
							onClick={ () => setActiveTab( 'block-designs' ) }
						>
							{ __( 'Block Designs', i18n ) }
						</Button>

						<Button
							className={ activeTab === 'ui-kits' ? 'is-active' : undefined }
							onClick={ () => setActiveTab( 'ui-kits' ) }
							disabled={ !! props.selectedBlock }
						>
							{ __( 'UI Kits', i18n ) }
							<span className="ugb-modal-design-library__tag">{ __( 'New', i18n ) }</span>
						</Button>

					</ButtonGroup>
				</Fragment>
			}
		>

			<div className="ugb-modal-design-library__wrapper">
				{ activeTab === 'block-designs' && <BlockDesigns { ...{
					...props, setActiveTab, cache,
				} } /> }
				{ activeTab === 'ui-kits' && <UIKits { ...{
					...props, setActiveTab, cache,
				} } /> }
			</div>

		</Modal>
	)
}

ModalDesignLibrary.defaultProps = {
	search: '',
	onClose: () => {},
	selectedBlock: '',
}

export default ModalDesignLibrary
