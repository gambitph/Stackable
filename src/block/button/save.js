/**
 * External dependencies
 */
import { BlockContainer, ButtonEdit } from '~stackable/components'
import { withBlockStyles, withUniqueClass } from '~stackable/higher-order'

/**
 * Internal dependencies
 */
import createStyles from './style'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { compose } from '@wordpress/compose'
import { Fragment } from '@wordpress/element'

const save = props => {
	const { className, attributes } = props
	const {
		design = 'plain',
		tabletContentAlign = '',
		mobileContentAlign = '',
		collapseOn = '',
		showButton2 = false,
		showButton3 = false,
		button1Size = 'normal',
		button1Text = '',
		button1Shadow = 0,
		button1HoverEffect = '',
		button1Icon = '',
		button1IconPosition = '',
		button1NewTab = false,
		button1NoFollow = false,
		button1Url = '',
		button1Design = 'basic',
		button1HoverGhostToNormal = false,
		button2Size = 'normal',
		button2Text = '',
		button2Shadow = 0,
		button2HoverEffect = '',
		button2Icon = '',
		button2IconPosition = '',
		button2NewTab = false,
		button2NoFollow = false,
		button2Url = '',
		button2Design = 'basic',
		button2HoverGhostToNormal = false,
		button3Size = 'normal',
		button3Text = '',
		button3Shadow = 0,
		button3HoverEffect = '',
		button3Icon = '',
		button3IconPosition = '',
		button3NewTab = false,
		button3NoFollow = false,
		button3Url = '',
		button3Design = 'basic',
		button3HoverGhostToNormal = false,
	} = attributes

	const mainClasses = classnames( [
		className,
	], applyFilters( 'stackable.button.mainclasses', {
		'ugb-button--tablet-aligned': tabletContentAlign !== '',
		'ugb-button--mobile-aligned': mobileContentAlign !== '',
		[ `ugb-button--collapse-${ collapseOn }` ]: collapseOn,
		[ `ugb-button--design-${ design }` ]: design !== 'basic',
	}, design, props ) )

	return (
		<BlockContainer.Save className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<ButtonEdit.Content
					className="ugb-button1"
					size={ button1Size !== '' ? button1Size : 'normal' }
					text={ button1Text }
					icon={ button1Icon }
					newTab={ button1NewTab !== '' && button1NewTab }
					url={ button1Url }
					noFollow={ button1NoFollow }
					hoverEffect={ button1HoverEffect }
					ghostToNormalEffect={ button1HoverGhostToNormal }
					shadow={ button1Shadow }
					iconPosition={ button1IconPosition }
					design={ button1Design !== '' ? button1Design : 'basic' }
				/>
				{ showButton2 &&
					<ButtonEdit.Content
						className="ugb-button2"
						size={ button2Size !== '' ? button2Size : 'normal' }
						text={ button2Text }
						icon={ button2Icon }
						newTab={ button2NewTab !== '' && button2NewTab }
						url={ button2Url }
						noFollow={ button2NoFollow }
						hoverEffect={ button2HoverEffect }
						ghostToNormalEffect={ button2HoverGhostToNormal }
						shadow={ button2Shadow }
						iconPosition={ button2IconPosition }
						design={ button2Design !== '' ? button2Design : 'basic' }
					/>
				}
				{ showButton3 &&
					<ButtonEdit.Content
						className="ugb-button3"
						size={ button3Size !== '' ? button3Size : 'normal' }
						text={ button3Text }
						icon={ button3Icon }
						newTab={ button3NewTab !== '' && button3NewTab }
						url={ button3Url }
						noFollow={ button3NoFollow }
						hoverEffect={ button3HoverEffect }
						ghostToNormalEffect={ button3HoverGhostToNormal }
						shadow={ button3Shadow }
						iconPosition={ button3IconPosition }
						design={ button3Design !== '' ? button3Design : 'basic' }
					/>
				}
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withBlockStyles( createStyles ),
)( save )
