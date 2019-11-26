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
} from '~stackable/higher-order'
import {
	AdvancedRangeControl,
	BlockContainer,
	ColorPaletteControl,
	ContentAlignControl,
	PanelSpacingBody,
	ResponsiveControl,
	TypographyControlHelper,
} from '~stackable/components'

/**
 * Internal dependencies
 */
import {
	getIconShapeToolbarList,
	getIconSVG,
	getIconToolbarList,
} from './util'
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	BaseControl, PanelBody, ToggleControl, Toolbar,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import classnames from 'classnames'
import { i18n } from 'stackable'

addFilter( 'stackable.icon-list.edit.inspector.style.before', 'stackable/icon-list', ( output, props ) => {
	const { setAttributes } = props

	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		gap,
		listTextColor = '',
		displayAsGrid = false,
		columns = '',
		tabletColumns = '',
		mobileColumns = '',
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
					/>
				) }
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>

			<PanelBody title={ __( 'Icon', i18n ) } initialOpen={ false }>
				<BaseControl
					label={ __( 'Icon', i18n ) }
					id="ugb-icon-control"
				>
					<Toolbar
						icon={ getIconSVG( icon ) }
						controls={ getIconToolbarList( {
							onChange: icon => () => setAttributes( { icon } ),
							isActive: value => icon === value,
						} ) }
					/>
				</BaseControl>
				<BaseControl
					label={ __( 'Icon Shape', i18n ) }
					id="ugb-icon-shape-control"
				>
					<Toolbar
						icon={ getIconSVG( icon, iconShape ) }
						controls={ getIconShapeToolbarList( icon, {
							onChange: iconShape => () => setAttributes( { iconShape } ),
							isActive: value => iconShape === value,
						} ) }
					/>
				</BaseControl>
				<ColorPaletteControl
					label={ __( 'Icon Color', i18n ) }
					value={ iconColor }
					onChange={ iconColor => setAttributes( { iconColor } ) }
				/>
				<AdvancedRangeControl
					label={ __( 'Icon Size', i18n ) }
					value={ iconSize }
					onChange={ iconSize => setAttributes( { iconSize } ) }
					min={ 8 }
					max={ 50 }
					allowReset={ true }
					placeholder="20"
				/>
			</PanelBody>

			<PanelBody title={ __( 'List Text', i18n ) } initialOpen={ false }>
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
			</PanelBody>

			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				<AdvancedRangeControl
					label={ __( 'List Gap', i18n ) }
					value={ gap }
					onChange={ gap => setAttributes( { gap } ) }
					min={ 0 }
					max={ 30 }
					allowReset={ true }
					placeholder="16"
				/>
			</PanelSpacingBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		icon,
		text,
		design = '',
		displayAsGrid = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list--v2',
		`ugb-icon--icon-${ icon }`,
	], applyFilters( 'stackable.icon-list.mainclasses', {
		'ugb-icon-list--display-grid': displayAsGrid,
	}, design, props ) )

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
				/>
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
)( edit )
