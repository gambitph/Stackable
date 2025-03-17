/**
 * Internal dependencies
 */
import { BaseControl, Button } from '~stackable/components'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import classNames from 'classnames'
import { loadGoogleFont } from '~stackable/util'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

const FontPairPicker = props => {
	const headingStyles = props.fontPair?.typography?.h1 || {}
	const paragraphStyles = props.fontPair?.typography?.p || {}
	if ( headingStyles.fontFamily ) {
		loadGoogleFont( headingStyles.fontFamily )
	}
	if ( paragraphStyles?.fontFamily ) {
		loadGoogleFont( paragraphStyles.fontFamily )
	}

	const label = (
		<div>
			<span
				style={ omit( { ...headingStyles }, [ 'fontSize', 'lineHeight' ] ) }
				className="ugb-global-settings-font-pair__label"
			>
				{ headingStyles?.fontFamily ? headingStyles.fontFamily : __( 'Default Heading', i18n ) }
			</span>
			<span
				style={ omit( { ...paragraphStyles }, [ 'fontSize', 'lineHeight' ] ) }
				className="ugb-global-settings-font-pair__sub-label"
			>
				{ paragraphStyles?.fontFamily ? paragraphStyles?.fontFamily : __( 'Default Body', i18n ) }
			</span>
		</div>
	)

	const classes = classNames( [
		'ugb-button-icon-control',
		'ugb-global-settings-font-pair-control',
		{ 'ugb-global-settings-font-pair__selected': props?.isSelected },
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
				label={ label }
				className={ classes }
			>
				{ props?.isCustom &&
					<div className="ugb-button-icon-control__wrapper">
						<Button
							className="ugb-button-icon-control__edit"
							label={ __( 'Edit', i18n ) }
							icon="edit"
							isSmall
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
	key: '',
	fontPair: {},
	isSelected: false,
	onClick: () => {},
	onEdit: () => {},
}

export default FontPairPicker
