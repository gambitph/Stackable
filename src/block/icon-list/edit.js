/**
 * External dependencies
 */
import {
	withBlockStyles,
	withContentAlignReseter,
	withGoogleFont,
	withSetAttributeHook,
	withTabbedInspector,
	withUniqueClass,
	withClickOpenInspector,
} from '~stackable/higher-order'
import {
	AdvancedRangeControl,
	BlockContainer,
	ColorPaletteControl,
	ContentAlignControl,
	PanelSpacingBody,
	ResponsiveControl,
	TypographyControlHelper,
	PanelAdvancedSettings,
	ControlSeparator,
	IconControl,
	IconSearchPopover,
} from '~stackable/components'
import classnames from 'classnames'
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import createStyles from './style'
import { withTransformOldIconAttributes } from './higher-order'

/**
 * WordPress dependencies
 */
import {
	Fragment, createRef, useEffect, useState,
} from '@wordpress/element'
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	PanelBody, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { select } from '@wordpress/data'
import { RichText } from '@wordpress/block-editor'

// We need to add a class depending on the block alignment to make the
// individual icon picker work.
const includeEditorContentAlignClassName = attributes => {
	const {
		contentAlign,
		tabletContentAlign,
		mobileContentAlign,
	} = attributes
	const { __experimentalGetPreviewDeviceType: getPreviewDeviceType } = select( 'core/edit-post' )

	const addedAlignmentClass = {}

	if ( getPreviewDeviceType ) {
		const previewDeviceType = getPreviewDeviceType()
		const alignment = (
			previewDeviceType === 'Desktop' ? contentAlign :
				previewDeviceType === 'Tablet' ? tabletContentAlign :
					mobileContentAlign
		) || 'left'

		addedAlignmentClass[ `ugb-icon-list__${ alignment }-align` ] = alignment
	}

	return addedAlignmentClass
}

addFilter( 'stackable.icon-list.edit.inspector.style.before', 'stackable/icon-list', ( output, props ) => {
	const { setAttributes } = props

	const {
		icon,
		iconColor,
		iconSize,
		gap,
		listTextColor = '',
		displayAsGrid = false,
		columns = '',
		tabletColumns = '',
		mobileColumns = '',
		opacity = '',
		rotation = '',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<ResponsiveControl
					attrNameTemplate="%sColumns"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				>
					<AdvancedRangeControl
						label={ __( 'Columns', i18n ) }
						min={ 1 }
						max={ 4 }
					/>
				</ResponsiveControl>
				{ ( ( columns && columns > 1 ) || ( tabletColumns && tabletColumns > 1 ) || ( mobileColumns && mobileColumns > 1 ) ) && (
					<ToggleControl
						label={ __( 'Display as a grid (left to right & evenly spaced)', i18n ) }
						checked={ displayAsGrid }
						onChange={ displayAsGrid => setAttributes( { displayAsGrid } ) }
						className="ugb--help-tip-icon-list-grid"
					/>
				) }
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Icon', i18n ) } initialOpen={ false }>
				<IconControl
					label={ __( 'Icon', i18n ) }
					value={ icon }
					onChange={ icon => setAttributes( { icon } ) }
					onReset={ () => setAttributes( { icon: '<svg data-prefix="fas" data-icon="check" class="svg-inline--fa fa-check fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>' } ) }
					help={ __( 'You can click on each icon in the Icon List block to change them individually.', i18n ) }
				/>
				<ControlSeparator />
				<ColorPaletteControl
					label={ __( 'Icon Color', i18n ) }
					value={ iconColor }
					onChange={ iconColor => setAttributes( { iconColor } ) }
				/>
				<ControlSeparator />
				<AdvancedRangeControl
					label={ __( 'Icon Size', i18n ) }
					value={ iconSize }
					onChange={ iconSize => setAttributes( { iconSize } ) }
					min={ 8 }
					max={ 50 }
					allowReset={ true }
					placeholder="20"
				/>
				<AdvancedRangeControl
					label={ __( 'Icon Opacity', i18n ) }
					value={ opacity }
					min={ 0 }
					max={ 1 }
					step={ 0.1 }
					onChange={ opacity => setAttributes( { opacity } ) }
					allowReset={ true }
					placeholder="1.0"
				/>
				<AdvancedRangeControl
					label={ __( 'Icon Rotation', i18n ) }
					value={ rotation }
					min={ 0 }
					max={ 360 }
					onChange={ rotation => setAttributes( { rotation } ) }
					allowReset={ true }
					placeholder="0"
				/>
			</PanelBody>

			<PanelAdvancedSettings
				title={ __( 'List Text', i18n ) }
				id="text"
				initialOpen={ false }
			>
				<TypographyControlHelper
					attrNameTemplate="listText%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ listTextColor }
					onChange={ listTextColor => setAttributes( { listTextColor } ) }
					label={ __( 'Color', i18n ) }
				/>
			</PanelAdvancedSettings>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				<AdvancedRangeControl
					label={ __( 'List Gap', i18n ) }
					value={ gap }
					onChange={ gap => setAttributes( { gap } ) }
					min={ 0 }
					max={ 30 }
					allowReset={ true }
					placeholder="16"
					className="ugb--help-tip-icon-list-gap"
				/>
			</PanelSpacingBody>
		</Fragment>
	)
} )

const Edit = props => {
	const {
		className,
		setAttributes,
		isSelected,
	} = props

	const {
		text,
		design = '',
		displayAsGrid = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list--v2',
		includeEditorContentAlignClassName( props.attributes ),
	], applyFilters( 'stackable.icon-list.mainclasses', {
		'ugb-icon-list--display-grid': displayAsGrid,
	}, design, props ) )

	const textRef = createRef()
	const isTyping = select( 'core/block-editor' ).isTyping()
	const [ isOpenIconSearch, setIsOpenIconSearch ] = useState( false )
	const [ iconSearchAnchor, setIconSearchAnchor ] = useState( null )
	const [ selectedIconIndex, setSelectedIconIndex ] = useState( null )
	const [ selectedEvent, setSelectedEvent ] = useState( null )

	// Click handler to detect whether an icon is clicked, and open the icon
	// picker for that icon.
	const iconClickHandler = event => {
		// If li isn't clicked, close the icon search.
		setSelectedEvent( event )
		if ( event.target.tagName !== 'LI' ) {
			return setIsOpenIconSearch( false )
		}

		// Check if the click is on the icon.
		if ( event.offsetX <= ( props.attributes.iconSize || 20 ) ) {
			// Get the selected li and show the icon picker on it.
			const index = Array.from( event.target.parentElement.children ).indexOf( event.target ) + 1
			const { currentlyOpenIndex } = event.target.parentElement

			if ( currentlyOpenIndex && currentlyOpenIndex === index ) {
				event.target.parentElement.currentlyOpenIndex = undefined
				return setIsOpenIconSearch( false )
			}

			event.target.parentElement.currentlyOpenIndex = index
			setSelectedIconIndex( index )
			setIconSearchAnchor( event.target )
			return setIsOpenIconSearch( true )
		}
		// Hide the icon picker.
		event.target.parentElement.currentlyOpenIndex = undefined
		setIconSearchAnchor( null )
		return setIsOpenIconSearch( false )
	}

	// Create the click listeners to open the icon picker.
	useEffect( () => {
		textRef.current.addEventListener( 'click', iconClickHandler )
		return () => {
			if ( textRef.current ) {
				textRef.current.removeEventListener( 'click', iconClickHandler )
			}
		}
	}, [] )

	// Hide the icon search when the block gets blurred.
	useEffect( () => {
		if ( ! isSelected ) {
			setIsOpenIconSearch( false )
			if ( selectedEvent ) {
				selectedEvent.target.parentElement.currentlyOpenIndex = undefined
			}
		}
	}, [ isSelected ] )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div ref={ textRef }>
					<RichText
						tagName="ul"
						multiline="li"
						value={ text }
						onChange={ text => setAttributes( { text } ) }
						placeholder={ __( 'Text for this block', i18n ) }
						keepPlaceholderOnFocus
					/>
					{ ! isTyping && isSelected && isOpenIconSearch &&
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
							setAttributes( { [ `icon${ selectedIconIndex }` ]: icon } )
						} }
					/>
					}
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTransformOldIconAttributes,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ 'ul, ul li', 'text' ],
	] ),
)( Edit )
