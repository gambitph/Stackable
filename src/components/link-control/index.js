/**
 * External dependencies
 */
import { BaseControl } from '~stackable/components'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element'
import { __experimentalLinkControl as _LinkControl } from '@wordpress/block-editor'

const LinkControl = props => {
	const classNames = classnames( [
		'stk-link-control',
		props.className,
	] )
	return (
		<Fragment>
			<BaseControl
				help={ props.help }
				className={ classNames }
				label={ props.label }
				screens={ props.screens }
			>
				<div className="stk-link-control__input">
					<_LinkControl
						value={ { url: props.value } }
						onChange={ ( { url } ) => props.onChange( url ) }
						settings={ [] } // The Url only.
					/>
				</div>
			</BaseControl>
		</Fragment>
	)
}

LinkControl.defaultProps = {
	className: '',
	label: '',
	screens: [ 'desktop' ],
	help: '',
	value: '',
	onChange: () => {},
	showSuggestions: true,
}

export default LinkControl
