/**
 * External dependencies
 */
import { srcUrl, isPro } from 'stackable'
import classnames from 'classnames'

/**
 * Wordpress dependencies
 */
import { Button, Icon } from '@wordpress/components'

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

	const itemClassNames = classnames( 'ugb-design-layout-selector__item', {
		[ className ]: className,
	} )
	const imgClassNames = classnames( 'ugb-design-layout-selector__image', {
		'is-premium': ! isPro && otherProps.plan === 'premium',
	} )
	const iconClassNames = classnames( 'ugb-design-layout-selector__lock-icon', {
		'is-premium': ! isPro && otherProps.plan === 'premium',
	} )

	const premiumTag = otherProps.plan && ! isPro && otherProps.plan !== 'free' && (
		<span className="ugb-design-layout-selector__premium">{ otherProps.plan }</span>
	)

	const renderLabel = label && <span className="ugb-design-layout-selector__label">{ label }</span>

	const lockIcon = ! isPro && otherProps.plan === 'premium' && <Icon className={ iconClassNames } icon="lock" />

	return (
		<li className={ itemClassNames } { ...otherProps }>
			<Button className="ugb-design-layout-selector__item-button" disabled={ ! isPro && otherProps.plan === 'premium' }>
				{ src && <img className={ imgClassNames } src={ src } alt={ label } /> }
				{ lockIcon }
				{ premiumTag }
			</Button>
			{ renderLabel }
		</li>
	)
}

DesignLayoutSelectorItem.defaultProps = {
	name: '',
	label: '',
	className: '',
}

export default DesignLayoutSelectorItem
