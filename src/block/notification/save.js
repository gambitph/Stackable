import classnames from 'classnames'
import md5 from 'md5'
import { RichText } from '@wordpress/editor'
import SVGCloseIcon from './images/close-icon.svg'

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
					<SVGCloseIcon style={ { fill: textColor } } />
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
