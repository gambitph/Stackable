import { doAction } from '@wordpress/hooks'

let currentElement = null
const mouseoverListeners = {}
const mouseoutListeners = {}
const onHover = ( selector, hoverCallback = () => {}, hoverOutCallback = () => {} ) => {
	mouseoverListeners[ selector ] = ev => {
		const matchingElement = ev.target.closest( selector )
		if ( matchingElement && currentElement !== matchingElement ) {
			currentElement = matchingElement
			hoverCallback( matchingElement )
		}
	}
	mouseoutListeners[ selector ] = ev => {
		const matchingElement = ev.target.closest( selector )
		if ( ev.relatedTarget && matchingElement === ev.relatedTarget.closest( selector ) ) {
			return
		}
		if ( matchingElement && currentElement === matchingElement ) {
			hoverOutCallback( currentElement )
			currentElement = null
		}
	}
	document.body.addEventListener( 'mouseover', mouseoverListeners[ selector ] )
	document.body.addEventListener( 'mouseout', mouseoutListeners[ selector ] )
}

const removeOnHover = selector => {
	document.body.removeEventListener( 'mouseover', mouseoverListeners[ selector ] )
	document.body.removeEventListener( 'mouseout', mouseoutListeners[ selector ] )
}

const clickListeners = {}
const onClick = ( selector, callback = () => {} ) => {
	clickListeners[ selector ] = ev => {
		const matchingElement = ev.target.closest( selector )
		if ( matchingElement ) {
			callback( matchingElement )
		}
	}
	document.body.addEventListener( 'click', clickListeners[ selector ] )
}

const removeOnClick = selector => {
	document.body.removeEventListener( 'click', clickListeners[ selector ] )
}

export const getParentControl = el => el.closest( '[class*="ugb--help-tip-"]' )

export const startListening = () => {
	// If hovered long enough on a control label, show the tooltip.
	onHover(
		[
			'[class*="ugb--help-tip-"].components-base-control .components-base-control__label',
			'[class*="ugb--help-tip-"].components-base-control .components-toggle-control__label',
			'[class*="ugb--help-tip-"].components-panel__body .components-panel__body-toggle',
		].join( ', ' ),
		el => doAction( 'stackable.help-video.control.hover.in', el, getParentControl( el ) ),
		() => doAction( 'stackable.help-video.control.hover.out' ),
	)

	// When a control label is clicked, show the tooltip.
	onClick(
		[
			'[class*="ugb--help-tip-"].components-base-control .components-base-control__label',
			'[class*="ugb--help-tip-"].components-base-control .components-toggle-control__label',
		].join( ', ' ),
		el => doAction( 'stackable.help-video.control.click', el, getParentControl( el ) )
	)
}

export const stopListening = () => {
	removeOnHover( [
		'[class*="ugb--help-tip-"].components-base-control .components-base-control__label',
		'[class*="ugb--help-tip-"].components-base-control .components-toggle-control__label',
		'[class*="ugb--help-tip-"].components-panel__body .components-panel__body-toggle',
	].join( ', ' ) )
	removeOnClick( [
		'[class*="ugb--help-tip-"].components-base-control .components-base-control__label',
		'[class*="ugb--help-tip-"].components-base-control .components-toggle-control__label',
	].join( ', ' ) )
}
