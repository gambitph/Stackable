/**
 * External dependencies
 */
import {
	ColorPaletteControl, AdvancedToolbarControl, Popover,
} from '~stackable/components'
import { whiteIfDarkBlackIfLight } from '~stackable/util'
import { i18n, settings } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components'
import {
	applyFormat, registerFormatType, removeFormat,
} from '@wordpress/rich-text'
import { BlockControls, useBlockEditContext } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'
import domReady from '@wordpress/dom-ready'
import {
	dispatch, select, useSelect,
} from '@wordpress/data'

// Apply the proper styles for the different text highlights.
const createApplyFormat = ( _textValue, colorType, textColor, highlightColor ) => {
	// Backward compatibility with the old named format.
	const textValue = removeFormat( _textValue, 'ugb/highlight' )

	// Normal text color
	if ( colorType === '' ) {
		if ( ! textColor ) {
			return removeFormat(
				textValue,
				'stk/highlight',
			)
		}

		return applyFormat(
			textValue,
			{
				type: 'stk/highlight',
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
				type: 'stk/highlight',
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
			type: 'stk/highlight',
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

	if ( ! styleString ) { // Prevent block errors if stylestring is null or undefined
		return {
			textColor,
			highlightColor,
			colorType,
		}
	}

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
	const { clientId } = useBlockEditContext()
	const [ colorType, setColorType ] = useState( null )
	const [ isOpen, setIsOpen ] = useState( false )
	const { getBlock } = useSelect( 'core/block-editor' )

	const block = getBlock( clientId )

	const {
		activeAttributes,
		isActive: _isActive,
		onChange,
		value,
	} = props

	// Backward compatibility for ugb/highlight.
	let isActive = _isActive
	let highlightStyles = activeAttributes?.style

	if ( value ) {
		( value.activeFormats || [] ).some( format => {
			if ( format?.type === 'ugb/highlight' ) {
				highlightStyles = format?.attributes.style
				isActive = true
				return true
			}
			return false
		} )
	}

	// Detect the current colors based on the styles applied on the text.
	const {
		textColor = '',
		highlightColor = '',
	} = isActive ? extractColors( highlightStyles ) : {}
	// If highlighted, show the highlight color, otherwise show the text color.
	const displayIconColor = ( colorType !== '' ? highlightColor : textColor ) || textColor

	if ( block.name === 'stackable/button' ) {
		return null
	}

	return (
		<BlockControls>
			<ToolbarGroup className="stackable-components-toolbar">
				<ToolbarButton
					label={ __( 'Color & Highlight', i18n ) }
					className="components-toolbar__control stk-toolbar-button stk-components-toolbar__highlight"
					icon="editor-textcolor"
					aria-haspopup="true"
					tooltip={ __( 'Color & Highlight', i18n ) }
					onClick={ () => {
						if ( ! isOpen ) {
							const {
								colorType = '',
							} = isActive ? extractColors( highlightStyles ) : {}
							setColorType( colorType )
						}
						setIsOpen( ! isOpen )
					} }
					isActive={ isActive }
				>
					<span className="components-stackable-highlight-color__indicator" style={ { backgroundColor: displayIconColor } } />
				</ToolbarButton>
				{ isOpen && (
					<Popover
						offset={ 13 }
						position="bottom center"
						className="stk-copy-paste-styles__menu"
						isAlternate
						onFocusOutside={ () => setIsOpen( false ) }
						onEscape={ () => setIsOpen( false ) }
					>
						<div className="stk-color-palette-control__popover-content">
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
										const defaultHighlightColor = highlightColor ? highlightColor
											: colorType !== '' ? ( textColor || '#f34957' ) : highlightColor
										const defaultTextColor = colorType === 'highlight' ? whiteIfDarkBlackIfLight( '', defaultHighlightColor )
											: colorType === 'low' ? ''
												: highlightColor || textColor || ''

										onChange( createApplyFormat( value, colorType, defaultTextColor, defaultHighlightColor ), { withoutHistory: true } )
										setColorType( colorType )
									} }
									isSmall
								/>
								<div className="stk-highlight-format__color-picker">
									<ColorPaletteControl
										isExpanded
										label={ __( 'Text Color', i18n ) }
										value={ textColor }
										onChange={ textColor => {
											onChange( createApplyFormat( value, colorType, textColor, highlightColor ), { withoutHistory: true } )
										} }
									/>
								</div>
								{ colorType !== '' &&
									<div className="stk-highlight-format__color-picker">
										<ColorPaletteControl
											isExpanded
											label={ __( 'Highlight Color', i18n ) }
											value={ highlightColor }
											onChange={ highlightColor => {
												onChange( createApplyFormat( value, colorType, textColor, highlightColor ), { withoutHistory: true } )
											} }
										/>
									</div>
								}
							</div>
						</div>
					</Popover>
				) }
			</ToolbarGroup>
		</BlockControls>
	)
}

if ( settings.stackable_enable_text_highlight )	{
	registerFormatType(
		'stk/highlight', {
			title: __( 'Highlight Text', i18n ),
			tagName: 'span',
			className: 'stk-highlight',
			edit: HighlightButton,
			attributes: {
				style: 'style',
			},
		}
	)
}

// Backward compatibility, ugb/highlight, but this is not visible.
registerFormatType(
	'ugb/highlight', {
		title: __( 'Highlight Text', i18n ) + ' (v2)',
		tagName: 'span',
		className: 'ugb-highlight',
		attributes: {
			style: 'style',
		},
	}
)

domReady( () => {
	// Turn off EditorsKit features to prevent duplicates.
	if ( select( 'core/edit-post' ) ) {
		if ( ! select( 'core/edit-post' )?.isFeatureActive( 'disableEditorsKitColorsFormats' ) ) {
			dispatch( 'core/edit-post' ).toggleFeature( 'disableEditorsKitColorsFormats' )
		}
		if ( ! select( 'core/edit-post' )?.isFeatureActive( 'disableEditorsKitHighlightFormats' ) ) {
			dispatch( 'core/edit-post' ).toggleFeature( 'disableEditorsKitHighlightFormats' )
		}
	}
} )
