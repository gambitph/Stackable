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

/**
 * WordPress dependencies
 */
import { Popover } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	Fragment, useRef, useState, useEffect, useCallback,
} from '@wordpress/element'

export const Link = props => {
	const [ isOpen, setIsOpen ] = useState( false )
	const popoverEl = useRef( null )

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

	return (
		<Fragment>
			<LinkComponent
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
			{ isOpen && (
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

Link.Content = props => {
	const {
		attributes,
	} = props

	return (
		<LinkComponent.Content
			className={ props.className }
			href={ attributes.linkUrl || undefined }
			target={ attributes.linkNewTab ? '_blank' : undefined }
			rel={ attributes.linkRel || undefined }
			aria-hidden="true"
			tabindex="-1"
		>
			{ props.children }
		</LinkComponent.Content>
	)
}

Link.InspectorControls = Edit

Link.addAttributes = addAttributes

