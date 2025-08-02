import { i18n } from 'stackable'
import classNames from 'classnames'

import {
	Modal, Flex, Button,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import {
	Icon, arrowRight, arrowLeft,
} from '@wordpress/icons'
import {
	useEffect, useState, useCallback, useRef, useMemo,
} from '@wordpress/element'

const STEPS = [
	{
		title: '👋 ' + __( 'Welcome to Your Design Library', i18n ),
		description: __( 'These are pre-built designs that are style-matched to your block theme. You can insert one or more patterns to quickly build your page.', i18n ),
		size: 'medium',
	},
	{
		title: __( 'Pick Styling Options', i18n ),
		description: __( 'Turn on backgrounds, change color schemes, to customize the library. Go ahead and click on "Section Background" and see your changes in real-time.', i18n ),
		anchor: '.ugb-modal-design-library__enable-background',
		position: 'right',
		nextEventTarget: '.ugb-modal-design-library__enable-background',
		ctaLabel: __( 'Enable Background', i18n ),
		ctaOnClick: () => {
			const element = document.querySelector( '.ugb-modal-design-library__enable-background .components-form-toggle__input' )
			element?.click()
		},
		// showNext: false,
	},
	{
		title: __( 'Patterns and Full-Pages', i18n ),
		description: __( 'Click here to switch between patterns and full-page layouts.', i18n ),
		anchor: '.ugb-modal-design-library .components-modal__header',
		position: 'bottom',
	},
]

const NOOP = () => {}

const ModalTour = props => {
	const {
		steps = STEPS,
		onClose = NOOP,
	} = props

	const [ currentStep, setCurrentStep ] = useState( 0 )
	const [ isVisible, setIsVisible ] = useState( false )
	const [ isVisibleDelayed, setIsVisibleDelayed ] = useState( false )
	const [ forceRefresh, setForceRefresh ] = useState( 0 )
	const modalRef = useRef( null )

	const {
		title,
		description,
		ctaLabel = null,
		ctaOnClick = NOOP,
		size = 'small',
		anchor = null, // This is a selector for the element to anchor the modal to. Defaults to middle of the screen.
		position = 'center', // This is the position to place the modal relative to the anchor. Can be 'left', 'right', 'top', 'bottom', 'center'.
		offsetX = 0,
		offsetY = 0,
		showNext = true,
		nextEvent = 'click',
		nextEventTarget = null, // This is a selector for the element to trigger the next event if there is one.
	} = steps[ currentStep ]

	// Create a stable function reference for the event listener
	const handleNextEvent = useCallback( () => {
		setCurrentStep( currentStep + 1 )
		setTimeout( () => {
			setForceRefresh( forceRefresh + 1 )
		}, 50 )
	}, [ currentStep ] )

	// Show modal after 1 second delay
	useEffect( () => {
		const timer = setTimeout( () => {
			setIsVisible( true )
			setTimeout( () => {
				setIsVisibleDelayed( true )
			}, 30 )
		}, 1000 )

		return () => clearTimeout( timer )
	}, [] )

	useEffect( () => {
		if ( nextEventTarget ) {
			const element = document.querySelector( nextEventTarget )
			element?.addEventListener( nextEvent, handleNextEvent )
		}

		return () => {
			if ( nextEventTarget ) {
				const element = document.querySelector( nextEventTarget )
				element?.removeEventListener( nextEvent, handleNextEvent )
			}
		}
	}, [ currentStep, nextEventTarget, nextEvent, handleNextEvent ] )

	// These are the X and Y offsets of the modal relative to the anchor. This will be
	const [ modalOffsetX, modalOffsetY ] = useMemo( () => {
		if ( ! modalRef.current ) {
			return [ '', '' ] // This is for the entire screen.
		}

		const modalRect = modalRef.current.querySelector( '.ugb-tour-modal' ).getBoundingClientRect()
		const defaultOffset = [ `${ ( window.innerWidth / 2 ) - ( modalRect.width / 2 ) }px`, `${ ( window.innerHeight / 2 ) - ( modalRect.height / 2 ) }px` ]

		if ( ! anchor ) {
			return defaultOffset // This is for the entire screen.
		}

		// Based on the anchor and position, calculate the X and Y offsets of the modal relative to the anchor.
		// We have the modalRef.current which we can use to get the modal's bounding client rect.
		const anchorRect = document.querySelector( anchor )?.getBoundingClientRect()

		switch ( position ) {
			case 'left':
				// Left, middle
				return [ `${ anchorRect.left - modalRect.width - 24 }px`, `${ anchorRect.top + ( anchorRect.height / 2 ) - ( modalRect.height / 2 ) }px` ]
			case 'right':
				// Right, middle
				return [ `${ anchorRect.right + 24 }px`, `${ anchorRect.top + ( anchorRect.height / 2 ) - ( modalRect.height / 2 ) }px` ]
			case 'top':
				// Center, top
				return [ `${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`, `${ anchorRect.top - modalRect.height - 24 }px` ]
			case 'bottom':
				// Center, bottom
				return [ `${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`, `${ anchorRect.bottom + 24 }px` ]
			case 'center':
				return [
					`${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`,
					`${ anchorRect.top + ( anchorRect.height / 2 ) - ( modalRect.height / 2 ) }px`,
				]
			default:
				return defaultOffset
		}
	}, [ anchor, position, modalRef.current, isVisible, isVisibleDelayed, forceRefresh ] )

	if ( ! isVisible ) {
		return null
	}

	return (
		<Modal
			title={ title }
			overlayClassName="ugb-tour-modal--overlay"
			shouldCloseOnClickOutside={ false }
			size={ size }
			onRequestClose={ onClose }
			className={ classNames( 'ugb-tour-modal', `ugb-tour-modal--${ position }`, {
				'ugb-tour-modal--visible': isVisible,
				'ugb-tour-modal--visible-delayed': isVisibleDelayed,
			} ) }
			ref={ modalRef }
		>
			<style>
				{ `.ugb-tour-modal {
					--offset-x: ${ offsetX }px;
					--offset-y: ${ offsetY }px;
					--left: ${ modalOffsetX };
					--top: ${ modalOffsetY };
				}` }
			</style>
			{ description }
			{ ctaLabel && (
				<Button
					onClick={ () => {
						ctaOnClick()
						setCurrentStep( currentStep + 1 )
						setTimeout( () => {
							setForceRefresh( forceRefresh + 1 )
						}, 50 )
					} }
					variant="primary"
					className="ugb-tour-modal__cta"
				>
					{ ctaLabel }
				</Button>
			) }
			<Flex className="ugb-tour-modal__footer">
				<Steps
					numSteps={ steps.length }
					currentStep={ currentStep }
					onClickStep={ setCurrentStep }
				/>
				{ currentStep > 0 && (
					<Button
						variant="tertiary"
						onClick={ () => {
							setCurrentStep( currentStep - 1 )
							setTimeout( () => {
								setForceRefresh( forceRefresh + 1 )
							}, 50 )
						} }
					>
						<Icon icon={ arrowLeft } size={ 20 } />
						&nbsp;
						{ __( 'Back', i18n ) }
					</Button>
				) }
				{ showNext && (
					<Button
						variant="primary"
						onClick={ () => {
							if ( currentStep === steps.length - 1 ) {
								onClose()
							} else {
								setCurrentStep( currentStep + 1 )
								setTimeout( () => {
									setForceRefresh( forceRefresh + 1 )
								}, 50 )
							}
						} }
					>
						{ currentStep === steps.length - 1 ? (
							__( 'Finish', i18n )
						) : (
							<>
								{ __( 'Next', i18n ) }
								&nbsp;
								<Icon icon={ arrowRight } size={ 20 } />
							</>
						) }
					</Button>
				) }
			</Flex>
		</Modal>
	)
}

export default ModalTour

const Steps = props => {
	const {
		numSteps = 3,
		currentStep = 0,
		// onClickStep = NOOP,
	} = props

	return (
		<div className="ugb-tour-modal__steps">
			{ Array.from( { length: numSteps } ).map( ( _, index ) => {
				const classes = classNames( [
					'ugb-tour-modal__step',
					currentStep === index && 'ugb-tour-modal__step--active',
				] )

				return (
					<div
						className={ classes }
						// onClick={ () => onClickStep( index ) }
						key={ index }
					/>
				)
			} ) }
		</div>
	)
}
