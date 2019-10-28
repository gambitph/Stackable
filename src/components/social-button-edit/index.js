/**
 * External dependencies
 */
import { ButtonEdit } from '~stackable/components'
import { SOCIAL_SITES } from '~stackable/util'
import { upperFirst } from 'lodash'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
export { default as SocialButtonEditHelper } from './helper'

const SocialButtonEdit = props => {
	return (
		<Fragment>
			{ Object.keys( SOCIAL_SITES ).map( socialId => {
				const buttonClasses = classnames( [
					'ugb-social-button',
					`ugb-button-${ socialId }`,
				], {
					'ugb-social-button--social-colors': props.useSocialColors,
				} )
				return ( ( props[ `show${ upperFirst( socialId ) }` ] === true || ( props[ `${ socialId }Url` ] && props[ `show${ upperFirst( socialId ) }` ] !== false ) ) &&
					<ButtonEdit
						key={ socialId }
						iconButton={ true }
						className={ buttonClasses }
						rel="noopener noreferrer nofollow"
						icon={ SOCIAL_SITES[ socialId ].icon }
						url={ props[ `${ socialId }Url` ] }
						onChangeUrl={ value => {
							// If email, add mailto: if not present.
							let url = value
							if ( socialId === 'email' ) {
								if ( url.match( /^[^:]+@./ ) ) {
									url = `mailto:${ url }`
								}
							}

							props[ `onChange${ upperFirst( socialId ) }Url` ]( url )
						} }
						onChangeNoFollow={ false }
						disableSuggestions={ true }

						{ ...props }
					/>
				)
			} ) }
		</Fragment>
	)
}

const socialDefaultProps = Object.keys( SOCIAL_SITES ).reduce( ( socialUrlProps, socialId ) => {
	return {
		...socialUrlProps,
		[ `${ socialId }Url` ]: '',
		[ `show${ upperFirst( socialId ) }` ]: null, // If true, button will always be shown even if without a URL.
													 // If false, button will never be shown even with a URL.
													 // If null, button will be shown only when there's a URL.
	}
}, {} )

SocialButtonEdit.defaultProps = {
	useSocialColors: true,
	...socialDefaultProps,
}

SocialButtonEdit.Content = props => {
	return (
		<Fragment>
			{ Object.keys( SOCIAL_SITES ).map( socialId => {
				const buttonClasses = classnames( [
					'ugb-social-button',
					`ugb-button-${ socialId }`,
				], {
					'ugb-social-button--social-colors': props.useSocialColors,
				} )

				return ( props[ `${ socialId }Url` ] && props[ `show${ upperFirst( socialId ) }` ] !== false &&
					<ButtonEdit.Content
						key={ socialId }
						className={ buttonClasses }
						iconButton={ true }
						rel="noopener noreferrer nofollow"
						icon={ SOCIAL_SITES[ socialId ].icon }
						url={ props[ `${ socialId }Url` ] }

						{ ...props }
					/>
				)
			} ) }
		</Fragment>
	)
}

const socialContentDefaultProps = Object.keys( SOCIAL_SITES ).reduce( ( socialUrlProps, socialId ) => {
	return {
		...socialUrlProps,
		[ `${ socialId }Url` ]: '',
		[ `show${ upperFirst( socialId ) }` ]: null, // If null or true, button will be shown if there is a URL.
		                                             // If false, button will not be shown even if there's a URL.
	}
}, {} )

SocialButtonEdit.Content.defaultProps = {
	useSocialColors: true,
	...socialContentDefaultProps,
}

export default SocialButtonEdit
