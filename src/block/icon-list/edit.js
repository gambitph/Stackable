import { addFilter, applyFilters } from '@wordpress/hooks'
import {
	BaseControl, PanelBody, RangeControl, Toolbar,
} from '@wordpress/components'
import { BlockContainer, ColorPaletteControl, ContentAlignControl, PanelSpacingBody, TypographyControlHelper } from '@stackable/components'
import {
	getIconShapeToolbarList,
	getIconSVG,
	getIconToolbarList,
} from './util'
import { withBlockStyles, withGoogleFont, withSetAttributeHook, withTabbedInspector, withUniqueClass } from '@stackable/higher-order'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import createStyles from './style'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/editor'

addFilter( 'stackable.icon-list.edit.inspector.style.before', 'stackable/icon-list', ( output, props ) => {
	const { setAttributes } = props

	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		columns,
		gap,
		listTextColor = '',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'Icon' ) }>
				<BaseControl label={ __( 'Icon' ) }>
					<Toolbar
						icon={ getIconSVG( icon ) }
						controls={ getIconToolbarList( {
							onChange: icon => () => setAttributes( { icon } ),
							isActive: value => icon === value,
						} ) }
					/>
				</BaseControl>
				<BaseControl label={ __( 'Icon Shape' ) }>
					<Toolbar
						icon={ getIconSVG( icon, iconShape ) }
						controls={ getIconShapeToolbarList( icon, {
							onChange: iconShape => () => setAttributes( { iconShape } ),
							isActive: value => iconShape === value,
						} ) }
					/>
				</BaseControl>
				<ColorPaletteControl
					label={ __( 'Icon Color' ) }
					value={ iconColor }
					onChange={ iconColor => setAttributes( { iconColor } ) }
				/>
				<RangeControl
					label={ __( 'Icon Size' ) }
					value={ iconSize }
					onChange={ iconSize => setAttributes( { iconSize } ) }
					min={ 8 }
					max={ 50 }
					allowReset={ true }
				/>
			</PanelBody>
			<PanelBody title={ __( 'General' ) } initialOpen={ false }>
				<RangeControl
					label={ __( 'Columns' ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 3 }
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
					// attributeNamesToReset={ [ 'Number%sAlign', 'Title%sAlign', 'Description%sAlign' ] }
				/>
			</PanelBody>
			<PanelSpacingBody initialOpen={ false } blockProps={ props }>
				<RangeControl
					label={ __( 'List Gap' ) }
					value={ gap }
					onChange={ gap => setAttributes( { gap } ) }
					min={ 0 }
					max={ 30 }
					allowReset={ true }
				/>
			</PanelSpacingBody>
			<PanelBody title={ __( 'List Text' ) } initialOpen={ false }>
				<TypographyControlHelper
					attrNameTemplate="listText%s"
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
				<ColorPaletteControl
					value={ listTextColor }
					onChange={ listTextColor => setAttributes( { listTextColor } ) }
					label={ __( 'Color' ) }
				/>
			</PanelBody>
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
		columns,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		`ugb-icon--icon-${ icon }`,
		`ugb-icon--columns-${ columns }`,
	], applyFilters( 'stackable.icon-list.mainclasses', {}, design, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<RichText
					tagName="ul"
					multiline="li"
					value={ text }
					onChange={ text => setAttributes( { text } ) }
					placeholder={ __( 'Text for this block' ) }
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
	withTabbedInspector( [ 'style', 'advanced' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
