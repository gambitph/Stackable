/**
 * External dependencies
 */
import {
	srcUrl, isPro, i18n,
} from 'stackable'
import classnames from 'classnames'

/**
 * Wordpress dependencies
 */
import { Button, Icon } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useState } from '@wordpress/element'

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

	const [ showOverlay, setShowOverlay ] = useState( false )

	const itemClassNames = classnames( 'ugb-design-layout-selector__item', {
		[ className ]: className,
		[ `is-premium` ]: otherProps.plan && ! isPro && otherProps.plan !== 'free',
	} )

	const imageClasses = classnames( 'ugb-design-layout-selector__image', {
		[ `is-premium-img` ]: otherProps.plan && ! isPro && otherProps.plan !== 'free',
	} )

	const premiumTag = otherProps.plan && ! isPro && otherProps.plan !== 'free' && (
		<Icon icon={ 'lock' } />
	)

	return (
		<div
			className={ itemClassNames } { ...otherProps }
		>
			<div className="ugb-design-layout-selector__wrapper ugb-shadow-5"
				onMouseEnter={ () => {
					if ( ! isPro && otherProps.plan === 'premium' ) {
						setShowOverlay( true )
					}
				} }
				onMouseLeave={ () => {
					if ( ! isPro && otherProps.plan === 'premium' ) {
						setShowOverlay( false )
					}
				} }
			>
				{ premiumTag }
				<div className="overlay">
					{ showOverlay && (
						<span>
							<Button
								className="ugb-design-layout-selector__item-premium-button ugb-shadow-4"
								onClick={ () => window.open( 'https://wpstackable.com/upgrade/?utm_source=design-library-learn-more&utm_campaign=learnmore&utm_medium=gutenberg' ) }
							>{ __( 'Learn More', i18n ) }</Button>
						</span>
					) }
					<img className={ imageClasses } src={ src } alt={ label } />
				</div>
			</div>
			<h4 className="ugb-design-layout-selector__label">{ label }</h4>
		</div>
	)
}

DesignLayoutSelectorItem.defaultProps = {
	name: '',
	label: '',
	className: '',
}

export default DesignLayoutSelectorItem
