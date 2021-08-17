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
import { useBlockContext } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useRef, useState, useEffect, useCallback,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

export const Link = props => {
	const [ isOpen, setIsOpen ] = useState( false )
	const popoverEl = useRef( null )
	const { parentBlock } = useBlockContext()

	const clickOutsideListener = useCallback( event => {
		if ( isOpen ) {
			if ( ! event.target.closest( popoverEl.current ) && ! event.target.closest( '.components-popover' ) ) {
				setIsOpen( false )
			}
		}
	} )

	// Assign the outside click listener.
	useEffect( () => {
		document.body.addEventListener( 'click', clickOutsideListener )
		return () => document.body.removeEventListener( 'click', clickOutsideListener )
	}, [ clickOutsideListener ] )

	// Allow parent blocks to prevent the link popup to open.
	const enable = applyFilters( 'stackable.edit.link.enable-link-popup', true, parentBlock )

	return (
		<Fragment>
			<LinkComponent
				{ ...props.linkProps }
				className={ props.className }
				onClick={ e => {
					if ( e.target.closest( '.rich-text' ) ) {
						// Only trigger the setIsOpen when the rich text is selected.
						setIsOpen( ! isOpen )
					}
				} }
			>
				{ props.children }
			</LinkComponent>
			{ isOpen && enable && (
				<Popover
					useRef={ popoverEl }
					position="bottom center"
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

	return (
		<LinkComponent.Content
			{ ...linkProps }
			className={ props.className }
			href={ attributes.linkUrl || undefined }
			target={ attributes.linkNewTab ? '_blank' : undefined }
			rel={ attributes.linkRel || undefined }
		>
			{ props.children }
		</LinkComponent.Content>
	)
}

Link.InspectorControls = Edit

Link.addAttributes = addAttributes

