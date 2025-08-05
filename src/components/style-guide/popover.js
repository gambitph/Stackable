/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import { StyleGuide } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { useMemo } from '@wordpress/element'
import { Popover, Button } from '@wordpress/components'
import { Icon, close as closeIcon } from '@wordpress/icons'
import { useDesignSystem } from '~stackable/hooks'

const StyleGuidePopover = props => {
	const { onClose } = props

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
			<h1 className="ugb-style-guide-popover__title">{ __( 'Design System Style Guide', i18n ) }</h1>
			<StyleGuide { ...props } designSystem={ designSystem } />
		</Popover>
	)
}

export default StyleGuidePopover
