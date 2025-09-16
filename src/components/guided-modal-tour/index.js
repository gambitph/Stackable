/**
 * Internal dependencies
 */
import { TOUR_STEPS } from './tour-steps'
import {
	setActiveTour,
	clearActiveTour,
	isTourActive,
	getActiveTourId,
	addTourStateListener,
} from './util'

/**
 * External dependencies
 */
import {
	i18n,
	guidedTourStates,
} from 'stackable'
import classNames from 'classnames'
import confetti from 'canvas-confetti'

/**
 * WordPress dependencies
 */
import {
	Modal, Flex, Button,
} from '@wordpress/components'
import { models } from '@wordpress/api'
import { __ } from '@wordpress/i18n'
import {
	Icon, arrowRight, arrowLeft, info,
} from '@wordpress/icons'
import {
	useEffect, useState, useCallback, useRef, useMemo,
} from '@wordpress/element'

const NOOP = () => {}

// The main tour component.
const GuidedModalTour = props => {
	const {
		tourId = '', // This is the ID of the tour, this will be used to store the tour state in the database and to get the steps.
	} = props

	// On mount, check if the tour has been completed, if so, don't show it.
	const [ isDone, setIsDone ] = useState( guidedTourStates.includes( tourId ) )

	// We need this to prevent the tour from being shown again if it's just completed.
	const [ justCompleted, setJustCompleted ] = useState( false )

	// Check if another tour is already active
	const [ isAnotherTourActive, setIsAnotherTourActive ] = useState( isTourActive() && getActiveTourId() !== tourId )

	// Listen for tour state changes
	useEffect( () => {
		const removeListener = addTourStateListener( activeId => {
			setIsAnotherTourActive( activeId !== null && activeId !== tourId )
		} )
		return removeListener
	}, [ tourId ] )

	const {
		steps = [],
		condition = null,
		hasConfetti = true,
		initialize = NOOP,
	} = TOUR_STEPS[ tourId ]

	if ( justCompleted ) {
		return null
	}

	// If another tour is already active, don't show this tour
	if ( isAnotherTourActive ) {
		return null
	}

	// If there is a condition, check if it's met, if not, don't show the tour.
	// condition can be true, false, or null. true will show the tour (even if
	// it's already done), false will not show the tour, null will show the tour
	// only once (normal behavior).
	const conditionResult = condition ? condition() : null
	if ( conditionResult === false ) {
		return null
	} else if ( conditionResult === null ) {
		if ( isDone ) {
			return null
		}
	}

	if ( ! steps.length ) {
		return null
	}

	return <ModalTour
		tourId={ tourId }
		steps={ steps }
		hasConfetti={ hasConfetti }
		initialize={ initialize }
		onClose={ () => {
			setIsDone( true )
			setJustCompleted( true )

			// Clear the active tour
			clearActiveTour()

			// Update the stackable_guided_tour_states setting
			if ( ! guidedTourStates.includes( tourId ) ) {
				// eslint-disable-next-line camelcase
				const settings = new models.Settings( { stackable_guided_tour_states: [ ...guidedTourStates, tourId ] } )
				settings.save()
			}

			// Soft update the global variable to prevent the tour from being shown again.
			guidedTourStates.push( tourId )

			// Remove the "tour" GET parameter from the URL so conditions won't get triggered again.
			const url = new URL( window.location.href )
			url.searchParams.delete( 'tour' )
			window.history.replaceState( null, '', url.toString() )
		} }
	/>
}

const ModalTour = props => {
	const {
		tourId,
		steps,
		onClose = NOOP,
		hasConfetti = true,
		initialize = NOOP,
	} = props

	const [ currentStep, setCurrentStep ] = useState( 0 )
	const [ isVisible, setIsVisible ] = useState( false )
	const [ isVisibleDelayed, setIsVisibleDelayed ] = useState( false )
	const [ forceRefresh, setForceRefresh ] = useState( 0 )
	const [ isTransitioning, setIsTransitioning ] = useState( false )
	const [ direction, setDirection ] = useState( 'forward' )
	const modalRef = useRef( null )
	const glowElementRef = useRef( null )

	const {
		title,
		description,
		help = null, // If provided, a help text will be shown below the description.
		ctaLabel = null, // If provided, a button will be shown with this label.
		ctaOnClick = NOOP, // This will be called when the button is clicked, we will move to the next step after.
		size = 'small', // Size of the modal. Can be 'small', 'medium', 'large'.
		anchor = null, // This is a selector for the element to anchor the modal to. Defaults to middle of the screen.
		position = 'center', // This is the position to place the modal relative to the anchor. Can be 'left', 'right', 'top', 'bottom', 'center'.
		offsetX = '0px', // This is the X offset of the modal relative to the anchor.
		offsetY = '0px', // This is the Y offset of the modal relative to the anchor.
		showNext = true, // If true, a "Next" button will be shown.
		nextEventTarget = null, // If provided, this is a selector for the element to trigger the next event if there is one.
		nextEvent = 'click', // This is the event to listen for to trigger the next step.
		glowTarget = null, // If provided, this is a selector for the element to glow when the step is active.
		// eslint-disable-next-line no-unused-vars
		preStep = NOOP, // If provided, this is a function to run before the step is shown.
		// eslint-disable-next-line no-unused-vars
		postStep = NOOP, // If provided, this is a function to run after the step is shown.
		skipIf = NOOP, // If provided, this is a function to check if the step should be skipped.
	} = steps[ currentStep ]

	useEffect( () => {
		setTimeout( () => {
			initialize()
		}, 50 )
	}, [ initialize ] )

	// Set active tour when modal becomes visible
	useEffect( () => {
		if ( isVisible ) {
			setActiveTour( tourId )
		}
	}, [ isVisible, tourId ] )

	// Clear active tour when component unmounts
	useEffect( () => {
		return () => {
			if ( getActiveTourId() === tourId ) {
				clearActiveTour()
			}
		}
	}, [ tourId ] )

	// While the modal is visible, just keep on force refreshing the modal in an interval to make sure the modal is always in the correct position.
	useEffect( () => {
		let interval
		if ( isVisible && ! isTransitioning ) {
			interval = setInterval( () => {
				setForceRefresh( forceRefresh => forceRefresh + 1 )
			}, 500 )
		}
		return () => clearInterval( interval )
	}, [ isVisible, isVisibleDelayed, isTransitioning ] )

	// Create a stable function reference for the event listener
	const handleNextEvent = useCallback( () => {
		// Hide modal during transition
		setIsVisible( false )
		setIsVisibleDelayed( false )
		setIsTransitioning( true )
		setDirection( 'forward' )

		// If at the last step, just close
		if ( currentStep === steps.length - 1 ) {
			steps[ currentStep ]?.postStep?.( currentStep )
			if ( hasConfetti ) {
				throwConfetti()
			}
			onClose()
			return
		}

		setTimeout( () => {
			setCurrentStep( currentStep => {
				setTimeout( () => {
					steps[ currentStep ]?.postStep?.( currentStep )
				}, 50 )
				const nextStep = currentStep + 1
				setTimeout( () => {
					steps[ nextStep ]?.preStep?.( nextStep )
				}, 50 )
				return nextStep
			} )

			// Show modal after 200ms delay
			setTimeout( () => {
				setIsVisible( true )
				setTimeout( () => {
					setIsVisibleDelayed( true )
					setIsTransitioning( false )
				}, 150 )
			}, 200 )
		}, 100 )

		setTimeout( () => {
			setForceRefresh( forceRefresh => forceRefresh + 1 )
		}, 350 )
		setTimeout( () => {
			setForceRefresh( forceRefresh => forceRefresh + 1 )
		}, 650 )
	}, [ currentStep, steps, hasConfetti ] )

	const handleBackEvent = useCallback( () => {
		// Hide modal during transition
		setIsVisible( false )
		setIsVisibleDelayed( false )
		setIsTransitioning( true )
		setDirection( 'backward' )

		setTimeout( () => {
			setCurrentStep( currentStep => {
				// steps[ currentStep ]?.postStep?.( currentStep )
				const nextStep = currentStep - 1
				steps[ nextStep ]?.preStep?.( nextStep )
				return nextStep
			} )

			// Show modal after 200ms delay
			setTimeout( () => {
				setIsVisible( true )
				setTimeout( () => {
					setIsVisibleDelayed( true )
					setIsTransitioning( false )
				}, 150 )
			}, 200 )
		}, 100 )

		setTimeout( () => {
			setForceRefresh( forceRefresh => forceRefresh + 1 )
		}, 350 )
		setTimeout( () => {
			setForceRefresh( forceRefresh => forceRefresh + 1 )
		}, 650 )
	}, [ currentStep, steps ] )

	// If we just moved to this step, even before showing it check if we should skip it, if so, move to the next/prev step.
	useEffect( () => {
		if ( skipIf() ) {
			if ( direction === 'forward' ) {
				handleNextEvent()
			} else {
				handleBackEvent()
			}
		}
	}, [ currentStep, direction ] )

	// Show modal after 1 second delay
	useEffect( () => {
		const timer = setTimeout( () => {
			setIsVisible( true )
			setTimeout( () => {
				setIsVisibleDelayed( true )
			}, 150 )
		}, 1050 )

		return () => clearTimeout( timer )
	}, [] )

	useEffect( () => {
		let clickListener = null

		if ( nextEventTarget ) {
			if ( nextEvent === 'click' || nextEvent === 'mousedown' || nextEvent === 'mouseup' ) {
				clickListener = event => {
					// Check if the event target matches the selector or is inside an element that matches
					if (
						event.target.matches( nextEventTarget ) ||
						event.target.closest( nextEventTarget )
					) {
						handleNextEvent()
					}
				}
				// Use ownerDocument instead of document directly
				const doc = modalRef.current?.ownerDocument || document
				doc.addEventListener( nextEvent, clickListener )
			} else {
				const elements = document.querySelectorAll( nextEventTarget )
				for ( let i = 0; i < elements.length; i++ ) {
					elements[ i ].addEventListener( nextEvent, handleNextEvent )
				}
			}
		}

		return () => {
			if ( nextEventTarget ) {
				if ( ( nextEvent === 'click' || nextEvent === 'mousedown' || nextEvent === 'mouseup' ) && clickListener ) {
					// Use ownerDocument instead of document directly
					const doc = modalRef.current?.ownerDocument || document
					doc.removeEventListener( nextEvent, clickListener )
				} else {
					const elements = document.querySelectorAll( nextEventTarget )
					for ( let i = 0; i < elements.length; i++ ) {
						elements[ i ].removeEventListener( nextEvent, handleNextEvent )
					}
				}
			}
		}
	}, [ currentStep, nextEventTarget, nextEvent, handleNextEvent ] )

	// Create the glow element while this component is mounted.
	useEffect( () => {
		// Create the element.
		const element = document.createElement( 'div' )
		element.className = `ugb-tour-modal__glow ugb-tour-modal__glow--hidden`
		document.body.appendChild( element )

		// Keep track of the element.
		glowElementRef.current = element

		return () => {
			glowElementRef.current = null
			element.remove()
		}
	}, [] )

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

		if ( ! anchorRect ) {
			return defaultOffset
		}

		switch ( position ) {
			case 'left':
				// Left, middle
				return [ `${ anchorRect.left - modalRect.width - 16 }px`, `${ anchorRect.top + ( anchorRect.height / 2 ) - ( modalRect.height / 2 ) }px` ]
			case 'left-top':
				return [ `${ anchorRect.left - modalRect.width - 16 }px`, `${ anchorRect.top + 16 }px` ]
			case 'left-bottom':
				return [ `${ anchorRect.left - modalRect.width - 16 }px`, `${ anchorRect.bottom - modalRect.height - 16 }px` ]
			case 'right':
				// Right, middle
				return [ `${ anchorRect.right + 16 }px`, `${ anchorRect.top + ( anchorRect.height / 2 ) - ( modalRect.height / 2 ) }px` ]
			case 'right-top':
				return [ `${ anchorRect.right + 16 }px`, `${ anchorRect.top + 16 }px` ]
			case 'right-bottom':
				return [ `${ anchorRect.right + 16 }px`, `${ anchorRect.bottom - modalRect.height - 16 }px` ]
			case 'top':
				// Center, top
				return [ `${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`, `${ anchorRect.top - modalRect.height - 16 }px` ]
			case 'top-left':
				return [ `${ anchorRect.left + 16 }px`, `${ anchorRect.top - modalRect.height - 16 }px` ]
			case 'top-right':
				return [ `${ anchorRect.right - modalRect.width - 16 }px`, `${ anchorRect.top - modalRect.height - 16 }px` ]
			case 'bottom':
				// Center, bottom
				return [ `${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`, `${ anchorRect.bottom + 16 }px` ]
			case 'bottom-left':
				return [ `${ anchorRect.left + 16 }px`, `${ anchorRect.bottom + 16 }px` ]
			case 'bottom-right':
				return [ `${ anchorRect.right - modalRect.width - 16 }px`, `${ anchorRect.bottom + 16 }px` ]
			case 'center':
				return [ `${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`, `${ anchorRect.top + ( anchorRect.height / 2 ) - ( modalRect.height / 2 ) }px` ]
			case 'center-top':
				return [ `${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`, `${ anchorRect.top + 16 }px` ]
			case 'center-bottom':
				return [ `${ anchorRect.left + ( anchorRect.width / 2 ) - ( modalRect.width / 2 ) }px`, `${ anchorRect.bottom - modalRect.height - 16 }px` ]
			default:
				return defaultOffset
		}
	}, [ anchor, position, modalRef.current, isVisible, isVisibleDelayed, isTransitioning, forceRefresh ] )

	// If we have a glow target, create a new element in the body, placed on the top of the target, below the modal.
	useEffect( () => {
		if ( glowTarget && isVisibleDelayed ) {
			// Get the top, left, width, and height of the target.
			const target = document.querySelector( glowTarget )
			if ( target ) {
				const targetRect = target.getBoundingClientRect()

				// Estimate the size of the glow target based on the size of the target.
				const glowTargetSize = targetRect.width > 300 || targetRect.height > 200 ? 'large'
					: targetRect.width > 300 || targetRect.height > 100 ? 'medium'
						: 'small'

				// Create the element.
				if ( glowElementRef.current ) {
					glowElementRef.current.className = `ugb-tour-modal__glow ugb-tour-modal__glow--${ glowTargetSize }`
					glowElementRef.current.style.top = `${ targetRect.top - 8 }px`
					glowElementRef.current.style.left = `${ targetRect.left - 8 }px`
					glowElementRef.current.style.width = `${ targetRect.width + 16 }px`
					glowElementRef.current.style.height = `${ targetRect.height + 16 }px`
				}
			}
		} else if ( glowElementRef.current ) {
			glowElementRef.current.className = `ugb-tour-modal__glow ugb-tour-modal__glow--hidden`
		}
	}, [ glowTarget, currentStep, isVisible, isVisibleDelayed, isTransitioning, forceRefresh ] )

	// When unmounted, do not call onClose. So we need to do this handler on our own.
	useEffect( () => {
		const handleHeaderClick = () => {
			onClose()
		}
		if ( modalRef.current ) {
			modalRef.current.querySelector( '.components-modal__header' ).addEventListener( 'click', handleHeaderClick )
		}
		return () => {
			if ( modalRef.current ) {
				modalRef.current.querySelector( '.components-modal__header' ).removeEventListener( 'click', handleHeaderClick )
			}
		}
	}, [ modalRef.current, onClose ] )

	if ( ! isVisible ) {
		return null
	}

	return (
		<Modal
			title={ title }
			overlayClassName="ugb-tour-modal--overlay"
			shouldCloseOnClickOutside={ false }
			size={ size }
			// onRequestClose={ onClose } // Do not use onRequestClose, it will cause the tour finish
			className={ classNames(
				'ugb-tour-modal',
				`ugb-tour-modal--${ position.replace( /-.*$/, '' ) }`,
				`ugb-tour-modal--${ position }`,
				{
					'ugb-tour-modal--visible': isVisible,
					'ugb-tour-modal--visible-delayed': isVisibleDelayed,
				} ) }
			ref={ modalRef }
		>
			<style>
				{ `.ugb-tour-modal {
					--offset-x: ${ offsetX };
					--offset-y: ${ offsetY };
					--left: ${ modalOffsetX };
					--top: ${ modalOffsetY };
				}` }
			</style>
			{ description }
			{ help && (
				<div className="ugb-tour-modal__help">
					<Icon icon={ info } size={ 16 } />
					{ help }
				</div>
			) }
			{ ctaLabel && (
				<Button
					onClick={ () => {
						ctaOnClick()
						handleNextEvent()
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
				/>
				{ currentStep > 0 && (
					<Button
						variant="tertiary"
						onClick={ handleBackEvent }
					>
						<Icon icon={ arrowLeft } size={ 20 } />
						&nbsp;
						{ __( 'Back', i18n ) }
					</Button>
				) }
				{ showNext && (
					<Button
						variant="primary"
						onClick={ handleNextEvent }
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

const throwConfetti = () => {
	confetti( {
		particleCount: 50,
		angle: 60,
		spread: 70,
		origin: { x: 0 },
		zIndex: 100000,
		disableForReducedMotion: true,
	} )
	confetti( {
		particleCount: 50,
		angle: 120,
		spread: 70,
		origin: { x: 1 },
		zIndex: 100000,
		disableForReducedMotion: true,
	} )
	setTimeout( () => {
		confetti( {
			particleCount: 50,
			angle: -90,
			spread: 90,
			origin: { y: -0.3 },
			zIndex: 100000,
			disableForReducedMotion: true,
		} )
	}, 150 )
}

const Steps = props => {
	const {
		numSteps = 3,
		currentStep = 0,
	} = props

	if ( numSteps === 1 ) {
		return null
	}

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
						key={ index }
					/>
				)
			} ) }
		</div>
	)
}

export default GuidedModalTour
