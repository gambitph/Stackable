import {
	i18n,
	guidedTourStates, // TODO: This doesn't exist yet. The state should be loaded here from localize values, this should be an object with the tour ID as the key and the state as the value.
} from 'stackable'
import classNames from 'classnames'
import confetti from 'canvas-confetti'

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

// The main tour component.
const GuidedModalTour = props => {
	const {
		steps = STEPS,
		tourId = '', // This is the ID of the tour, this will be used to store the tour state in the database.
	} = props

	// On mount, check if the tour has been completed, if so, don't show it.
	const [ isDone, setIsDone ] = useState( guidedTourStates?.[ tourId ] )

	if ( isDone ) {
		return null
	}

	return <ModalTour
		steps={ steps }
		onClose={ () => {
			// TODO: Save the tour state to the database that we finished it.
			setIsDone( true )
		} }
	/>
}

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
		ctaLabel = null, // If provided, a button will be shown with this label.
		ctaOnClick = NOOP, // This will be called when the button is clicked, we will move to the next step after.
		size = 'small', // Size of the modal. Can be 'small', 'medium', 'large'.
		anchor = null, // This is a selector for the element to anchor the modal to. Defaults to middle of the screen.
		position = 'center', // This is the position to place the modal relative to the anchor. Can be 'left', 'right', 'top', 'bottom', 'center'.
		offsetX = 0, // This is the X offset of the modal relative to the anchor.
		offsetY = 0, // This is the Y offset of the modal relative to the anchor.
		showNext = true, // If true, a "Next" button will be shown.
		nextEventTarget = null, // If provided, this is a selector for the element to trigger the next event if there is one.
		nextEvent = 'click', // This is the event to listen for to trigger the next step.
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
								confetti( {
									angle: -90,
									spread: 90,
									origin: { y: -0.3 },
									zIndex: 100000,
								} )
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

export default GuidedModalTour
