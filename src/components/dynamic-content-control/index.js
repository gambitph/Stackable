/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import {
	isString, first,
} from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button, Popover, TextControl,
} from '@wordpress/components'
import {
	useState, Fragment, useCallback, useEffect,
} from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

/**
 * Internal dependencies
 */
import ProControl from '../pro-control'
import SVGDatabaseIcon from './icons/database-light.svg'
import { ResetButton } from '../base-control2/reset-button'

/**
 * Custom hook for generating component props
 * for the DynamicContentButton.
 *
 * Usage:
 * ```
 * const dynamicContentControlProps = useDynamicContentControlProps( props )
 *
 * return (
 *    <DynamicContentControl { ...dynamicContentControlProps } />
 * )
 * ```
 *
 * @param {Object} props parent component props.
 * @return {Object} control props for DynamicContentControl.
 */
export const useDynamicContentControlProps = props => {
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false )

	// Debounce the value for performance.
	const [ debouncedValue, setDebouncedValue ] = useState( props.value )

	const clickOutsideListener = useCallback( event => {
		if ( isPopoverOpen ) {
			if (
				! event.target.closest( '.stackable-dynamic-content__popover' ) &&
				! event.target.closest( '.stackable-dynamic-content__popover' )
			) {
				setIsPopoverOpen( false )
			}
		}
	} )

	useEffect( () => {
		document.body.addEventListener( 'click', clickOutsideListener )
		return () => document.body.removeEventListener( 'click', clickOutsideListener )
	}, [ clickOutsideListener ] )

	useEffect( () => {
		const timeout = setTimeout( () => {
			setDebouncedValue( props.value )
		}, 300 )

		return () => clearTimeout( timeout )
	}, [ props.value ] )

	const activeAttributes = []

	if ( debouncedValue?.includes?.( '!#stk_dynamic' ) ) {
		debouncedValue
			.match( /\!#stk_dynamic:(.*)\!#/g )
			?.forEach( match => {
				const value = match
					.replace( /\!#/g, '' )
					.replace( 'stk_dynamic:', '' )

				activeAttributes.push( value )
			} )
	}

	if ( debouncedValue?.includes?.( 'data-stk-dynamic="' ) ) {
		debouncedValue
			.match( /data-stk-dynamic="[^"]*"/g )
			?.forEach( match => {
				const value = match.match( /data-stk-dynamic="(.*?(?="))"/g )?.[ 0 ]
					?.replace( /"/g, '' )
					?.replace( 'data-stk-dynamic=', '' )

				if ( value ) {
					activeAttributes.push( value )
				}
			} )
	}

	const value = useDynamicContent( debouncedValue )
	const placeholder = useValueWithFieldsTitle( debouncedValue )

	const isPressed = isPopoverOpen || activeAttributes.length
	const activeAttribute = first( activeAttributes ) || ''

	const onChange = useCallback( ( newValue, editorQueryString, frontendQueryString ) => {
		// If `isFormatType` is true, the onChange function will generate a `stackable/dynamic-content` format type.
		props.onChange(
			props.isFormatType
				? `<span data-stk-dynamic="${ frontendQueryString }" contenteditable="false" class="stk-dynamic-content">${ newValue }</span>`
				: `!#stk_dynamic:${ frontendQueryString }!#`
		)

		setIsPopoverOpen( false )
	}, [ props.isFormatType, props.onChange ] )

	if ( ! isPro ) {
		return {}
	}

	return {
		onClick: () => setIsPopoverOpen( ! isPopoverOpen ),
		isPressed,
		isPopoverOpen,
		value,
		placeholder,
		onClose: () => setIsPopoverOpen( false ),
		onReset: () => props.onChange( '' ),
		onChange,
		activeAttribute,
	}
}

/**
 * Custom hook for parsing the dynamic content field data
 * in a string.
 *
 * @example
 * ```
 * const value = useDynamicContent( 'Post Title: !#stk_dynamic:current-page/post-title!#' )
 * // returns `Post Title: The actual post title`
 * ```
 * @param {string} value
 */
export const useDynamicContent = ( value = '' ) => {
	return useSelect( select => {
		if ( ! select( 'stackable/dynamic-content' ) ) {
			return value
		}

		if ( ! isString( value ) ) {
			return value
		}

		return select( 'stackable/dynamic-content' ).parseDynamicContents( value )
	} )
}

/**
 * Custom hook for parsing all dynamic content inside of a text
 * and changing it to its Field Title.
 *
 * @example
 * ```
 * const fieldName = useValueWithPostTitle( 'Post title: !#stk_dynamic:current-page/post-title' )
 * // returns `Post title: [Post Title]`
 * ```
 *
 * @param {string} value
 */

export const useValueWithFieldsTitle = ( value = '' ) => {
	return useSelect( select => {
		if ( ! select( 'stackable/dynamic-content' ) ) {
			return value
		}

		let newValue = value
		if ( value?.includes?.( '!#stk_dynamic' ) ) {
			newValue = newValue.replace( /\!#stk_dynamic:(.*)\!#/g, match => {
				const field = match.replace( /\!#/g, '' ).replace( 'stk_dynamic:', '' )
				const fieldTitle = first( select( 'stackable/dynamic-content' ).getFieldTitle( field ) )
				return fieldTitle ? `[${ fieldTitle }]` : '[]'
			} )
		}

		if ( value?.includes?.( 'data-stk-dynamic="' ) ) {
			newValue = newValue.replace( /<span[^\>]+data-stk-dynamic="[^>"]*"[^\>]*>(.*?)<\/span>/g, match => {
				const field = match.match( /data-stk-dynamic="(.*?(?="))"/g )?.[ 0 ]
					?.replace( /"/g, '' )
					?.replace( 'data-stk-dynamic=', '' )

				if ( value ) {
					const fieldTitle = first( select( 'stackable/dynamic-content' ).getFieldTitle( field ) )
					return fieldTitle ? `[${ fieldTitle }]` : '[]'
				}
				return match
			} )
		}

		return newValue
	} )
}

export const DynamicContentFields = applyFilters( 'stackable.dynamic-content.component' ) || Fragment

export const DynamicContentButton = props => {
	if ( ! isPro && ! showProNotice ) {
		return null
	}

	return (
		<Fragment>
			<Button
				className="stk-dynamic-content-control__button"
				icon={ <SVGDatabaseIcon /> }
				aria-haspopup="true"
				label={ __( 'Dynamic Fields', i18n ) }
				isSmall
				isTertiary
				onClick={ props.onClick }
				isPressed={ !! props.isPressed }
			/>
			{ props.isPopoverOpen && (
				<Popover
					position="top right"
					className="stackable-dynamic-content__popover"
				>
					{ ! isPro && (
						<ProControl
							title={ __( 'Say Hello to Dynamic Attributes 👋', i18n ) }
							description={ __( 'Add dynamic values to your Stackable blocks. This feature is only available on Stackable Premium.', i18n ) }
						/>
					) }

					{ isPro && (
						<DynamicContentFields
							onClose={ props.onClose }
							onChange={ props.onChange }
							activeAttribute={ props.activeAttribute }
							type={ props.type }
						/>
					) }

				</Popover>
			) }
		</Fragment>
	)
}

const DynamicContentControl = ( {
	children, enable, ...otherProps
} ) => {
	if ( ! enable ) {
		return children
	}

	const hasDynamicContent = otherProps.activeAttribute !== ''

	return (
		<Fragment>
			<div className="stk-dynamic-content-control">
				{ ! hasDynamicContent ? children : (
					<TextControl
						value={ otherProps.placeholder }
						disabled={ true }
					/>
				) }
				<DynamicContentButton { ...otherProps } />
			</div>
			<ResetButton
				allowReset={ true }
				value={ otherProps.activeAttribute }
				default=""
				onChange={ otherProps.onReset }
			/>
		</Fragment>
	)
}

DynamicContentControl.defaultProps = {
	enable: false,
	children: null,
	activeAttribute: '',
	onReset: () => {},
}

export default DynamicContentControl
