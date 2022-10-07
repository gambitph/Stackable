/**
 * Internal dependencies
 */
import SVGImageIcon from './images/image.svg'
import AdvancedControl, { extractControlProps } from '../base-control2'
import DynamicContentControl, { useDynamicContentControlProps } from '../dynamic-content-control'
import { ResetButton } from '../base-control2/reset-button'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import {
	useAttributeName, useBlockAttributesContext, useBlockSetAttributesContext,
} from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { MediaUpload } from '@wordpress/block-editor'

const ImageControl = props => {
	const attributes = useBlockAttributesContext()
	const setAttributes = useBlockSetAttributesContext()
	const attrNameId = useAttributeName( `${ props.attribute }Id`, props.responsive, props.hover )
	const attrNameUrl = useAttributeName( `${ props.attribute }Url`, props.responsive, props.hover )
	const attrWidthAttribute = useAttributeName( `${ props.attribute }HeightAttribute`, props.responsive, props.hover )
	const attrHeightAttribute = useAttributeName( `${ props.attribute }WidthAttribute`, props.responsive, props.hover )
	const attrAlt = useAttributeName( `${ props.attribute }Alt`, props.responsive, props.hover )

	const _onChange = image => {
		setAttributes( {
			[ attrNameId ]: image.id,
			[ attrNameUrl ]: image.url,
			[ attrWidthAttribute ]: image.width || '',
			[ attrHeightAttribute ]: image.height || '',
			[ attrAlt ]: image.alt || '',
		} )
	}

	const onChange = typeof props.onChange !== 'undefined' ? props.onChange : _onChange

	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const onChangeReset = url => {
		return onChange( {
			url,
			id: '',
			width: '',
			height: '',
			alt: '',
		} )
	}

	const dynamicContentProps = useDynamicContentControlProps( {
		onChange: onChangeReset,
		value: attributes[ attrNameUrl ],
	} )

	const imageId = typeof props.imageId !== 'undefined' ? props.imageId : attributes[ attrNameId ]
	const imageUrl = typeof props.imageURL !== 'undefined' ? props.imageURL : dynamicContentProps.value || attributes[ attrNameUrl ]

	const type = imageUrl && imageUrl.match( /(mp4|webm|ogg)$/i ) ? 'video' : 'image'

	const onRemove = () => {
		onChange( {
			url: '',
			id: '',
			height: '',
			width: '',
			alt: '',
		} )
	}

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'ugb-image-control', props.className ) }
		>
			<DynamicContentControl
				enable={ props.isDynamic }
				type="image-url"
				{ ...dynamicContentProps }
			>
				<MediaUpload
					onSelect={ onChange }
					allowedTypes={ props.allowedTypes }
					value={ imageId }
					render={ obj => {
						return (
							<Fragment>
								{ imageUrl &&
									<div className="ugb-image-preview-wrapper">
										{ type === 'video' && (
											<video
												className="ugb-image-preview"
												autoPlay
												muted
												loop
												src={ imageUrl }
												onClick={ obj.open }
												onKeyDown={ event => {
													if ( event.keyCode === 13 ) {
														obj.open()
													}
												} }
											/>
										) }
										{ type === 'image' && (
										/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
											<img
												className="ugb-image-preview"
												draggable="false"
												src={ imageUrl }
												onClick={ obj.open }
												onKeyDown={ event => {
													if ( event.keyCode === 13 ) {
														obj.open()
													}
												} }
												alt={ __( 'preview', i18n ) }
											/>
										) }
									</div>
								}
								{ ! imageUrl && (
									<div
										className="ugb-placeholder"
										onClick={ obj.open }
										onKeyDown={ event => {
											if ( event.keyCode === 13 ) {
												obj.open()
											}
										} }
										role="button"
										tabIndex={ 0 }
									>
										<SVGImageIcon />
									</div>
								) }

							</Fragment>
						)
					} }
				/>
			</DynamicContentControl>
			<ResetButton
				allowReset={ props.allowReset && ! props.dynamic }
				value={ imageUrl }
				default={ props.default }
				onChange={ onRemove }
			/>
		</AdvancedControl>
	)
}

ImageControl.defaultProps = {
	label: '',

	attribute: '',
	allowedTypes: [ 'image' ],
	responsive: false,
	hover: false,
	isDynamic: true,

	value: undefined,
	onChange: undefined,
	allowReset: true,
}

export default ImageControl
