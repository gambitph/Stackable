/**
 * Internal dependencies
 */
import { BaseControl, Button } from '~stackable/components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const FontPairPicker = props => {
	const mainClasses = classnames( [
		props.className,
		'ugb-button-icon-control',
		'ugb-global-settings-font-pair-control',
	] )

	return (
		<div onClick={ props.onClick } ref={ props?.ref } role="button" tabIndex={ 0 } onKeyDown={ event => {
			if ( event.key === 'Enter' || event.key === 'Space' ) {
				props.onClick()
				event.preventDefault()
			}
		} } >
			<BaseControl
				key={ props.key }
				label={ props.label }
				className={ mainClasses }
			>
				{ props?.isCustom &&
					<div className="ugb-button-icon-control__wrapper">
						<Button
							className="ugb-button-icon-control__edit"
							label={ __( 'Edit', i18n ) }
							icon="edit"
							onClick={ event => {
								props.onEdit()
								event.stopPropagation()
							} }
						/>
					</div>
				}
			</BaseControl>
		</div>
	)
}

FontPairPicker.defaultProps = {
	label: '',
	classname: '',
	onClick: () => {},
	onEdit: () => {},
}

export default FontPairPicker
