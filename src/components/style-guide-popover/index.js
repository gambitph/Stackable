/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	useMemo, useState, useRef, useEffect,
} from '@wordpress/element'
import { Popover, Button } from '@wordpress/components'
import {
	Icon, close as closeIcon, download as downloadIcon,
} from '@wordpress/icons'

const StyleGuidePopover = props => {
	const { onClose } = props
	const styleGuideRef = useRef( null )
	const [ StyleGuide, setStyleGuide ] = useState( null )
	const [ isLoading, setIsLoading ] = useState( true )

	// On load, look for the .interface-interface-skeleton__content and position over it.
	const [ editorStylesWrapper, width, height ] = useMemo( () => {
		const el = document.querySelector( '.interface-interface-skeleton__content' )
		return [ el, el?.offsetWidth, el?.offsetHeight ]
	}, [] )

	// Lazy load the StyleGuide component
	useEffect( () => {
		const loadStyleGuide = async () => {
			try {
				// Import the StyleGuide component with explicit chunk naming
				const { default: StyleGuideComponent } = await import(
					/* webpackChunkName: "style-guide" */
					/* webpackMode: "lazy" */
					'../../lazy-components/style-guide/editor-style-guide'
				)
				setStyleGuide( () => StyleGuideComponent )
			} catch ( err ) {
				// eslint-disable-next-line no-console
				console.error( 'Failed to load StyleGuide component:', err )
			} finally {
				setIsLoading( false )
			}
		}

		loadStyleGuide()
	}, [] )

	const style = width && height ? { '--width': `${ width }px`, '--height': `${ height }px` } : {}

	return (
		<Popover
			className="ugb-style-guide-popover"
			anchor={ editorStylesWrapper }
			placement="overlay"
			style={ style }
		>
			<Button
				className="ugb-style-guide-popover__close-button"
				variant="tertiary"
				onClick={ onClose }
				aria-label={ __( 'Close', i18n ) }
			>
				<Icon icon={ closeIcon } />
			</Button>
			<div className="ugb-style-guide-popover__heading">
				<ExportButton printRef={ styleGuideRef } />
				<h1 className="ugb-style-guide-popover__title">{ __( 'Design System Style Guide', i18n ) }</h1>
				<p className="ugb-style-guide-popover__description">
					{ __( 'Welcome to your Style Guide! Here you can see a live preview of your design system in action. Any changes you make to your design settings will instantly update here.', i18n ) }
				</p>
			</div>
			{ isLoading ? (
				<div className="ugb-style-guide__loading">
					{ __( 'Loading style guide…', i18n ) }
				</div>
			) : StyleGuide ? (
				<StyleGuide { ...props } contentRef={ styleGuideRef } />
			) : (
				<div className="ugb-style-guide__error">
					{ __( 'Failed to load style guide', i18n ) }
				</div>
			) }
		</Popover>
	)
}

export default StyleGuidePopover

const ExportButton = props => {
	const { printRef } = props
	const [ isExporting, setIsExporting ] = useState( false )

	const handlePrint = async () => {
		setIsExporting( true )
		try {
			// Dynamically import html-to-image only when needed
			// Webpack will create a separate chunk for this
			const htmlToImage = await import( /* webpackChunkName: "html-to-image" */ 'html-to-image' )

			const dataUrl = await htmlToImage.toPng( printRef.current, { cacheBust: true } )
			const link = document.createElement( 'a' )
			link.download = 'style-guide.png'
			link.href = dataUrl
			link.click()
		} catch ( err ) {
			alert( sprintf( __( 'Error exporting style guide: %s', i18n ), err.message || err ) ) // eslint-disable-line no-alert
		} finally {
			setIsExporting( false )
		}
	}

	return (
		<Button
			className="ugb-style-guide__print-button"
			variant="secondary"
			onClick={ handlePrint }
			icon={ <Icon icon={ downloadIcon } /> }
			isBusy={ isExporting }
			disabled={ isExporting }
		>
			{ __( 'Export as Image', i18n ) }
		</Button>
	)
}
