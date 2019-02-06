import { ColorPaletteControl, DesignPanelBody, ProControl } from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	RangeControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { ArrowIcon } from './index'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import imageDesignBasic from './images/basic.png'
import imageDesignPlain from './images/plain.png'
import { showProNotice } from 'stackable'

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		headingColor,
		headingBackgroundColor,
		heading,
		text,
		openStart,
		design = 'basic',
		borderRadius = 12,
		shadow = 3,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-accordion',
	], applyFilters( 'stackable.accordion.mainclasses', {
		[ `ugb-accordion--design-${ design }` ]: design !== 'basic',
		'ugb-accordion--open': openStart,
	}, props ) )

	const mainStyles = applyFilters( 'stackable.accordion.mainstyles', {}, props )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], applyFilters( 'stackable.accordion.headingclasses', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, props ) )

	const headingStyles = applyFilters( 'stackable.accordion.headingstyles', {
		borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
		backgroundColor: design !== 'plain' && headingBackgroundColor ? headingBackgroundColor : undefined,
	}, props )

	return (
		<Fragment>
			<InspectorControls>
				<DesignPanelBody
					selected={ design }
					options={ applyFilters( 'stackable.accordion.edit.designs', [
						{
							label: __( 'Basic' ), value: 'basic', image: imageDesignBasic,
						},
						{
							label: __( 'Plain' ), value: 'plain', image: imageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				>
					{ applyFilters( 'stackable.accordion.edit.designs.before', null, props ) }
					{ ! [ 'plain' ].includes( design ) &&
						<ColorPaletteControl
							label={ __( 'Background Color' ) }
							value={ headingBackgroundColor }
							onChange={ headingBackgroundColor => setAttributes( { headingBackgroundColor } ) }
						/>
					}
					{ design !== 'plain' &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ design !== 'plain' &&
						<RangeControl
							label={ __( 'Shadow / Outline' ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
						/>
					}
					{ applyFilters( 'stackable.accordion.edit.designs.after', null, props ) }
					{ showProNotice && <ProControl size="small" /> }
				</DesignPanelBody>
				<PanelColorSettings
					title={ __( 'General Settings' ) }
					colorSettings={ [
						{
							value: headingColor,
							onChange: headingColor => setAttributes( { headingColor } ),
							label: __( 'Heading Color' ),
						},
					] }
				>
					<ToggleControl
						label={ __( 'Open at the start' ) }
						checked={ openStart }
						onChange={ openStart => setAttributes( { openStart } ) }
					/>
				</PanelColorSettings>
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyles }>
				<div className={ headingClasses } style={ headingStyles }>
					<RichText
						tagName="h4"
						value={ heading }
						onChange={ heading => setAttributes( { heading } ) }
						style={ {
							color: headingColor ? headingColor : undefined,
						} }
						placeholder={ __( 'Title for This Block' ) }
						keepPlaceholderOnFocus
					/>
					{ ArrowIcon( {
						fill: headingColor ? headingColor : undefined,
					} ) }
				</div>
				<RichText
					tagName="p"
					value={ text }
					className="ugb-accordion__text"
					onChange={ text => setAttributes( { text } ) }
					placeholder={ descriptionPlaceholder( 'long' ) }
					keepPlaceholderOnFocus
				/>
			</div>
		</Fragment>
	)
}

export default edit
