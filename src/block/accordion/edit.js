import {
	ColorPaletteControl,
	DesignPanelBody,
	ProControl,
	ProControlButton,
} from '@stackable/components'
import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	PanelBody, RangeControl, ToggleControl,
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
	}, design, props ) )

	const headingClasses = classnames( [
		'ugb-accordion__heading',
	], applyFilters( 'stackable.accordion.headingclasses', {
		[ `ugb--shadow-${ shadow }` ]: design !== 'plain' && shadow !== 3,
	}, design, props ) )

	const styles = applyFilters( 'stackable.accordion.styles', {
		main: {},
		heading: {
			borderRadius: design !== 'plain' && borderRadius !== 12 ? borderRadius : undefined,
			backgroundColor: design !== 'plain' && headingBackgroundColor ? headingBackgroundColor : undefined,
		},
		title: {
			color: headingColor ? headingColor : undefined,
		},
	}, design, props )

	const show = applyFilters( 'stackable.accordion.edit.show', {
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
	}, design, props )

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
					{ applyFilters( 'stackable.accordion.edit.designs.before', null, design, props ) }
					{ show.backgroundColor &&
						<ColorPaletteControl
							label={ __( 'Background Color' ) }
							value={ headingBackgroundColor }
							onChange={ headingBackgroundColor => setAttributes( { headingBackgroundColor } ) }
						/>
					}
					{ show.borderRadius &&
						<RangeControl
							label={ __( 'Border Radius' ) }
							value={ borderRadius }
							onChange={ borderRadius => setAttributes( { borderRadius } ) }
							min={ 0 }
							max={ 50 }
						/>
					}
					{ show.shadow &&
						<RangeControl
							label={ __( 'Shadow / Outline' ) }
							value={ shadow }
							onChange={ shadow => setAttributes( { shadow } ) }
							min={ 0 }
							max={ 9 }
						/>
					}
					{ applyFilters( 'stackable.accordion.edit.designs.after', null, props ) }
					{ showProNotice && <ProControlButton /> }
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
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋' ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.accordion.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ styles.main }>
				{ applyFilters( 'stackable.accordion.edit.output.before', null, design, props ) }
				<div className={ headingClasses } style={ styles.heading }>
					<RichText
						tagName="h4"
						value={ heading }
						onChange={ heading => setAttributes( { heading } ) }
						style={ styles.title }
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
				{ applyFilters( 'stackable.accordion.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
