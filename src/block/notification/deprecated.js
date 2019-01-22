import classnames from 'classnames'
import { descriptionPlaceholder } from '@stackable/util'
import md5 from 'md5'
import { RichText } from '@wordpress/editor'

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
