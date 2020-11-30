/**
 * Internal deprendencies
 */
import { BlockDesigns, useBlockDesigns } from './block-designs/'
import { UIKits, useUIKits } from './ui-kits/'

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
const cache = {}

const ModalDesignLibrary = props => {
	const [ activeTab, _setActiveTab ] = useState( cache.activeTab || 'block-designs' )

	const setActiveTab = tab => {
		cache.activeTab = tab
		_setActiveTab( tab )
	}

	const uiKitsModuleProps = useUIKits( {
		...props, setActiveTab, cache,
	} )

	// Pass down UI Kit props to block designs. Mainly used for accessing UI kits.
	const blockDesignsModuleProps = useBlockDesigns( {
		...props, setActiveTab, uiKitsModuleProps,
	} )

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
							{ __( 'UI Kits', i18n ) }<span className="ugb-modal-design-library__tag">{ __( 'New', i18n ) }</span>
						</Button>

					</ButtonGroup>
				</Fragment>
			}
		>

			<div className="ugb-modal-design-library__wrapper">
				{ activeTab === 'block-designs' && <BlockDesigns { ...{ ...props, moduleProps: blockDesignsModuleProps } } /> }
				{ activeTab === 'ui-kits' && <UIKits { ...{ ...props, moduleProps: uiKitsModuleProps } } /> }
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
