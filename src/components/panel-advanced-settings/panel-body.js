/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import { useUpdateEffect } from './utils'
import { useGlobalState } from '~stackable/util/global-state'

/**
 * WordPress dependencies
 */
import { useReducedMotion, useMergeRefs } from '@wordpress/compose'
import { forwardRef, useRef } from '@wordpress/element'
import { chevronUp, chevronDown } from '@wordpress/icons'
import {
	Button, Icon, FormToggle,
} from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'

const noop = () => {}

const PanelBody = (
	{
		buttonProps = {},
		children,
		className,
		icon,
		initialOpen,
		onToggle = noop,
		// opened,
		title,
		scrollAfterOpen = true,
		id = '', // Used for remembering whether this is currently open or closed
		// Toggle options.
		checked,
		hasToggle = false,
		onChange = noop,
	},
	ref
) => {
	const { name } = useBlockEditContext()
	const [ isOpened, setIsOpened ] = useGlobalState( `panelCache-${ name }-${ id }-${ title }`, initialOpen === undefined ? false : initialOpen )

	const nodeRef = useRef()

	// Defaults to 'smooth' scrolling
	// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
	const scrollBehavior = useReducedMotion() ? 'auto' : 'smooth'

	const handleOnToggle = event => {
		event.preventDefault()
		const next = ! isOpened
		setIsOpened( next )
		onToggle( next )
	}

	// Ref is used so that the effect does not re-run upon scrollAfterOpen changing value.
	const scrollAfterOpenRef = useRef()
	scrollAfterOpenRef.current = scrollAfterOpen
	// Runs after initial render.
	useUpdateEffect( () => {
		if (
			isOpened &&
			scrollAfterOpenRef.current &&
			nodeRef.current?.scrollIntoView
		) {
			/*
			 * Scrolls the content into view when visible.
			 * This improves the UX when there are multiple stacking <PanelBody />
			 * components in a scrollable container.
			 */
			setTimeout( () => {
				nodeRef?.current?.scrollIntoView( {
					inline: 'nearest',
					block: 'start',
					behavior: scrollBehavior,
				} )
			}, 1 )
		}
	}, [ isOpened, scrollBehavior ] )

	const classes = classnames( 'components-panel__body', 'ugb-toggle-panel-body', className, {
		'is-opened': isOpened,
		[ `ugb-panel--${ id }` ]: id,
	} )

	return (
		<div className={ classes } ref={ useMergeRefs( [ nodeRef, ref ] ) }>
			<PanelBodyTitle
				icon={ icon }
				isOpened={ isOpened }
				onClick={ handleOnToggle }
				title={ title }
				checked={ checked }
				hasToggle={ hasToggle }
				onChange={ onChange }
				setIsOpened={ setIsOpened }
				{ ...buttonProps }
			/>
			{ typeof children === 'function'
				? children( { opened: isOpened } )
				: isOpened && children }
		</div>
	)
}

const PanelBodyTitle = forwardRef(
	( {
		isOpened, icon, title,
		checked, hasToggle, onChange, setIsOpened, // For the toggle.
		...props
	}, ref ) => {
		if ( ! title ) {
			return null
		}

		return (
			<h2 className="components-panel__body-title">
				<Button
					className="components-panel__body-toggle"
					aria-expanded={ isOpened }
					ref={ ref }
					{ ...props }
				>
					{ /*
					Firefox + NVDA don't announce aria-expanded because the browser
					repaints the whole element, so this wrapping span hides that.
				*/ }
					<span aria-hidden="true">
						<Icon
							className="components-panel__arrow"
							icon={ isOpened ? chevronUp : chevronDown }
						/>
					</span>
					{ hasToggle && (
						<FormToggle
							className="ugb-toggle-panel-form-toggle"
							checked={ checked }
							onClick={ ev => {
								ev.stopPropagation()
								ev.preventDefault()
								if ( checked && isOpened ) {
								// Comment this out since it jumps the inspector.
								// this.onToggle()
								} else if ( ! checked && ! isOpened ) {
									setIsOpened( isOpen => ! isOpen )
								}
								if ( onChange ) {
									onChange( ! checked )
								}
							} }
							aria-describedby={ title }
						/>
					) }
					{ title }
					{ icon && (
						<Icon
							icon={ icon }
							className="components-panel__icon"
							size={ 20 }
						/>
					) }
				</Button>
			</h2>
		)
	}
)

const ForwardedComponent = forwardRef( PanelBody )
ForwardedComponent.displayName = 'PanelBody'

export default ForwardedComponent
