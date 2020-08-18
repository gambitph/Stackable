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

/**
 * Internal dependencies
 */
import createStyles from './style'

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
import classnames from 'classnames'
import { i18n } from 'stackable'
import { updateIconAttribute } from './util'

// Change the icon attributes from Icon List Blocks in <=2.9.1
addFilter( 'stackable.icon-list.edit.inspector.style.before', 'stackable/icon-list/icon', ( output, props ) => {
	const {
		icon,
		iconShape,
	} = props.attributes

	props.attributes.icon = updateIconAttribute( icon, iconShape )
	return output
} )

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
	], applyFilters( 'stackable.icon-list.mainclasses', {
		'ugb-icon-list--display-grid': displayAsGrid,
	}, design, props ) )

	const textRef = createRef()
	const isTyping = select( 'core/block-editor' ).isTyping()
	const [ isOpenIconSearch, setIsOpenIconSearch ] = useState( false )
	const [ iconSearchAnchor, setIconSearchAnchor ] = useState( null )
	const [ selectedIconIndex, setSelectedIconIndex ] = useState( null )

	const iconClickHandler = event => {
		// If li isn't clicked, close the icon search.
		if ( event.target.tagName !== 'LI' ) {
			return setIsOpenIconSearch( false )
		}

		// Check if the click is on the icon.
		if ( event.offsetX <= ( props.attributes.iconSize || 20 ) ) {
			// Get the selected li and show the icon picker on it.
			const index = Array.from( event.target.parentElement.children ).indexOf( event.target ) + 1
			setSelectedIconIndex( index )
			setIconSearchAnchor( event.target )
			setIsOpenIconSearch( true )
		} else {
			// Hide the icon picker.
			setIconSearchAnchor( null )
			setIsOpenIconSearch( false )
		}
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
		}
	}, [ isSelected ] )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<RichText
					tagName="ul"
					multiline="li"
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					placeholder={ __( 'Text for this block', i18n ) }
					keepPlaceholderOnFocus
					ref={ textRef }
				/>
				{ ! isTyping && isSelected && isOpenIconSearch &&
					<IconSearchPopover
						position="bottom left"
						anchorRef={ iconSearchAnchor }
						onClose={ () => setIsOpenIconSearch( false ) }
						onChange={ icon => {
							setAttributes( { [ `icon${ selectedIconIndex }` ]: icon } )
						} }
					/>
				}
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		[ 'ul, ul li', 'text' ],
	] ),
)( Edit )
