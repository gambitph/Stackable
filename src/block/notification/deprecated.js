/**
 * External dependencies
 */
import { descriptionPlaceholder } from '~stackable/util'

/**
 * Internal dependencies
 */
import SVGCloseIconV112 from './images/close-icon-v1-12.svg'
import classnames from 'classnames'

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
]

export default deprecated
