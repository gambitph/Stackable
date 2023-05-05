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

const noop = () => {}

const scrollIntoViewIfNeeded = el => {
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
}

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
		id = '', // Used for remembering whether this is currently open or closed
		// Toggle options.
		checked,
		hasToggle = undefined,
		onChange = noop,
		isPremiumPanel = false,
	},
	ref
) => {
	const { name } = useBlockEditContext()
	const [ isOpened, setIsOpened ] = useGlobalState( `panelCache-${ name }-${ id }-${ title }`, initialOpen === undefined ? false : initialOpen )

	const nodeRef = useRef()

	const handleOnToggle = event => {
		event.preventDefault()
		const newIsOpened = ! isOpened
		setIsOpened( newIsOpened )
		onToggle( newIsOpened )

		// If just opened, scroll into view if needed.
		if ( newIsOpened ) {
			setTimeout( () => {
				scrollIntoViewIfNeeded( nodeRef.current )
			}, 1 )
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
		isOpened, icon, title, isPremiumPanel,
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
