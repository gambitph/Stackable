/**
 * Internal dependencies
 */
import { IconListStyles } from './style'

/***
 * External dependencies
 */
import classnames from 'classnames'
import { i18n, version as VERSION } from 'stackable'
import {
	InspectorTabs,
	InspectorStyleControls,
	PanelAdvancedSettings,
	AdvancedRangeControl,
	IconControl,
	ColorPaletteControl,
	IconSearchPopover,
	AdvancedSelectControl,
} from '~stackable/components'
import {
	useBlockHoverClass,
} from '~stackable/hooks'
import {
	Typography,
	BlockDiv,
	Advanced,
	CustomCSS,
	Responsive,
	CustomAttributes,
	EffectsAnimations,
	getTypographyClasses,
	MarginBottom,
	Alignment,
	getAlignmentClasses,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import {
	useSelect,
} from '@wordpress/data'
import {
	Fragment, useRef, useEffect, useState, useCallback,
} from '@wordpress/element'
import {
	__,
} from '@wordpress/i18n'
import { createIconListControls } from './util'

const listTypeOptions = [
	{
		label: __( 'Number', i18n ),
		value: 'decimal',
	},
	{
		label: __( 'Padded Number', i18n ),
		value: 'decimal-leading-zero',
	},
	{
		label: __( 'Lowercase Roman', i18n ),
		value: 'lower-roman',
	},
	{
		label: __( 'Uppercase Roman', i18n ),
		value: 'upper-roman',
	},
	{
		label: __( 'Lowercase Letters', i18n ),
		value: 'lower-alpha',
	},
	{
		label: __( 'Uppercase Letters', i18n ),
		value: 'upper-alpha',
	},
]

const Edit = props => {
	const textRef = useRef()
	const [ isOpenIconSearch, setIsOpenIconSearch ] = useState( false )
	const [ iconSearchAnchor, setIconSearchAnchor ] = useState( null )
	const [ selectedIconCSSSelector, setSelectedIconCSSSelector ] = useState( null )
	const [ selectedEvent, setSelectedEvent ] = useState( null )
	const {
		isTyping,
		deviceType,
	} = useSelect( select => ( {
		isTyping: select( 'core/block-editor' ).isTyping(),
		deviceType: select( 'core/edit-post' ).__experimentalGetPreviewDeviceType(),
	} ) )

	// Click handler to detect whether an icon is clicked, and open the icon
	// picker for that icon.
	const iconClickHandler = useCallback( event => {
		// If li isn't clicked, close the icon search.
		setSelectedEvent( event )
		if ( event.target.tagName !== 'LI' || event.target.parentElement.tagName !== 'UL' ) {
			return setIsOpenIconSearch( false )
		}

		/**
		 * Check if the click is on the icon.
		 */

		// Different icon sizes per device preview.
		const currentIconSize = (
			deviceType === 'Desktop' ? props.attributes.iconSize
				: deviceType === 'Tablet' ? ( props.attributes.iconSizeTablet || props.attributes.iconSize )
					: ( props.attributes.iconSizeMobile || props.attributes.iconSizeTablet || props.attributes.iconSize ) ) ||
		20

		// Check if the click location if it's estimated to be on the icon.
		if ( event.offsetX <= currentIconSize + 21 ) {
			// Get the selected li and show the icon picker on it.
			const index = Array.from( event.target.parentElement.children ).indexOf( event.target ) + 1
			const { currentlyOpenIndex } = event.target.parentElement

			if ( currentlyOpenIndex && currentlyOpenIndex === index ) {
				event.target.parentElement.currentlyOpenIndex = undefined
				return setIsOpenIconSearch( false )
			}

			event.target.parentElement.currentlyOpenIndex = index

			/**
			 * Get the CSS selector of the selected icon.
			 *
			 * @since 3.0.0
			 */
			let traverseToRichText = event.target
			const selectors = []
			while ( traverseToRichText.tagName !== 'DIV' ) {
				traverseToRichText.parentElement.childNodes.forEach( ( el, idx ) => {
					if ( el === traverseToRichText ) {
						const tagName = traverseToRichText.tagName.toLowerCase()
						const selector = `${ tagName }${ tagName === 'li' ? `:nth-child(${ idx + 1 })` : '' }`
						selectors.push( selector )
					}
				} )
				traverseToRichText = traverseToRichText.parentElement
			}

			setSelectedIconCSSSelector( selectors.reverse().join( '>' ) )
			setIconSearchAnchor( event.target )
			return setIsOpenIconSearch( true )
		}

		// Hide the icon picker.
		event.target.parentElement.currentlyOpenIndex = undefined
		setIconSearchAnchor( null )
		return setIsOpenIconSearch( false )
	}, [ deviceType, props.attributes.iconSize, props.attributes.iconSizeTablet, props.attributes.iconSizeMobile ] )

	useEffect( () => {
		textRef.current.addEventListener( 'click', iconClickHandler )

		return () => {
			if ( textRef.current ) {
				textRef.current.removeEventListener( 'click', iconClickHandler )
			}
		}
	}, [ iconClickHandler, textRef.current ] )

	const {
		attributes,
		setAttributes,
		className,
		isSelected,
	} = props

	const { ordered } = attributes
	const tagName = ordered ? 'ol' : 'ul'

	const blockHoverClass = useBlockHoverClass()
	const textClasses = getTypographyClasses( attributes )
	const blockAlignmentClass = getAlignmentClasses( attributes )

	const blockClassNames = classnames( [
		className,
		'stk-block-icon-list',
		blockAlignmentClass,
		blockHoverClass,
		textClasses,
	] )

	const controls = useCallback( createIconListControls( {
		isSelected, tagName, setAttributes,
	} ), [ isSelected, tagName, setAttributes ] )

	return (
		<Fragment>
			<InspectorTabs />

			<Alignment.InspectorControls />
			<BlockDiv.InspectorControls />

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'General', i18n ) }
					initialOpen={ true }
					id="general"
				>
					<AdvancedRangeControl
						label={ __( 'Columns', i18n ) }
						attribute="columns"
						min="1"
						sliderMax="3"
						step="1"
						placeholder="1"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Column Gap', i18n ) }
						attribute="columnGap"
						min="0"
						sliderMax="50"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Gap', i18n ) }
						attribute="iconGap"
						min="0"
						sliderMax="20"
						responsive="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Indendation', i18n ) }
						attribute="indentation"
						min="0"
						sliderMax="50"
						responsive="all"
						placeholder=""
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<InspectorStyleControls>
				<PanelAdvancedSettings
					title={ __( 'Icons & Numbers', i18n ) }
					initialOpen={ false }
					id="icon-and-markers"
				>
					<IconControl
						label={ __( 'Icon', i18n ) }
						value={ attributes.icon }
						onChange={ icon => {
							// Reset custom individual icons.
							setAttributes( { icon, icons: [] } )
						} }
					/>

					<AdvancedSelectControl
						label={ __( 'List Type', i18n ) }
						attribute="listType"
						options={ listTypeOptions }
					/>

					<ColorPaletteControl
						label={ __( 'Icon Color', i18n ) }
						attribute="iconColor"
						hover="all"
					/>

					<ColorPaletteControl
						label={ __( 'Number Color', i18n ) }
						attribute="markerColor"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Size', i18n ) }
						attribute="iconSize"
						min={ 0 }
						max={ 5 }
						step={ 0.1 }
						allowReset={ true }
						responsive="all"
						placeholder="1"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Opacity', i18n ) }
						attribute="iconOpacity"
						min={ 0 }
						max={ 1 }
						step={ 0.1 }
						allowReset={ true }
						placeholder="1.0"
						hover="all"
					/>

					<AdvancedRangeControl
						label={ __( 'Icon Rotation', i18n ) }
						attribute="iconRotation"
						min={ 0 }
						max={ 360 }
						allowReset={ true }
						placeholder="0"
					/>
				</PanelAdvancedSettings>
			</InspectorStyleControls>

			<Typography.InspectorControls
				isMultiline={ true }
				initialOpen={ false }
				hasTextTag={ false }
				hasTextContent={ false }
			/>

			<Advanced.InspectorControls />
			<Transform.InspectorControls />
			<EffectsAnimations.InspectorControls />
			<CustomAttributes.InspectorControls />
			<CustomCSS.InspectorControls mainBlockClass="stk-block-icon-list" />
			<Responsive.InspectorControls />

			<IconListStyles version={ VERSION } />
			<CustomCSS mainBlockClass="stk-block-icon-list" />

			<BlockDiv className={ blockClassNames }>
				<div ref={ textRef }>
					<Typography
						tagName={ tagName }
						multiline="li"
					>
						{ controls }
					</Typography>
					{ ! isTyping && isSelected && isOpenIconSearch && (
						<IconSearchPopover
							position="bottom left"
							anchorRef={ iconSearchAnchor }
							onClose={ () => {
								if ( selectedEvent ) {
									selectedEvent.target.parentElement.currentlyOpenIndex = undefined
								}
								setIsOpenIconSearch( false )
							} }
							onChange={ icon => {
								const icons = { ...props.attributes.icons }
								if ( ! icon ) {
									// Remove the icon inside the icons.
									delete icons[ selectedIconCSSSelector ]
								} else {
									icons[ selectedIconCSSSelector ] = icon
								}

								setAttributes( {
									icons: { ...icons },
								} )
							} }
						/>
					) }
				</div>
			</BlockDiv>
			<MarginBottom />

		</Fragment>
	)
}

export default Edit
