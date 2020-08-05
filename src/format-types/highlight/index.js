/**
 * External dependencies
 */
import { ColorPaletteControl } from '~stackable/components'
import { whiteIfDarkBlackIfLight } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	Button, ToggleControl, Toolbar, Popover,
} from '@wordpress/components'
import {
	applyFormat, registerFormatType, removeFormat,
} from '@wordpress/rich-text'
import { BlockControls } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import {
	useState, useEffect, useRef, useCallback,
} from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import { dispatch, select } from '@wordpress/data'

const createApplyFormat = ( textValue, color, hasBgHighlight ) => {
	if ( ! color ) {
		return removeFormat(
			textValue,
			'ugb/highlight',
		)
	}

	if ( ! hasBgHighlight ) {
		return applyFormat(
			textValue,
			{
				type: 'ugb/highlight',
				attributes: {
					style: `color: ${ color };`,
				},
			}
		)
	}

	return applyFormat(
		textValue,
		{
			type: 'ugb/highlight',
			attributes: {
				style: `color: ${ whiteIfDarkBlackIfLight( '', color ) }; background-color: ${ color };`,
			},
		}
	)
}

const HighlightButton = props => {
	const [ isOpen, setIsOpen ] = useState( false )
	const popoverEl = useRef( null )

	// Close the window if the user clicks outside.
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

	const {
		activeAttributes,
		isActive,
		onChange,
		value,
	} = props

	let currentColor = ''
	let hasBgHighlight = false
	if ( isActive ) {
		const bgColor = activeAttributes.style.match( /background-color:\s*([#\d\w]+)/ )
		if ( bgColor ) {
			hasBgHighlight = true
			currentColor = bgColor[ 1 ]
		} else {
			const color = activeAttributes.style.match( /color:\s*([#\d\w]+)/ )
			if ( color ) {
				currentColor = color[ 1 ]
			}
		}
	}

	return (
		<BlockControls>
			<Toolbar className="stackable-components-toolbar">
				<Button
					className="components-button components-icon-button components-toolbar__control"
					icon="editor-textcolor"
					aria-haspopup="true"
					tooltip={ __( 'Color & Highlight', i18n ) }
					onClick={ () => setIsOpen( ! isOpen ) }
				>
					<span className="components-stackable-highlight-color__indicator" style={ { backgroundColor: currentColor } } />
				</Button>
				{ isOpen &&
				<Popover
					position="bottom center"
					className="components-stackable-highlight__popover"
					focusOnMount="container"
					useRef={ popoverEl }
				>
					<div className="components-stackable-highlight__inner">
						<div className="ugb-highlight-format__color-picker">
							<ColorPaletteControl
								label={ __( 'Text Color', i18n ) }
								value={ currentColor }
								onChange={ color => {
									onChange( createApplyFormat( value, color, hasBgHighlight ), { withoutHistory: true } )
								} }
							/>
						</div>
						<ToggleControl
							label={ __( 'Highlight Text', i18n ) }
							checked={ hasBgHighlight }
							onChange={ hasBgHighlight => {
								onChange( createApplyFormat( value, currentColor ? currentColor : '#8c33da', hasBgHighlight ) )
							} }
						/>
					</div>
				</Popover>
				}
			</Toolbar>
		</BlockControls>
	)
}

registerFormatType(
	'ugb/highlight', {
		title: __( 'Highlight Text', i18n ),
		tagName: 'span',
		className: 'ugb-highlight',
		edit: HighlightButton,
		attributes: {
			style: 'style',
		},
	}
)

domReady( () => {
	// Turn off EditorsKit features to prevent duplicates.
	if ( ! select( 'core/edit-post' ).isFeatureActive( 'disableEditorsKitColorsFormats' ) ) {
		dispatch( 'core/edit-post' ).toggleFeature( 'disableEditorsKitColorsFormats' )
	}
	if ( ! select( 'core/edit-post' ).isFeatureActive( 'disableEditorsKitHighlightFormats' ) ) {
		dispatch( 'core/edit-post' ).toggleFeature( 'disableEditorsKitHighlightFormats' )
	}
} )
