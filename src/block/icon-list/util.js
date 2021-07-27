/**
 * External dependencies
 */
import { faGetSVGIcon } from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	Fragment,
} from '@wordpress/element'
import {
	BlockControls,
	RichTextShortcut,
} from '@wordpress/block-editor'
import {
	ToolbarButton,
} from '@wordpress/components'
/* eslint-disable @wordpress/no-unsafe-wp-apis */
import {
	__unstableCanIndentListItems as canIndentListItems,
	__unstableCanOutdentListItems as canOutdentListItems,
	__unstableIndentListItems as indentListItems,
	__unstableOutdentListItems as outdentListItems,
	__unstableChangeListType as changeListType,
	__unstableIsListRootSelected as isListRootSelected,
	__unstableIsActiveListType as isActiveListType,
} from '@wordpress/rich-text'
/* eslint-enable @wordpress/no-unsafe-wp-apis */
import {
	formatListBullets,
	formatListBulletsRTL,
	formatListNumbered,
	formatListNumberedRTL,
	formatIndent,
	formatIndentRTL,
	formatOutdent,
	formatOutdentRTL,
} from '@wordpress/icons'
import {
	__, _x, isRTL,
} from '@wordpress/i18n'

// The default icon list SVG.
export const DEFAULT_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 190"><polygon points="173.8,28.4 60.4,141.8 15.7,97.2 5.1,107.8 60.4,163 184.4,39 173.8,28.4"/></svg>'

/**
 * Create a DOM Element based on HTML string
 *
 * @param {string} htmlString
 *
 * @return {*} DOM Element
 */
const createElementFromHTMLString = htmlString => {
	const parentElement = document.createElement( 'div' )
	parentElement.innerHTML = htmlString

	return parentElement.firstElementChild
}

/**
 * Convert SVG tag to base64 string
 *
 * @param {string} svgTag
 * @param {string} color
 * @return {string} base64 string
 */
export const convertSVGStringToBase64 = ( svgTag = '', color = '' ) => {
	let svgTagString = svgTag

	// If no SVG given, use the default SVG.
	if ( ! svgTag ) {
		svgTagString = DEFAULT_SVG
	}

	if ( typeof svgTag === 'string' && svgTag.split( '-' ).length === 2 ) {
		const [ prefix, iconName ] = svgTag.split( '-' )
		svgTagString = faGetSVGIcon( prefix, iconName )
	}

	const svgEl = createElementFromHTMLString( svgTagString )
	if ( svgEl ) {
		const svgChildElements = svgEl.querySelectorAll( '*' )

		if ( color ) {
			let _color = color
			if ( color.match( /#([\d\w]{6})/g ) ) {
				_color = color.match( /#([\d\w]{6})/g )[ 0 ]
			} else if ( color.match( /var\((.*)?--[\w\d-_]+/g ) ) {
				const colorVariable = color.match( /--[\w\d-_]+/g )[ 0 ]
				try {
					// Try and get the actual value, this can possibly get an error due to stylesheet access security.
					_color = window.getComputedStyle( document.documentElement ).getPropertyValue( colorVariable ) || color
				} catch ( err ) {
					_color = color
				}
			}
			svgChildElements.forEach( child => {
				if ( child && ! [ 'DEFS', 'TITLE', 'DESC' ].includes( child.tagName ) ) {
					child.setAttribute( 'fill', _color )
					child.setAttribute( 'stroke', _color )
					child.style.fill = _color
					child.style.stroke = _color
				}
			} )
			svgEl.setAttribute( 'style', `fill: ${ _color } !important; color: ${ _color } !important` )
		}

		/**
		 * Use XMLSerializer to create XML string from DOM Element
		 *
		 * @see https://developer.mozilla.org/en-US/docs/Web/API/XMLSerializer
		 */
		const serializedString = new XMLSerializer().serializeToString( svgEl ) //eslint-disable-line no-undef

		return window.btoa( serializedString )
	}
}

/**
 * Create a toolbar control
 * for the icon list block.
 *
 * @param {{ isSelected, tagName, setAttributes }}  options
 * @return {Function} function which will be used as render props.
 */
export const createIconListControls = ( options = {} ) => {
	const {
		isSelected,
		tagName,
		setAttributes,
	} = options

	return ( {
		value, onChange, onFocus,
	} ) => (
		<Fragment>
			{ isSelected && (
				<Fragment>
					<RichTextShortcut
						type="primary"
						character="["
						onUse={ () => {
							onChange( outdentListItems( value ) )
						} }
					/>
					<RichTextShortcut
						type="primary"
						character="]"
						onUse={ () => {
							onChange(
								indentListItems( value, { type: tagName } )
							)
						} }
					/>
					<RichTextShortcut
						type="primary"
						character="m"
						onUse={ () => {
							onChange(
								indentListItems( value, { type: tagName } )
							)
						} }
					/>
					<RichTextShortcut
						type="primaryShift"
						character="m"
						onUse={ () => {
							onChange( outdentListItems( value ) )
						} }
					/>
				</Fragment>
			) }

			<BlockControls group="block">
				<ToolbarButton
					icon={ isRTL() ? formatListBulletsRTL : formatListBullets }
					title={ __( 'Unordered' ) }
					describedBy={ __( 'Convert to unordered list' ) }
					isActive={ isActiveListType( value, 'ul', tagName ) }
					onClick={ () => {
						onChange( changeListType( value, { type: 'ul' } ) )
						onFocus()

						if ( isListRootSelected( value ) ) {
							setAttributes( { ordered: false } )
						}
					} }
				/>
				<ToolbarButton
					icon={
						isRTL() ? formatListNumberedRTL : formatListNumbered
					}
					title={ __( 'Ordered' ) }
					describedBy={ __( 'Convert to ordered list' ) }
					isActive={ isActiveListType( value, 'ol', tagName ) }
					onClick={ () => {
						onChange( changeListType( value, { type: 'ol' } ) )
						onFocus()

						if ( isListRootSelected( value ) ) {
							setAttributes( { ordered: true } )
						}
					} }
				/>
				<ToolbarButton
					icon={ isRTL() ? formatOutdentRTL : formatOutdent }
					title={ __( 'Outdent' ) }
					describedBy={ __( 'Outdent list item' ) }
					shortcut={ _x( 'Backspace', 'keyboard key' ) }
					isDisabled={ ! canOutdentListItems( value ) }
					onClick={ () => {
						onChange( outdentListItems( value ) )
						onFocus()
					} }
				/>
				<ToolbarButton
					icon={ isRTL() ? formatIndentRTL : formatIndent }
					title={ __( 'Indent' ) }
					describedBy={ __( 'Indent list item' ) }
					shortcut={ _x( 'Space', 'keyboard key' ) }
					isDisabled={ ! canIndentListItems( value ) }
					onClick={ () => {
						onChange( indentListItems( value, { type: tagName } ) )
						onFocus()
					} }
				/>
			</BlockControls>
		</Fragment>
	)
}
