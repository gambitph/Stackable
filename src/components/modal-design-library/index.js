/**
 * Internal deprendencies
 */
import { BlockDesigns, useBlockDesigns } from './block-designs/'
import { UIKits, useUIKits } from './ui-kits/'
import DesignLibraryModal from './design-library-modal'

/**
 * External deprendencies
 */
import { i18n } from 'stackable'

/**
 * WordPress deprendencies
 */
import { __ } from '@wordpress/i18n'
import { ButtonGroup, Button } from '@wordpress/components'
import { useState, useEffect } from '@wordpress/element'

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

	useEffect( () => {
		const input = document.querySelector( '.ugb-modal-design-library__cover-inner input' )
		if ( input ) {
			input.focus()
		}
	}, [ activeTab ] )

	return (
		<DesignLibraryModal
			className="ugb-modal-design-library"
			overlayClassName="ugb-modal-design-library__modal"
			title={ __( 'Stackable Design Library', i18n ) }
			onRequestClose={ props.onClose }
			headerContent={
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
			}
		>

			<div className="ugb-modal-design-library__wrapper">
				{ activeTab === 'block-designs' && <BlockDesigns { ...{ ...props, moduleProps: blockDesignsModuleProps } } /> }
				{ activeTab === 'ui-kits' && <UIKits { ...{ ...props, moduleProps: uiKitsModuleProps } } /> }
			</div>

		</DesignLibraryModal>
	)
}

ModalDesignLibrary.defaultProps = {
	search: '',
	onClose: () => {},
	selectedBlock: '',
}

export default ModalDesignLibrary
