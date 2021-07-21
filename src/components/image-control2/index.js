/**
 * Internal dependencies
 */
import SVGImageIcon from './images/image.svg'
import AdvancedControl, { extractControlProps } from '../base-control2'
import DynamicContentControl, { DynamicContentButton, useDynamicContentControlProps } from '../dynamic-content-control'
import { ResetButton } from '../base-control2/reset-button'

/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { useAttributeName, useBlockAttributes } from '~stackable/hooks'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Fragment, useCallback,
} from '@wordpress/element'
import { MediaUpload, useBlockEditContext } from '@wordpress/block-editor'
import { dispatch } from '@wordpress/data'

const ImageControl = props => {
	const { clientId } = useBlockEditContext()

	const attributes = useBlockAttributes( clientId )
	const attrNameId = useAttributeName( `${ props.attribute }Id`, props.responsive, props.hover )
	const attrNameUrl = useAttributeName( `${ props.attribute }Url`, props.responsive, props.hover )

	const _onChange = useCallback( ( { url, id } ) => {
		dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, {
			[ attrNameId ]: id,
			[ attrNameUrl ]: url,
		} )
	}, [ clientId, attrNameId, attrNameUrl ] )

	const onChange = typeof props.onChange !== 'undefined' ? props.onChange : _onChange

	const [ _propsToPass, controlProps ] = extractControlProps( props )

	const dynamicContentProps = useDynamicContentControlProps( { onChange: url => onChange( { url, id: '' } ), value: attributes[ attrNameUrl ] } )

	const imageId = typeof props.imageId !== 'undefined' ? props.imageId : attributes[ attrNameId ]
	const imageUrl = typeof props.imageURL !== 'undefined' ? props.imageURL : dynamicContentProps.value || attributes[ attrNameUrl ]

	const type = imageUrl && imageUrl.match( /(mp4|webm|ogg)$/i ) ? 'video' : 'image'

	const onRemove = useCallback( () => {
		onChange( {
			url: '',
			id: '',
		} )
	}, [ onChange ] )

	return (
		<AdvancedControl
			{ ...controlProps }
			className={ classnames( 'ugb-image-control', props.className ) }
		>
			<DynamicContentControl
				enable={ true }
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
				<DynamicContentButton { ...dynamicContentProps } />
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

	value: undefined,
	onChange: undefined,
	allowReset: true,
}

export default ImageControl
