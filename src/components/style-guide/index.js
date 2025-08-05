/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import { toPng } from 'html-to-image'
import { isDarkColor } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n'
import {
	RawHTML, useRef, useState,
} from '@wordpress/element'
import { Icon, download as downloadIcon } from '@wordpress/icons'
import { Button } from '@wordpress/components'
import { createBlock, serialize } from '@wordpress/blocks'

export { default as StyleGuidePopover } from './popover'

// TODO: This is not yet finished
const StyleGuide = props => {
	const { designSystem } = props

	const { colors } = designSystem

	const styleGuideRef = useRef( null )

	return (
		<>
			<ExportButton printRef={ styleGuideRef } />
			<div className="ugb-style-guide">
				<div className="ugb-style-guide__content editor-styles-wrapper" ref={ styleGuideRef }>

					<h1 className="ugb-style-guide__section-title">{ __( 'Colors', i18n ) }</h1>
					<h2 className="ugb-style-guide__section-subheading">{ __( 'Color Palette', i18n ) }</h2>
					<div className="ugb-style-guide__columns ugb-style-guide__colors">
						{ colors.map( ( color, key ) => {
							return <div key={ key } className="ugb-style-guide__column" style={ { backgroundColor: color.color } }>
								<div className="ugb-style-guide__color-label ugb-style-guide__label" style={ { color: isDarkColor( color.color ) ? '#fff' : '#000' } }>
									<p> { color.name } </p>
									<p> { color.color } </p>
								</div>
							</div>
						} ) }
					</div>

					<h2 className="ugb-style-guide__section-subheading">{ __( 'Color Schemes', i18n ) }</h2>

					<h1 className="ugb-style-guide__section-title">{ __( 'Typography', i18n ) }</h1>
					<div className="ugb-style-guide__columns">
						<div className="ugb-style-guide__column">
							<h2 className="ugb-style-guide__section-subheading">{ __( 'Titles & Headings', i18n ) }</h2>
							<RenderBlock blockName="stackable/heading" attributes={ {
								uniqueId: '174a096',
								textTag: 'h1',
								text: __( 'Heading 1', i18n ),
							} } />
							<RenderBlock blockName="stackable/heading" attributes={ {
								uniqueId: '174a092',
								textTag: 'h2',
								text: __( 'Heading 2', i18n ),
							} } />
							<RenderBlock blockName="stackable/heading" attributes={ {
								uniqueId: '174a093',
								textTag: 'h3',
								text: __( 'Heading 3', i18n ),
							} } />
							<RenderBlock blockName="stackable/heading" attributes={ {
								uniqueId: '174a094',
								textTag: 'h4',
								text: __( 'Heading 4', i18n ),
							} } />
							<RenderBlock blockName="stackable/heading" attributes={ {
								uniqueId: '174a095',
								textTag: 'h5',
								text: __( 'Heading 5', i18n ),
							} } />
							<RenderBlock blockName="stackable/heading" attributes={ {
								uniqueId: '174a096',
								textTag: 'h6',
								text: __( 'Heading 6', i18n ),
							} } />
						</div>
						<div className="ugb-style-guide__column">
							<h2 className="ugb-style-guide__section-subheading">{ __( 'Body Text', i18n ) }</h2>
							<RenderBlock blockName="stackable/text" attributes={ {
								uniqueId: '174a097',
								text: __( 'Morning sunlight filters through city windows as familiar voices fill the room. The table is scattered with mugs and yesterday\'s news, while someone debates the best way to arrange the cushions. Laughter drifts from the kitchen, and plans for the day are made between sips of coffee and playful banter.', i18n ),
							} } />
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

const RenderBlock = props => {
	const {
		blockName, attributes, innerBlocks,
	} = props

	return (
		<RawHTML>
			{ serialize( createBlock(
				blockName,
				attributes,
				innerBlocks
			) ) }
		</RawHTML>
	)
}
