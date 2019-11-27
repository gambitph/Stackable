/**
 * External dependencies
 */
import { descriptionPlaceholder } from '~stackable/util'

/**
 * Internal dependencies
 */
import SVGCloseIconV112 from './images/close-icon-v1-12.svg'
import classnames from 'classnames'
import md5 from 'md5'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'

const deprecatedSchema_1_17 = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	notifType: {
		type: 'string',
		default: 'success',
	},
	dismissible: {
		type: 'boolean',
		default: false,
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},
}

const deprecatedSave_1_17 = props => {
	const { className } = props
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
	], applyFilters( 'stackable.notification.mainclasses_1_17', {
		'ugb-notification--dismissible': dismissible,
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
	}, design, props ) )

	const mainStyles = {
		backgroundColor: color,
		color: textColor,
		borderRadius: borderRadius !== 12 ? borderRadius : undefined,
	}

	return (
		<div className={ mainClasses } style={ mainStyles }>
			{ applyFilters( 'stackable.notification.save.output.before_1_17', null, design, props ) }
			{ dismissible && (
				<span className="ugb-notification__close-button" role="button" tabIndex="0">
					<SVGCloseIconV112 style={ { fill: textColor } } />
				</span>
			) }
			<RichText.Content
				tagName="p"
				style={ { color: textColor } }
				value={ text }
			/>
		</div>
	)
}

const deprecatedSchema_1_12 = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	notifType: {
		type: 'string',
		default: 'success',
	},
	dismissible: {
		type: 'boolean',
		default: false,
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
}

const deprecatedSave_1_12 = props => {
	const { className } = props
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

	// UID is a unique string depending on the contents and is used for
	// remembering whether the notification was closed in the frontend.
	const uid = md5( text + notifType ).substr( 0, 6 )

	return (
		<div className={ mainClasses } style={ mainStyles } data-uid={ uid }>
			{ dismissible && (
				<span className="ugb-notification__close-button" role="button" tabIndex="0">
					<SVGCloseIconV112 style={ { fill: textColor } } />
				</span>
			) }
			<RichText.Content
				tagName="p"
				style={ { color: textColor } }
				value={ text }
			/>
		</div>
	)
}

const deprecatedSchema_1_11 = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	notifType: {
		type: 'string',
		default: 'success',
	},
	dismissible: {
		type: 'boolean',
		default: false,
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
}

const deprecatedSave_1_11 = props => {
	const { className } = props
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

	// UID is a unique string depending on the contents and is used for
	// remembering whether the notification was closed in the frontend.
	const uid = md5( text + notifType ).substr( 0, 6 )

	return (
		<div className={ mainClasses } style={ mainStyles } data-uid={ uid }>
			{ dismissible && (
				<span className="ugb-notification__close-button" role="button" tabIndex="0">
					<svg viewBox="0 0 28.3 28.3" style={ { fill: textColor } }>
						<path d="M52.4-166.2c3.2,0,3.2-5,0-5C49.2-171.2,49.2-166.2,52.4-166.2L52.4-166.2z" />
						<path d="M16.8,13.9L26.9,3.8c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L14.7,11.8L4.6,1.7C4,1.1,3.1,1.1,2.5,1.7s-0.6,1.5,0,2.1l10.1,10.1L2.5,24c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4L14.7,16l10.1,10.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L16.8,13.9z" />
					</svg>
				</span>
			) }
			<RichText.Content
				tagName="p"
				style={ { color: textColor } }
				value={ text }
			/>
		</div>
	)
}

export const deprecatedSchema_1_10 = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	notifType: {
		type: 'string',
		default: 'success',
	},
	dismissible: {
		type: 'boolean',
		default: false,
	},
}

const deprecatedSave_1_10 = props => {
	const { className } = props
	const {
		text,
		color,
		textColor,
		notifType,
		dismissible,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-notification',
		`type-${ notifType }`,
		`dismissible-${ dismissible }`,
	] )

	const buttonStyle = {
		backgroundColor: color,
		color: textColor,
	}

	// UID is a unique string depending on the contents and is used for
	// remembering whether the notification was closed in the frontend.
	const uid = md5( text + notifType ).substr( 0, 6 )

	return (
		<div className={ mainClasses } data-uid={ uid }>
			{ dismissible && (
				<span key="button" className="close-button">
					<svg viewBox="0 0 28.3 28.3" style={ { fill: textColor } }>
						<path d="M52.4-166.2c3.2,0,3.2-5,0-5C49.2-171.2,49.2-166.2,52.4-166.2L52.4-166.2z" />
						<path d="M16.8,13.9L26.9,3.8c0.6-0.6,0.6-1.5,0-2.1s-1.5-0.6-2.1,0L14.7,11.8L4.6,1.7C4,1.1,3.1,1.1,2.5,1.7s-0.6,1.5,0,2.1l10.1,10.1L2.5,24c-0.6,0.6-0.6,1.5,0,2.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4L14.7,16l10.1,10.1c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L16.8,13.9z" />
					</svg>
				</span>
			) }
			<RichText.Content
				tagName="p"
				className={ `wp-ugb-notif notif-${ notifType }` }
				style={ buttonStyle }
				value={ text }
			/>
		</div>
	)
}

const deprecated = [
	{
		attributes: deprecatedSchema_1_17,
		save: deprecatedSave_1_17,
		migrate: attributes => {
			// Update the custom CSS since the structure has changed.
			const updateCSS = css => ( css || '' )
				.replace( /\n\.ugb-notification(\s*{)/g, '\n.ugb-notification__item$1' )
				.replace( /\n\.ugb-notification p(\s*{)/g, '\n.ugb-notification__description$1' )

			return {
				...attributes,

				// Custom CSS.
				customCSS: updateCSS( attributes.customCSS ),
				customCSSCompiled: updateCSS( attributes.customCSSCompiled ),

				description: attributes.text,
				columnBackgroundColor: attributes.color,
				iconColor: attributes.textColor,
				titleColor: attributes.textColor,
				descriptionColor: attributes.textColor,
				showTitle: false,
				showButton: false,
			}
		},
	},
	{
		attributes: deprecatedSchema_1_12,
		save: deprecatedSave_1_12,
	},
	{
		attributes: deprecatedSchema_1_11,
		save: deprecatedSave_1_11,
	},
	{
		attributes: deprecatedSchema_1_10,
		save: deprecatedSave_1_10,
		migrate: attributes => {
			return {
				...attributes,
				borderRadius: 12,
				shadow: 3,
			}
		},
	},
]

export default deprecated
