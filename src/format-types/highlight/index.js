/**
 * External dependencies
 */
import {
	ColorPaletteControl, AdvancedToolbarControl, Button,
} from '~stackable/components'
import { whiteIfDarkBlackIfLight } from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	Toolbar, Popover,
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

// Apply the proper styles for the different text highlights.
const createApplyFormat = ( textValue, colorType, textColor, highlightColor ) => {
	// Normal text color
	if ( colorType === '' ) {
		if ( ! textColor ) {
			return removeFormat(
				textValue,
				'ugb/highlight',
			)
		}

		return applyFormat(
			textValue,
			{
				type: 'ugb/highlight',
				attributes: {
					style: `color: ${ textColor };`,
				},
			}
		)
	}

	// Highlight.
	if ( colorType === 'highlight' ) {
		return applyFormat(
			textValue,
			{
				type: 'ugb/highlight',
				attributes: {
					style: ( textColor ? `color: ${ textColor };` : '' ) +
						( highlightColor ? `background-color: ${ highlightColor }` : '' ),
				},
			}
		)
	}

	// Low Highlight.
	return applyFormat(
		textValue,
		{
			type: 'ugb/highlight',
			attributes: {
				style: ( textColor ? `color: ${ textColor };` : '' ) +
					( highlightColor ? `background: linear-gradient(to bottom, transparent 50%, ${ highlightColor } 50%)` : '' ),
			},
		}
	)
}

// Extracts the color and color type of the highlight.
export const extractColors = styleString => {
	let textColor = ''
	let highlightColor = ''
	let colorType = ''

	// Detect the current colors based on the styles applied on the text.
	if ( styleString.match( /linear-gradient\(/ ) ) {
		colorType = 'low'
		// Color is of the format: linear-gradient(to bottom, transparent 50%, #123456 50%)
		const color = styleString.match( /linear-gradient\(\s*to bottom\s*,\s*transparent \d+%\s*,\s*(.*?)\s\d+%\)/ )
		if ( color ) {
			highlightColor = color[ 1 ]
		}
	} else if ( styleString.match( /background-color:/ ) ) {
		colorType = 'highlight'
		// Color is of the format: background-color: #12345
		const color = styleString.match( /background-color:\s*([^;]*)?/ )
		if ( color ) {
			highlightColor = color[ 1 ]
		}
	}

	// Get the text color.
	const color = styleString.match( /(^|[^-])color:\s*([^;]*)?/ )
	if ( color ) {
		textColor = color[ 2 ]
	}

	return {
		textColor,
		highlightColor,
		colorType,
	}
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

	// Detect the current colors based on the styles applied on the text.
	const {
		textColor = '',
		highlightColor = '',
		colorType = '',
	} = isActive ? extractColors( activeAttributes.style ) : {}

	// If highlighted, show the highlight color, otherwise show the text color.
	const displayIconColor = ( colorType !== '' ? highlightColor : textColor ) || textColor

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
					<span className="components-stackable-highlight-color__indicator" style={ { backgroundColor: displayIconColor } } />
				</Button>
				{ isOpen &&
				<Popover
					position="bottom center"
					className="components-stackable-highlight__popover"
					focusOnMount="container"
					useRef={ popoverEl }
					isAlternate
				>
					<div className="components-stackable-highlight__inner">
						<AdvancedToolbarControl
							controls={ [
								{
									value: '',
									title: __( 'Normal', i18n ),
								},
								{
									value: 'highlight',
									title: __( 'Highlight', i18n ),
								},
								{
									value: 'low',
									title: __( 'Low', i18n ),
								},
							] }
							value={ colorType }
							onChange={ colorType => {
								// Pick default colors for when the highlight type changes.
								const defaultHighlightColor = highlightColor ? highlightColor :
									colorType !== '' ? ( textColor || '#f34957' ) : highlightColor
								const defaultTextColor = colorType === 'highlight' ? whiteIfDarkBlackIfLight( '', defaultHighlightColor ) :
									colorType === 'low' ? '' :
										highlightColor || textColor || ''

								onChange( createApplyFormat( value, colorType, defaultTextColor, defaultHighlightColor ), { withoutHistory: true } )
							} }
							isSmall
						/>
						<div className="ugb-highlight-format__color-picker">
							<ColorPaletteControl
								label={ __( 'Text Color', i18n ) }
								value={ textColor }
								onChange={ textColor => {
									onChange( createApplyFormat( value, colorType, textColor, highlightColor ), { withoutHistory: true } )
								} }
							/>
						</div>
						{ colorType !== '' &&
							<div className="ugb-highlight-format__color-picker">
								<ColorPaletteControl
									label={ __( 'Highlight Color', i18n ) }
									value={ highlightColor }
									onChange={ highlightColor => {
										onChange( createApplyFormat( value, colorType, textColor, highlightColor ), { withoutHistory: true } )
									} }
								/>
							</div>
						}
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
