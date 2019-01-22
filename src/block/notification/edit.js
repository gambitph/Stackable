import {
	InspectorControls, PanelColorSettings, RichText,
} from '@wordpress/editor'
import {
	RangeControl, SelectControl, ToggleControl,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import { Fragment } from '@wordpress/element'

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
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-notification',
		`ugb-notification--type-${ notifType }`,
	], {
		'ugb-notification--dismissible': dismissible,
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
	} )

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
			</InspectorControls>
			<div className={ mainClasses } style={ mainStyles }>
				{ dismissible && (
					<span className="ugb-notification__close-button" role="button">
						<svg viewBox="0 0 28.3 28.3" style={ { fill: textColor } }>
							<path d="M52.4-166.2c3.2,0,3.2-5,0-5C49.2-171.2,49.2-166.2,52.4-166.2L52.4-166.2z" />
							<path d="M16.8,13.9L26.9,3.8c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L14.7,11.8L4.6,1.7C4,1.1,3.1,1.1,2.5,1.7s-0.6,1.5,0,2.1l10.1,10.1L2.5,24c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4L14.7,16l10.1,10.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L16.8,13.9z" />
						</svg>
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
			</div>
		</Fragment>
	)
}

export default edit
