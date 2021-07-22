import classnames from 'classnames'
import { omit } from 'lodash'

const Link = props => {
	const {
		children,
		className,
		...propsToPass
	} = props
	const classNames = classnames( [
		'stk-link',
		className,
	] )

	return (
		<a
			className={ classNames }
			href="#0" // Disallow links in the editor
			{ ...propsToPass }
		>
			{ children }
		</a>
	)
}

Link.defaultProps = {
	className: '',
}

Link.Content = props => {
	const className = classnames( [
		'stk-link',
		props.className,
	] )

	const propsToPass = omit( props, [ 'target', 'rel' ] )

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
		<a // eslint-disable-line jsx-a11y/anchor-has-content
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
}

export default Link
