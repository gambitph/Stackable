import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { RichText } from '@wordpress/block-editor'
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
		<div className={ mainClasses } style={ mainStyles }>
			{ applyFilters( 'stackable.notification.save.output.before', null, design, props ) }
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
			{ applyFilters( 'stackable.notification.save.output.after', null, design, props ) }
		</div>
	)
}

export default save
