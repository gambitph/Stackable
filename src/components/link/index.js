/**
 * External dependencies
 */
import classnames from 'classnames'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { forwardRef } from '@wordpress/element'

const Link = forwardRef( ( props, ref ) => {
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
			href="#0" // Disallow links in the editor
			{ ...propsToPass }
		>
			{ children }
		</TagName>
	)
} )

Link.defaultProps = {
	className: '',
	tagName: 'a',
}

Link.Content = props => {
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

Link.Content.defaultProps = {
	className: '',
	target: '',
	rel: '',
	href: '',
	tagName: 'a',
}

export default Link
