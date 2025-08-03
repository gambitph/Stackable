/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import { toPng } from 'html-to-image'

/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n'
import { useRef, useState } from '@wordpress/element'
import { Icon, download as downloadIcon } from '@wordpress/icons'
import { Button } from '@wordpress/components'
import { isDarkColor } from '~stackable/util'

export { default as StyleGuidePopover } from './popover'

// TODO: This is not yet finished
const StyleGuide = () => {
	const styleGuideRef = useRef( null )

	return (
		<>
			<ExportButton printRef={ styleGuideRef } />
			<div className="ugb-style-guide">
				<div className="ugb-style-guide__content editor-styles-wrapper" ref={ styleGuideRef }>

					<h1 className="ugb-style-guide__section-title">{ __( 'Colors', i18n ) }</h1>
					<h2 className="ugb-style-guide__section-subheading">{ __( 'Color Palette', i18n ) }</h2>
					<div className="ugb-style-guide__columns ugb-style-guide__colors">
						<div className="ugb-style-guide__column" style={ { backgroundColor: '#f00069' } }>
							<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( '#f00069' ) ? '#fff' : '#000' } }>
								#F00069
							</div>
						</div>
						<div className="ugb-style-guide__column" style={ { backgroundColor: '#111' } }>
							<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( '#111' ) ? '#fff' : '#000' } }>
								#111111
							</div>
						</div>
						<div className="ugb-style-guide__column" style={ { backgroundColor: '#222' } }>
							<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( '#222' ) ? '#fff' : '#000' } }>
								#222222
							</div>
						</div>
						<div className="ugb-style-guide__column" style={ { backgroundColor: '#333' } }>
							<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( '#333' ) ? '#fff' : '#000' } }>
								#333333
							</div>
						</div>
						<div className="ugb-style-guide__column" style={ { backgroundColor: '#444' } }>
							<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( '#444' ) ? '#fff' : '#000' } }>
								#444444
							</div>
						</div>
						<div className="ugb-style-guide__column" style={ { backgroundColor: '#555' } }>
							<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( '#555' ) ? '#fff' : '#000' } }>
								#555555
							</div>
						</div>
						<div className="ugb-style-guide__column" style={ { backgroundColor: '#666' } }>
							<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( '#666' ) ? '#fff' : '#000' } }>
								#666666
							</div>
						</div>
					</div>

					<h2 className="ugb-style-guide__section-subheading">{ __( 'Color Schemes', i18n ) }</h2>

					<h1 className="ugb-style-guide__section-title">{ __( 'Typography', i18n ) }</h1>
					<div className="ugb-style-guide__columns">
						<div className="ugb-style-guide__column">
							<h2 className="ugb-style-guide__section-subheading">{ __( 'Titles & Headings', i18n ) }</h2>
							<h1>{ __( 'Heading 1', i18n ) }</h1>
							<h2>{ __( 'Heading 2', i18n ) }</h2>
							<h3>{ __( 'Heading 3', i18n ) }</h3>
							<h4>{ __( 'Heading 4', i18n ) }</h4>
							<h5>{ __( 'Heading 5', i18n ) }</h5>
							<h6>{ __( 'Heading 6', i18n ) }</h6>
							<p>{ __( 'Paragraph', i18n ) }</p>
						</div>
						<div className="ugb-style-guide__column">
							<h2 className="ugb-style-guide__section-subheading">{ __( 'Body Text', i18n ) }</h2>
							<p>Morning sunlight filters through city windows as familiar voices fill the room. The table is scattered with mugs and yesterday\’s news, while someone debates the best way to arrange the cushions. Laughter drifts from the kitchen, and plans for the day are made between sips of coffee and playful banter.</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default StyleGuide

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
