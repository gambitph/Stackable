/**
 * Higher-order component for displaying layout design selector
 * when adding a new Stackable block.
 *
 * Used in BLOCK_NAME/edit.js.
 */

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Wordpress dependencies
 */
import { createHigherOrderComponent } from '@wordpress/compose'
import {
	useEffect, useState,
} from '@wordpress/element'
import {
	applyFilters,
	addAction,
	removeAction,
	doAction,
	hasFilter,
	addFilter,
	hasAction,
} from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'
import {
	Icon, Button, BaseControl,
} from '@wordpress/components'
import {
	useSelect, select,
} from '@wordpress/data'

/**
 * Internal dependencies
 */
import DesignLayoutSelector from './design-layout-selector'

// When block is listed, it should not open the selector initially.
const blocksShouldNotOpenSelectorInitially = [
	'ugb/column', // When adding a column block, don't show the layout/design selector initially.
]

// Filter used for adding a "Layout and Preset Designs" control inside inspector General tab.
if ( ! hasFilter( 'stackable.with-design-layout-selector.switch-design-panel', 'switch-design-layout' ) ) {
	addFilter( 'stackable.with-design-layout-selector.switch-design-panel', 'switch-design-layout', () => {
		const selectedBlockId = select( 'core/block-editor' ).getSelectedBlockClientId()
		const block = select( 'core/block-editor' ).getBlocksByClientId( selectedBlockId )

		return (
			<BaseControl>
				<h5 className="ugb-design-layout-selector__filter-title">{ __( 'Layouts and Preset Designs', i18n ) }</h5>
				<div className="ugb-design-layout-selector__filter-content">
					<Icon icon="info-outline" />
					<p>{ __( 'You may switch your layout or choose a preset design from our Design Library here.', i18n ) }</p>
				</div>
				{ block && hasAction( `stackable.design-layout-selector.${ selectedBlockId }` ) && (
					<div className="ugb-design-layout-selector__filter-button-group">
						<Button
							className="ugb-design-layout-selector__filter-button"
							onClick={ () => {
								doAction( `stackable.design-layout-selector.${ selectedBlockId }`, ( { isOpen: true } ) )
							} }
							isSecondary
							isLarge
						>
							{ __( 'Switch design/layout', i18n ) }
						</Button>
					</div>
				) }
			</BaseControl>
		)
	} )
}

const withDesignLayoutSelector = createHigherOrderComponent(
	WrappedComponent => {
		const NewComponent = props => {
			const [ isOpen, setIsOpen ] = useState( false )
			const name = props.name.split( '/' )[ 1 ]
			const layouts = applyFilters( `stackable.${ name }.edit.layouts`, [] )
			const { isExistingBlock, isSelectedBlock } = useSelect( select => ( {
				isExistingBlock: select( 'stackable/util' ).getInitialBlockClientId( props.clientId ),
				isSelectedBlock: select( 'core/block-editor' ).getSelectedBlockClientId(),
			} ) )
			const [ isNewlyAddedBlock, setIsNewlyAddedBlock ] = useState( false )

			useEffect( () => {
				// Allow control of isOpen and isNewlyAddedBlock from other sources by clientId.
				addAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle', ( { isOpen: newSetIsOpen, isNewlyAddedBlock: newIsNewlyAddedBlock } ) => {
					if ( newSetIsOpen !== undefined ) {
						setIsOpen( newSetIsOpen )
					}

					if ( newIsNewlyAddedBlock !== undefined ) {
						setIsNewlyAddedBlock( newIsNewlyAddedBlock )
					}
				} )

				return () => {
					removeAction( `stackable.design-layout-selector.${ props.clientId }`, 'toggle' )
				}
			}, [] )

			// Side effect for isExistingBlock.
			useEffect( () => {
			// When the editor recognizes that the block is newly added, show the selector.
				if ( isExistingBlock === null && blocksShouldNotOpenSelectorInitially.every( name => name !== props.name ) ) {
					setIsOpen( true )
					setIsNewlyAddedBlock( true )
				}
			}, [ isExistingBlock ] )

			if ( isOpen ) {
				return <DesignLayoutSelector { ...{
					...props, name, layouts, isNewlyAddedBlock, isSelectedBlock,
				} } />
			}
			return <WrappedComponent { ...props } />
		}

		NewComponent.defaultProps = {
			name: '',
			attributes: {},
		}

		return NewComponent
	},
	'withDesignLayoutSelector'
)

export default withDesignLayoutSelector

