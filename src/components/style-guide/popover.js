/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import { StyleGuide } from '~stackable/components'
import { toPng } from 'html-to-image'

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n'
import {
	useMemo, useState, useRef,
} from '@wordpress/element'
import { Popover, Button } from '@wordpress/components'
import {
	Icon, close as closeIcon, download as downloadIcon,
} from '@wordpress/icons'
import { useDesignSystem } from '~stackable/hooks'

const StyleGuidePopover = props => {
	const { onClose } = props
	const styleGuideRef = useRef( null )

	// On load, look for the .interface-interface-skeleton__content and position over it.
	const [ editorStylesWrapper, width, height ] = useMemo( () => {
		const el = document.querySelector( '.interface-interface-skeleton__content' )
		return [ el, el?.offsetWidth, el?.offsetHeight ]
	}, [] )

	const designSystem = useDesignSystem()

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
			<StyleGuide { ...props } designSystem={ designSystem } contentRef={ styleGuideRef } />
		</Popover>
	)
}

export default StyleGuidePopover

const ExportButton = props => {
	const { printRef } = props
	const [ isExporting, setIsExporting ] = useState( false )

	const handlePrint = () => {
		setIsExporting( true )
		toPng( printRef.current, { cacheBust: true } )
			.then( dataUrl => {
				const link = document.createElement( 'a' )
				link.download = 'style-guide.png'
				link.href = dataUrl
				link.click()
				setIsExporting( false )
			} )
			.catch( err => {
				alert( sprintf( __( 'Error exporting style guide: %s', i18n ), err.message || err ) ) // eslint-disable-line no-alert
				setIsExporting( false )
			} )
	}

	return (
		<Button
			className="ugb-style-guide__print-button"
			isSecondary
			onClick={ handlePrint }
			icon={ <Icon icon={ downloadIcon } /> }
			isBusy={ isExporting }
			disabled={ isExporting }
		>
			{ __( 'Export', i18n ) }
		</Button>
	)
}
