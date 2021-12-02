/**
 * Internal dependencies
 */
import { addAttributes } from './attributes'
import { LinkControls } from '../helpers/link'
import { Edit } from './edit'

/*+
 * External dependencies
 */
import { Link as LinkComponent } from '~stackable/components'
import { useBlockContext, useAttributeEditHandlers } from '~stackable/hooks'
import { isElementDescendant } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useRef, useState, useEffect, useCallback,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'
import { applyFilters } from '@wordpress/hooks'

export const Link = props => {
	const [ isOpen, setIsOpen ] = useState( false )
	const popoverEl = useRef()
	const [ popoverRef, setPopoverRef ] = useState( null )
	const { parentBlock } = useBlockContext()
	const { getAttribute } = useAttributeEditHandlers()

	// Enable editing of the icon only when the current block that implements
	// it is selected. We need to use setTimeout since the isSelected is
	// changed earlier.
	const { isSelected } = useBlockEditContext()
	const [ debouncedIsSelected, setDebouncedIsSelected ] = useState( false )
	useEffect( () => {
		if ( ! isSelected ) {
			setDebouncedIsSelected( false )
			return
		}
		const t = setTimeout( () => {
			if ( isSelected ) {
				setDebouncedIsSelected( isSelected )
			}
		}, 1 )
		return () => clearTimeout( t )
	}, [ isSelected ] )

	// If the block is unselected, make sure that the opopver is closed.
	useEffect( () => {
		if ( ! isSelected && isOpen ) {
			setIsOpen( false )
		}
	}, [ isSelected, isOpen ] )

	const clickOutsideListener = useCallback( event => {
		if ( isOpen ) {
			// If the button text is clicked, don't re-open the popover, just close it.
			if ( event.target.closest( '.stk-button' ) && event.target.closest( props.linkTrigger || '.rich-text' ) ) {
				event.stopPropagation()
			}
			if ( ! isElementDescendant( popoverEl.curent, event.target ) && ! event.target.closest( '.components-popover' ) ) {
				setIsOpen( false )
			}
		}
	}, [ popoverEl.current, isOpen ] )

	// Assign the outside click listener.
	useEffect( () => {
		document.body.addEventListener( 'click', clickOutsideListener )
		return () => {
			document.body.removeEventListener( 'click', clickOutsideListener )
		}
	}, [ clickOutsideListener ] )

	// Allow parent blocks to prevent the link popup to open.
	const enable = applyFilters( 'stackable.edit.link.enable-link-popup', true, parentBlock )

	if ( ! getAttribute( 'linkHasLink' ) ) {
		return props.children
	}

	return (
		<Fragment>
			<LinkComponent
				{ ...props.linkProps }
				ref={ popoverEl }
				className={ props.className }
				onClick={ e => {
					if ( debouncedIsSelected ) {
						const ref = e.target.closest( props.linkTrigger || '.rich-text' )
						if ( ref && ! isOpen ) {
							// Only trigger the setIsOpen when the rich text is selected.
							setPopoverRef( ref )
							setIsOpen( ! isOpen )
						}
					}
				} }
			>
				{ props.children }
			</LinkComponent>
			{ isOpen && enable && (
				<Popover
					position="top center"
					getAnchorRect={ () => {
						return popoverRef?.getBoundingClientRect() || popoverEl.current?.getBoundingClientRect()
					} }
					focusOnMount={ false }
					className="stk-link__popover"
				>
					<LinkControls
						attrNameTemplate="link%s"
					/>
				</Popover>
			) }
		</Fragment>
	)
}

Link.defaultProps = {
	className: '',
	linkProps: {},
}

Link.Content = props => {
	const {
		linkProps = {},
		attributes,
	} = props

	if ( ! attributes.linkHasLink ) {
		return props.children
	}

	return (
		<LinkComponent.Content
			{ ...linkProps }
			className={ props.className }
			href={ attributes.linkUrl || undefined }
			target={ attributes.linkNewTab ? '_blank' : undefined }
			rel={ attributes.linkRel || undefined }
			title={ attributes.linkTitle || undefined }
		>
			{ props.children }
		</LinkComponent.Content>
	)
}

Link.InspectorControls = Edit

Link.addAttributes = addAttributes

