/**
 * We use our own button component to preserve our own styles.
 */

/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Button as Button_ } from '@wordpress/components'
import { forwardRef } from '@wordpress/element'

const Button = ( props, ref ) => {
	const className = classnames( [
		props.className,
		'ugb-button-component',
	] )
	return <Button_ { ...props } className={ className } ref={ ref } />
}

export default forwardRef( Button )
