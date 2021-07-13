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

/**
 * Internal dependencies
 */
import { useDynamicContentControlProps, DynamicContentButton } from '../dynamic-content-control'

const LinkControl = props => {
	const classNames = classnames( [
		'stk-link-control',
		props.className,
	] )

	const [ dynamicContentProps, inputProps ] = useDynamicContentControlProps( props )

	const control = (
		<div className="stk-link-control__input">
			<_LinkControl
				value={ { url: props.value } }
				onChange={ ( { url } ) => props.onChange( url ) }
				settings={ [] } // The Url only.
				{ ...{
					...inputProps,
					...( Object.keys( inputProps ) ? {
						value: { url: inputProps.value },
						onChange: ( { url } ) => inputProps.onChange( url ),
						inputValue: inputProps.value,
					} : {} ),
				} }
			/>
		</div>
	)

	return (
		<Fragment>
			<BaseControl
				help={ props.help }
				className={ classNames }
				label={ props.label }
				screens={ props.screens }
			>
				{ props.dynamic ? (
					<div className="stk-dynamic-content-control">
						{ control }
						<DynamicContentButton { ...dynamicContentProps } />
					</div>
				) : control }
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
	dynamic: true,
}

export default LinkControl
