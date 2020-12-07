/**
 * External dependencies
 */
import {
	srcUrl, isPro, i18n, showProNotice,
} from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const DesignLayoutSelectorItem = ( {
	image,
	label,
	className,
	...otherProps
} ) => {
	const src = ! image ? '' :
	            image.match( /https?:/i ) ? image :
	            srcUrl ? `${ srcUrl }/${ image }` :
	            image

	const isLayoutPremium = otherProps.plan !== 'free'
	const isLocked = isLayoutPremium && ! isPro && showProNotice

	if ( isLayoutPremium && ! isPro && ! showProNotice ) {
		return null
	}

	const itemClassNames = classnames( [
		'ugb-design-layout-selector__item',
		className,
	], {
		'is-premium': otherProps.plan && ! isPro && otherProps.plan !== 'free',
		'is-locked': isLocked,
	} )

	const Tag = isLocked ? `div` : `button`

	return (
		<Tag
			className={ itemClassNames } { ...otherProps }
		>
			<div className="ugb-design-layout-selector__wrapper">
				{ isLocked &&
					<Icon className="ugb-design-layout-selector__lock" icon={ 'lock' } />
				}
				{ isLocked && (
					<a href="https://wpstackable.com/upgrade/?utm_source=design-library-learn-more&utm_campaign=learnmore&utm_medium=gutenberg"
						className="ugb-design-layout-selector__item-premium-button ugb-shadow-4 button button-secondary"
						target="_premium"
						title={ __( 'Learn More', i18n ) }
					>
						{ __( 'Learn More', i18n ) }
					</a>
				) }
				<img className="ugb-design-layout-selector__image" src={ src } alt={ label } />
			</div>
			<div className="ugb-design-layout-selector__label">{ label }</div>
		</Tag>
	)
}

DesignLayoutSelectorItem.defaultProps = {
	name: '',
	label: '',
	className: '',
}

export default DesignLayoutSelectorItem
