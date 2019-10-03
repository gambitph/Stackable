/**
 * External dependencies
 */
import classnames from 'classnames'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'
import {
	SvgIcon,
	BlockContainer,
	ButtonEdit,
} from '~stackable/components'
import { createVideoBackground, hasBackgroundOverlay } from '~stackable/util'

/**
 * Internal dependencies
 */
import createStyles from './style'
import SVGCloseIcon from './images/close-icon.svg'
import { showOptions } from './util'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { RichText } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

const save = props => {
	const { className } = props

	const {
		design = 'basic',
		notifType,
		dismissible,
		shadow = 3,

		// Icon.
		showIcon = false,
		icon = 'fas-exclamation-triangle',

		// Title.
		showTitle = true,
		titleTag = 'h5',
		title = '',

		// Description.
		showDescription = true,
		description = '',

		// Button.
		showButton = true,
		buttonSize = 'normal',
		buttonText = '',
		buttonShadow = 0,
		buttonHoverEffect = '',
		buttonIcon = '',
		buttonIconPosition = '',
		buttonDesign = 'plain',
		buttonHoverGhostToNormal = false,
		buttonNewWindow = false,
		buttonUrl = '',
		buttonNoFollow = false,
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-notification--v2',
		`ugb-notification--design-${ design }`,
		`ugb-notification--type-${ notifType }`,
	], applyFilters( 'stackable.notification.mainclasses', {
		'ugb-notification--dismissible': dismissible,
	}, props ) )

	const itemClasses = classnames( [
		'ugb-notification__item',
	], {
		[ `ugb--shadow-${ shadow }` ]: shadow !== 3,
		'ugb--has-background-overlay': hasBackgroundOverlay( 'column%s', props.attributes ),
	} )

	const show = showOptions( props )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<div className={ itemClasses }>
					{ show.columnBackground && createVideoBackground( 'column%s', props ) }
					{ dismissible && (
						<span
							className="ugb-notification__close-button"
							role="button"
							tabIndex="0"
						>
							<SVGCloseIcon />
						</span>
					) }
					{ showIcon &&
						<SvgIcon.Content
							className="ugb-notification__icon"
							value={ icon }
						/>
					}
					{ showTitle && !! title.length &&
						<RichText.Content
							tagName={ titleTag || 'h5' }
							className="ugb-notification__title"
							value={ title }
						/>
					}
					{ showDescription && !! description.length &&
						<RichText.Content
							tagName="p"
							className="ugb-notification__description"
							value={ description }
						/>
					}
					{ showButton && !! buttonText.length &&
						<ButtonEdit.Content
							size={ buttonSize !== '' ? buttonSize : 'normal' }
							text={ buttonText }
							icon={ buttonIcon }
							newTab={ buttonNewWindow !== '' && buttonNewWindow }
							url={ buttonUrl }
							noFollow={ buttonNoFollow }
							hoverEffect={ buttonHoverEffect }
							ghostToNormalEffect={ buttonHoverGhostToNormal }
							shadow={ buttonShadow }
							iconPosition={ buttonIconPosition }
							design={ buttonDesign !== '' ? buttonDesign : 'ghost' }
						/>
					}
				</div>
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
