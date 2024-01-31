/**
 * External dependencies
 */
import classnames from 'classnames'

/**
 * Internal dependencies
 */
import { useGlobalState } from '~stackable/util/global-state'

/**
 * WordPress dependencies
 */
import { useMergeRefs } from '@wordpress/compose'
import { forwardRef, useRef } from '@wordpress/element'
import { chevronUp, chevronDown } from '@wordpress/icons'
import {
	Button, Icon, FormToggle,
} from '@wordpress/components'
import { useBlockEditContext } from '@wordpress/block-editor'
import { debounce } from 'lodash'

const noop = () => {}

// Debounced so this can be called multiple times by the closing panel and
// opening panel and it will only scroll once.
const scrollIntoViewIfNeeded = debounce( el => {
	if ( el ) {
		// 200 is an estimate of the top of the panel when it will be hidden from view.
		const isAboveView = el.getBoundingClientRect().top < 200
		if ( isAboveView ) {
			el.scrollIntoView( {
				inline: 'start',
				block: 'start',
				behavior: 'instant',
			} )
		}
	}
}, 0, { leading: false, trailing: true } ) // We use 0 here because it works and it minimizes the screen blinking.

const PanelBody = (
	{
		buttonProps = {},
		children,
		className,
		icon,
		initialOpen,
		onToggle = noop,
		// opened,
		isOpen: isForcedOpen = null, // Override whether the panel should be open or closed based on this prop.
		title,
		id = '', // Used for remembering whether this is currently open or closed
		// Toggle options.
		checked,
		hasToggle = undefined,
		onChange = noop,
		isPremiumPanel = false,
		showModifiedIndicator = false,
	},
	ref
) => {
	const { name } = useBlockEditContext()
	const [ _isOpened, setIsOpened ] = useGlobalState( `panelCache-${ name }-${ id }-${ title }`, initialOpen === undefined ? false : initialOpen )

	const isOpened = isForcedOpen === null ? _isOpened : isForcedOpen

	const nodeRef = useRef()

	const handleOnToggle = event => {
		event.preventDefault()
		const newIsOpened = ! isOpened
		setIsOpened( newIsOpened )
		onToggle( newIsOpened )

		// Scroll into view if needed.  This is called twice (first on the panel
		// being closed, and second on the panel that's being openeed) we have
		// debounced this so that the function is only called once, there's a
		// delay on the open so that it's called last (and the first call on the
		// panel that's being closed doesn't run).
		if ( ! newIsOpened ) {
			scrollIntoViewIfNeeded( nodeRef.current )
		} else {
			setTimeout( () => {
				scrollIntoViewIfNeeded( nodeRef.current )
			}, 0 ) // We use 0 here because it works and it minimizes the screen blinking.
		}
	}

	const classes = classnames( 'components-panel__body', 'ugb-toggle-panel-body', className, {
		'is-opened': isOpened,
		[ `ugb-panel--${ id }` ]: id,
		'stk--premium-panel': isPremiumPanel,
	} )

	return (
		<div className={ classes } ref={ useMergeRefs( [ nodeRef, ref ] ) }>
			<PanelBodyTitle
				icon={ icon }
				isOpened={ isOpened }
				onClick={ handleOnToggle }
				title={ title }
				checked={ checked }
				hasToggle={ typeof hasToggle === 'undefined' ? !! onChange : hasToggle }
				onChange={ onChange }
				setIsOpened={ setIsOpened }
				isPremiumPanel={ isPremiumPanel }
				showModifiedIndicator={ showModifiedIndicator }
				{ ...buttonProps }
			/>
			{ typeof children === 'function'
				? children( { opened: true } )
				: children }
		</div>
	)
}

const PanelBodyTitle = forwardRef(
	( {
		isOpened, icon, title, isPremiumPanel, showModifiedIndicator,
		checked, hasToggle, onChange, setIsOpened, // For the toggle.
		...props
	}, ref ) => {
		if ( ! title ) {
			return null
		}

		return (
			<h2 className="components-panel__body-title">
				<Button
					className="components-panel__body-toggle stk-panel"
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
					<span className={ classnames( [
						'stk-panel-modified-indicator',
						{ 'stk--visible': showModifiedIndicator },
					] ) } />
					{ isPremiumPanel && (
						<div className="stk-pulsating-circle" />
					) }
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
