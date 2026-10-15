/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element'
import { getPropsWithDefaults } from '../../util/props'

const Link = forwardRef( ( incomingProps, ref ) => {
	const props = getPropsWithDefaults( incomingProps, LINK_DEFAULT_PROPS )
	const {
		children,
		className,
		tagName,
		...propsToPass
	} = props
	const classNames = classnames( [
		'stk-link',
		className,
	] )

	const TagName = tagName || 'a'

	return (
		<TagName
			ref={ ref }
			className={ classNames }
			href={ tagName === 'a' ? 'javascript:void(0)' : undefined } // Disallow links in the editor
			{ ...propsToPass }
		>
			{ children }
		</TagName>
	)
} )

const LINK_DEFAULT_PROPS = {
	className: '',
	tagName: 'a',
}

Link.Content = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, LINK_CONTENT_DEFAULT_PROPS )
	const className = classnames( [
		'stk-link',
		props.className,
	] )

	const propsToPass = omit( props, [ 'target', 'rel', 'tagName' ] )
	const TagName = props.tagName || 'a'

	if ( props.target ) {
		propsToPass.target = props.target
	}

	const rel = ( props.rel || '' ).split( ' ' ).filter( s => !! s )
	if ( props.target === '_blank' ) {
		if ( ! rel.includes( 'noreferrer' ) ) {
			rel.push( 'noreferrer' )
		}
		if ( ! rel.includes( 'noopener' ) ) {
			rel.push( 'noopener' )
		}
	}
	if ( rel.length ) {
		propsToPass.rel = rel.join( ' ' )
	}

	return (
		<TagName // eslint-disable-line jsx-a11y/anchor-has-content
			{ ...propsToPass }
			className={ className }
		/>
	)
}

const LINK_CONTENT_DEFAULT_PROPS = {
	className: '',
	target: '',
	rel: '',
	href: '',
	tagName: 'a',
}

export default Link
