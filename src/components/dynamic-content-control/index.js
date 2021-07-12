/**
 * External dependencies
 */
import {
	i18n, isPro, showProNotice,
} from 'stackable'
import striptags from 'striptags'
import { isString } from 'lodash'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Button, Popover } from '@wordpress/components'
import {
	useState, Fragment, useCallback, useEffect,
} from '@wordpress/element'
import {
	applyFilters,
} from '@wordpress/hooks'
import { useSelect } from '@wordpress/data'

/**
 * Internal dependencies
 */
import ProControl from '../pro-control'

/**
 * Custom hook for generating component props
 * for the DynamicContentButton and the selected
 * input component.
 *
 * Usage:
 * ```
 * const [ dynamicContentControlProps, inputProps ] = useDynamicContentControlProps( props )
 *
 * return (
 *  <>
 *    <DynamicContentButton { ...dynamicContentControlProps } />
 *    <ControlComponent { ...inputProps } />
 *  </>
 * )
 * ```
 *
 * @param {Object} props parent component props.
 * @return {Array} control props for both DynamicContentButton and input component.
 */
export const useDynamicContentControlProps = props => {
	const [ isPopoverOpen, setIsPopoverOpen ] = useState( false )
	/**
	 * When the user is premium, the value prop passed inside the
	 * input component will be the actual dynamic content value.
	 */
	const value = useSelect( select => {
		// If user is not premium, `stackable/dynamic-content` store is inaccessible.
		if ( ! select( 'stackable/dynamic-content' ) ) {
			props.value
		}

		if ( ! isString( props.value ) ) {
			return props.value
		}

		return striptags(
			props.value.replace( /\!#stk_dynamic(.*)\!#/g, value => {
				return select( 'stackable/dynamic-content' ).getDynamicContent(
					value.replace( /\!#/g, '' ).replace( 'stk_dynamic:', '' )
				)
			} )
		)
	}, [ props.value ] )

	const clickOutsideListener = useCallback( event => {
		if ( isPopoverOpen ) {
			if ( ! event.target.closest( '.stackable-dynamic-content__popover' ) && ! event.target.closest( '.stackable-dynamic-content__popover' ) ) {
				setIsPopoverOpen( false )
			}
		}
	} )

	// Assign the outside click listener.
	useEffect( () => {
		document.body.addEventListener( 'click', clickOutsideListener )
		return () => document.body.removeEventListener( 'click', clickOutsideListener )
	}, [ clickOutsideListener ] )

	const onChange = useCallback( ( newValue, editorQueryString, frontendQueryString ) => {
		// If `isFormatType` is true, the onChange function will generate a `stackable/dynamic-content` format type.
		if ( props.isFormatType ) {
			props.onChange( `<span data-stk-dynamic="${ frontendQueryString }" contenteditable="false" class="stk-dynamic-content">${ newValue }</span>` )
			return
		}

		props.onChange( `!#stk_dynamic:${ frontendQueryString }!#` )
	}, [ props.isFormatType ] )

	return [
		// Dynamic Button Props.
		{
			onClick: () => setIsPopoverOpen( ! isPopoverOpen ),
			isPressed: isPopoverOpen || props.value?.match( /\!#stk_dynamic:(.*)\!#/ ) || props.value?.match( /data-stk-dynamic="(.*?(?="))"/ ),
			isPopoverOpen,
			value: props.value,
			onClose: () => setIsPopoverOpen( false ),
			onChange,
			activeAttribute: props.value?.match( /\!#stk_dynamic:(.*)\!#/ )
				? props.value.match( /\!#stk_dynamic:(.*)\!#/g )[ 0 ]?.replace( /\!#/g, '' ).replace( 'stk_dynamic:', '' )
				: props.value?.match( /data-stk-dynamic="(.*?(?="))"/ )
					? props.value?.match( /data-stk-dynamic="(.*?(?="))"/ )[ 0 ].replace( /"/g, '' ).replace( 'data-stk-dynamic=', '' )
					: '',
		},
		// Input Props.
		{
			disabled: props.value?.match( /\!#stk_dynamic:(.*)\!#/ ) || props.value?.match( /data-stk-dynamic="(.*?(?="))"/ ),
			value,
		},
	]
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
				icon="database"
				aria-haspopup="true"
				label={ __( 'Dynamic Fields', i18n ) }
				isSmall
				isTertiary
				onClick={ props.onClick }
				isPressed={ props.isPressed }
			/>
			{ props.isPopoverOpen && (
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
							onClose={ props.onClose }
							value={ props.value }
							onChange={ props.onChange }
							activeAttribute={ props.activeAttribute }
						/>
					) }

				</Popover>
			) }
		</Fragment>
	)
}
