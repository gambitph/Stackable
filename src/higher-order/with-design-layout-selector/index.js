/**
 * Higher-order component for displaying layout design selector when adding a new Stackable block.
 *
 * Used in BLOCK_NAME/edit.js.
 */

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
} from '@wordpress/hooks'
import {
	useSelect,
} from '@wordpress/data'

/**
 * Internal dependencies
 */
import DesignLayoutSelector from './design-layout-selector'

// When block is listed, it should not open the selector initially.
const blocksShouldNotOpenSelectorInitially = [
	'ugb/column', // When adding a column block, don't show the layout/design selector initially.
]

const withDesignLayoutSelector = createHigherOrderComponent(
	WrappedComponent => {
		const NewComponent = props => {
			const name = props.name.split( '/' )[ 1 ]

			const [ isOpen, setIsOpen ] = useState( false )
			const [ isNewlyAddedBlock, setIsNewlyAddedBlock ] = useState( false )

			const { isExistingBlock, isSelectedBlock } = useSelect( select => ( {
				isExistingBlock: select( 'stackable/util' ).getInitialBlockClientId( props.clientId ),
				isSelectedBlock: select( 'core/block-editor' ).getSelectedBlockClientId(),
			} ) )

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
				} else {
					setIsOpen( false )
					setIsNewlyAddedBlock( false )
				}
			}, [ isExistingBlock ] )

			if ( ! isOpen ) {
				return <WrappedComponent { ...props } />
			}

			const layouts = applyFilters( `stackable.${ name }.edit.layouts`, [] ).map( layout => ( { ...layout, plan: layout.premium ? 'premium' : 'free' } ) )

			const passedProps = {
				...props,
				name,
				layouts,
				isNewlyAddedBlock,
				isSelectedBlock,
			}

			return <DesignLayoutSelector { ...passedProps } />
		}

		NewComponent.defaultProps = {
			...( WrappedComponent.defaultProps || {} ),
			name: '',
			attributes: {},
		}

		return NewComponent
	},
	'withDesignLayoutSelector'
)

export default withDesignLayoutSelector

