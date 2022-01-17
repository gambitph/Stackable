/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import {
	isString, first,
} from 'lodash'
import classnames from 'classnames'
import { QueryLoopContext } from '~stackable/higher-order/with-query-loop-context'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import {
	Button, Popover, TextControl,
} from '@wordpress/components'
import {
	useState, Fragment, useCallback, useEffect, useContext,
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
				! event.target.closest( '.stk-dynamic-content-control__button' )
			) {
				setIsPopoverOpen( false )
			}
		}
	} )

	useEffect( () => {
		document.body.addEventListener( 'mousedown', clickOutsideListener )
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
			.match( /\!#stk_dynamic\/(.*)\!#/g )
			?.forEach( match => {
				const value = match
					.replace( /\!#/g, '' )
					.replace( 'stk_dynamic/', '' )

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
		const willChangeValue = props.isFormatType
			? `<span data-stk-dynamic="${ frontendQueryString }" contenteditable="false" class="stk-dynamic-content">${ newValue }</span>`
			: `!#stk_dynamic/${ frontendQueryString }!#`

		props.onChange( willChangeValue )
		setDebouncedValue( willChangeValue )

		setIsPopoverOpen( false )
	}, [ props.isFormatType, props.onChange ] )

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
 * const value = useDynamicContent( 'Post Title: !#stk_dynamic/current-page/post-title!#' )
 * // returns `Post Title: The actual post title`
 * ```
 * @param {string} value
 */
export const useDynamicContent = ( value = '' ) => {
	const queryLoopContext = useContext( QueryLoopContext )
	return useSelect( select => {
		if ( ! select( 'stackable/dynamic-content' ) ) {
			return value
		}

		if ( ! isString( value ) ) {
			return value
		}

		if ( ! value.includes( '!#stk_dynamic' ) && ! value.includes( 'data-stk-dynamic' ) ) {
			return value
		}

		const currentPostId = select( 'core/editor' )?.getCurrentPostId() || -1

		let tempValue = value

		// If we're being used in a Query Loop, then check if we need to change the display value to match the given post Id.
		if ( currentPostId !== -1 && queryLoopContext?.postId && queryLoopContext.postId !== currentPostId ) {
			// Replace all post IDS.
			tempValue = tempValue?.replace( /<span[^\>]+data-stk-dynamic=[^\>]*>(.*?)<\/span>/g, value => {
				const dataFieldString = value.match( /data-stk-dynamic="([^\"]*)"/ )[ 1 ]
				const splitFieldString = dataFieldString.split( '/' )
				if ( ! dataFieldString.startsWith( 'current-page' ) ) {
					return value
				}

				if ( splitFieldString.length > 2 && splitFieldString[ 2 ].startsWith( '?' ) ) {
					splitFieldString.splice( 2, 0, queryLoopContext.postId.toString() )
				} else if ( splitFieldString.length === 2 ) {
					splitFieldString.push( queryLoopContext.postId.toString() )
				}

				return value.replace(
					/data-stk-dynamic="[^\"]*"/g,
					'data-stk-dynamic="' + splitFieldString.join( '/' ) + '"'
				)
			} )

			tempValue = tempValue?.replace( /!#stk_dynamic(.*)\!#/g, value => {
				const dataFieldString = value.replace( /\!#/g, '' ).replace( 'stk_dynamic/', '' )
				const splitFieldString = dataFieldString.split( '/' )
				if ( ! dataFieldString.startsWith( 'current-page' ) ) {
					return value
				}

				if ( splitFieldString.length > 2 ) {
					splitFieldString.splice( 2, 0, queryLoopContext.postId.toString() )
				} else if ( splitFieldString.length === 2 ) {
					splitFieldString.push( queryLoopContext.postId.toString() )
				}

				return '!#stk_dynamic/' + splitFieldString.join( '/' ) + '!#'
			} )
		}

		/**
		 * A simple trick for subscribing to post changes.
		 */
		select( 'core/editor' )?.getPostEdits()

		return select( 'stackable/dynamic-content' ).parseDynamicContents( tempValue )
	}, [ value, queryLoopContext ] )
}

/**
 * Custom hook for parsing all dynamic content inside of a text
 * and changing it to its Field Title.
 *
 * @example
 * ```
 * const fieldName = useValueWithPostTitle( 'Post title: !#stk_dynamic/current-page/post-title' )
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
			newValue = newValue.replace( /\!#stk_dynamic\/(.*)\!#/g, match => {
				const field = match.replace( /\!#/g, '' ).replace( 'stk_dynamic/', '' )
				let fieldTitle = first( select( 'stackable/dynamic-content' ).getFieldTitle( field ) )

				if ( ! fieldTitle ) {
					// If the field title doesn't exist, get the field slug instead.
					const fieldData = new URL( `stk:${ field }` )
					fieldTitle = fieldData.pathname.split( '/' )?.[ 1 ]
				}

				return fieldTitle ? `[${ fieldTitle }]` : ''
			} )
		}

		if ( value?.includes?.( 'data-stk-dynamic="' ) ) {
			newValue = newValue.replace( /<span[^\>]+data-stk-dynamic="[^>"]*"[^\>]*>(.*?)<\/span>/g, match => {
				const field = match.match( /data-stk-dynamic="(.*?(?="))"/g )?.[ 0 ]
					?.replace( /"/g, '' )
					?.replace( 'data-stk-dynamic=', '' )

				if ( value ) {
					let fieldTitle = first( select( 'stackable/dynamic-content' ).getFieldTitle( field ) )

					if ( ! fieldTitle ) {
						// If the field title doesn't exist, get the field slug instead.
						const fieldData = new URL( `stk:${ field }` )
						fieldTitle = fieldData.pathname.split( '/' )?.[ 1 ]
					}

					return fieldTitle ? `[${ fieldTitle }]` : ''
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

	const classNames = classnames( [
		'stk-dynamic-content-control',
	], {
		'stk--has-dynamic-content': hasDynamicContent,
	} )

	return (
		<Fragment>
			<div className={ classNames }>
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
