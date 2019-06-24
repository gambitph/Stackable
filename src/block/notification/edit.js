import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/block-editor'
import {
	PanelBody, RangeControl, SelectControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'
import { ProControl } from '@stackable/components'
import { showProNotice } from 'stackable'
import SVGCloseIcon from './images/close-icon.svg'

const edit = props => {
	const notifAlert = [
		{ value: 'success', label: __( 'Success' ) },
		{ value: 'error', label: __( 'Error' ) },
		{ value: 'warning', label: __( 'Warning' ) },
		{ value: 'info', label: __( 'Information' ) },
	]

	const {
		setAttributes,
		className,
	} = props

	const {
		text,
		color,
		textColor,
		notifType,
		dismissible,
		borderRadius = 12,
		shadow = 3,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-notification',
		`ugb-notification--type-${ notifType }`,
	], applyFilters( 'stackable.notification.mainclasses', {
		'ugb-notification--dismissible': dismissible,
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
	}, design, props ) )

	const mainStyles = {
		backgroundColor: color,
		color: textColor,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<Fragment>
			<InspectorControls>
				<PanelColorSettings
					title={ __( 'Color Settings' ) }
					colorSettings={ [
						{
							value: color,
							onChange: colorValue => setAttributes( { color: colorValue } ),
							label: __( 'Background Color' ),
						},
						{
							value: textColor,
							onChange: colorValue => setAttributes( { textColor: colorValue } ),
							label: __( 'Text Color' ),
						},
					] }
				>
					<ToggleControl
						label={ __( 'Dismissible' ) }
						checked={ dismissible }
						onChange={ () => setAttributes( { dismissible: ! dismissible } ) }
					/>
					<SelectControl
						label={ __( 'Notification Type' ) }
						value={ notifType }
						options={ notifAlert.map( ( { value, label } ) => ( {
							value: value,
							label: label,
						} ) ) }
						onChange={ newSize => {
							setAttributes( { notifType: newSize } )
						} }
					/>
					<RangeControl
						label={ __( 'Border Radius' ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
					/>
					<RangeControl
						label={ __( 'Shadow / Outline' ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
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
				{ applyFilters( 'stackable.notification.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyles }>
				{ applyFilters( 'stackable.notification.edit.output.before', null, design, props ) }
				{ dismissible && (
					<span className="ugb-notification__close-button" role="button">
						<SVGCloseIcon style={ { fill: textColor } } />
					</span>
				) }
				<RichText
					tagName="p"
					value={ text }
					onChange={ text => setAttributes( { text: text } ) }
					style={ {
						color: textColor,
					} }
					placeholder={ descriptionPlaceholder( 'long' ) }
					keepPlaceholderOnFocus
				/>
				{ applyFilters( 'stackable.notification.edit.output.after', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
