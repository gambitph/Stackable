import classnames from 'classnames'
import md5 from 'md5'
import { RichText } from '@wordpress/editor'

const save = props => {
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

export default save
