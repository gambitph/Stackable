import { applyFormat, registerFormatType, removeFormat } from '@wordpress/rich-text'
import { RichTextShortcut, RichTextToolbarButton } from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { ColorPaletteControl } from '@stackable/components'
import Dropdown from './dropdown'
import { Fragment } from '@wordpress/element'
import { i18n } from 'stackable'
import { ToggleControl } from '@wordpress/components'
import { whiteIfDarkBlackIfLight } from '@stackable/util'

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
	const { activeAttributes, isActive, onChange, value } = props

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
		<Dropdown
			focusOnMount={ false }
			renderToggle={ ( { onToggle } ) => {
				return (
					<Fragment>
						<RichTextShortcut
							type="primary"
							character="h"
							onUse={ onToggle }
						/>
						<RichTextToolbarButton
							icon="editor-textcolor"
							title={ __( 'Highlight Text', i18n ) }
							onClick={ onToggle }
							isActive={ isActive }
						/>
					</Fragment>
				)
			} }
			renderContent={ () => (
				<Fragment>
					<div className="components-stackable-highlight__inner">
						<ColorPaletteControl
							label={ __( 'Highlight Color', i18n ) }
							value={ currentColor }
							onChange={ color => {
								onChange( createApplyFormat( value, color !== currentColor ? color : '', hasBgHighlight ) )
							} }
						/>
						<ToggleControl
							label={ __( 'Background Highlight', i18n ) }
							checked={ hasBgHighlight }
							onChange={ hasBgHighlight => {
								onChange( createApplyFormat( value, currentColor ? currentColor : '#8c33da', hasBgHighlight ) )
							} }
						/>
					</div>
				</Fragment>
			) }
		/>
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
