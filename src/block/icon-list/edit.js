
import {
	BaseControl, PanelBody, RangeControl, Toolbar,
} from '@wordpress/components'
import { ColorPaletteControl, ProControl } from '@stackable/components'
import {
	getIconShapeToolbarList,
	getIconSVG,
	getIconSVGBase64,
	getIconToolbarList,
} from './util'
import { i18n, showProNotice } from 'stackable'
import {
	InspectorControls, RichText,
} from '@wordpress/block-editor'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		icon,
		iconShape,
		iconColor,
		iconSize,
		text,
		columns,
		gap,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-icon-list-wrapper',
	], applyFilters( 'stackable.icon-list.mainclasses', {}, design, props ) )

	const ulClasses = classnames( [
		'ugb-icon-list',
		`ugb-icon--icon-${ icon }`,
		`ugb-icon--columns-${ columns }`,
	], applyFilters( 'stackable.icon-list.ulclasses', {}, design, props ) )

	const iconSVGString = getIconSVGBase64( icon, iconShape, iconColor )
	const style = {
		'--icon': 'url(\'data:image/svg+xml;base64,' + iconSVGString + '\')',
		'--icon-size': iconSize ? `${ iconSize }px` : undefined,
		'--gap': gap ? `${ gap }px` : undefined,
	}

	function applyIcon( icon ) {
		return () => setAttributes( { icon } )
	}
	function applyIconShape( iconShape ) {
		return () => setAttributes( { iconShape } )
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<BaseControl label={ __( 'Icon', i18n ) }>
						<Toolbar
							icon={ getIconSVG( icon ) }
							controls={ getIconToolbarList( {
								onChange: value => applyIcon( value ),
								isActive: value => icon === value,
							} ) }
						/>
					</BaseControl>
					<BaseControl label={ __( 'Icon Shape', i18n ) }>
						<Toolbar
							icon={ getIconSVG( icon, iconShape ) }
							controls={ getIconShapeToolbarList( icon, {
								onChange: value => applyIconShape( value ),
								isActive: value => iconShape === value,
							} ) }
						/>
					</BaseControl>
					<ColorPaletteControl
						label={ __( 'Icon Color', i18n ) }
						value={ iconColor }
						onChange={ iconColor => setAttributes( { iconColor } ) }
					/>
					<RangeControl
						label={ __( 'Icon Size', i18n ) }
						value={ iconSize }
						onChange={ iconSize => setAttributes( { iconSize } ) }
						min={ 8 }
						max={ 30 }
					/>
					<RangeControl
						label={ __( 'Columns', i18n ) }
						value={ columns }
						onChange={ columns => setAttributes( { columns } ) }
						min={ 1 }
						max={ 3 }
					/>
					<RangeControl
						label={ __( 'List Gap', i18n ) }
						value={ gap }
						onChange={ gap => setAttributes( { gap } ) }
						min={ 0 }
						max={ 30 }
					/>
				</PanelBody>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS', i18n ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋', i18n ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium', i18n ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.icon-list.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ style }>
				{ applyFilters( 'stackable.icon-list.edit.output.before', null, design, props ) }
				<RichText
					tagName="ul"
					multiline="li"
					value={ text }
					className={ ulClasses }
					onChange={ text => setAttributes( { text } ) }
					placeholder={ __( 'Text for this block', i18n ) }
					keepPlaceholderOnFocus
				/>
				{ applyFilters( 'stackable.icon-list.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
