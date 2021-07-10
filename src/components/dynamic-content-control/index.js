/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Button, Popover } from '@wordpress/components'
import {
	useState, Fragment, Children, cloneElement,
} from '@wordpress/element'
import {
	applyFilters,
} from '@wordpress/hooks'

/**
 * Internal dependencies
 */
import ProControl from '../pro-control'

const DynamicContentControl = props => {
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false )

	if ( ! isPro && ! showProNotice ) {
		return props.children
	}

	const DynamicContentFields = applyFilters( 'stackable.dynamic-content.component', props ) || Fragment

	const children = Children.toArray( props.children ).map( child => {
		return cloneElement( child, { disabled: props.value?.match( /\!#stk_dynamic:(.*)\!#/ ) } )
	} )

	return (
		<div className="stk-dynamic-content-control">
			{ children }
			<Button
				className="stk-dynamic-content-control__button"
				icon="admin-site-alt3"
				aria-haspopup="true"
				label={ __( 'Dynamic Fields', i18n ) }
				isSmall
				isTertiary
				onClick={ () => setIsPopoverOpen( ! isPopoverOpen ) }
				isPressed={ isPopoverOpen }
			/>
			{ isPopoverOpen && (
				<Popover
					position="bottom right"
					className="stackable-dynamic-content__popover"
				>
					{ ! isPro && (
						<ProControl
							title={ __( 'Say Hello to Dynamic Attributes', i18n ) }
							description={ __( 'Sample Description.', i18n ) }
						/>
					) }

					{ isPro && (
						<DynamicContentFields
							onClose={ () => setIsPopoverOpen( false ) }
							value={ props.value }
							onChange={ ( newValue, editorQueryString, frontendQueryString ) => {
								props.onChange( `!#stk_dynamic:${ frontendQueryString }!#` )
							} }
						/>
					) }

				</Popover>
			) }
		</div>
	)
}

DynamicContentControl.defaultProps = {
	children: null,
}

export default DynamicContentControl
