import {
	BlockAlignmentToolbar, BlockControls, InspectorControls,
} from '@wordpress/block-editor'
import {
	ButtonEdit, PanelButtonSettings, ProControl, URLInputControl,
} from '@stackable/components'
import { Component, Fragment } from '@wordpress/element'
import { i18n, isPro, showProNotice } from 'stackable'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { PanelBody } from '@wordpress/components'
import { range } from '@stackable/util'

class edit extends Component {
	constructor() {
		super( ...arguments )
		this.state = {
			selectedButton: 0,
		}
	}

	// Deselect button when deselecting the block
	componentDidUpdate( prevProps ) {
		if ( this.props.isSelected && ! prevProps.isSelected ) {
			this.setState( {
				selectedButton: 0,
			} )
		}
	}

	render() {
		const {
			isSelected,
			className,
			setAttributes,
			attributes,
		} = this.props

		const {
			color,
			textColor,
			size,
			align,
			cornerButtonRadius,
			design = 'basic',
			icon,
			buttons = 1,
		} = attributes

		const mainClasses = classnames( [
			className,
			'ugb-button-wrapper',
		], applyFilters( 'stackable.button.mainclasses', {
			[ `ugb-button--align-${ align }` ]: align,
		}, design, this.props ) )

		const editDesign = (
			<div className={ mainClasses }>
				{ applyFilters( 'stackable.button.edit.output.before', null, design, this.props ) }
				{ range( 1, buttons + 1 ).map( i => {
					const text = attributes[ `text${ i === 1 ? '' : i }` ]
					const size = attributes[ `size${ i === 1 ? '' : i }` ]
					const design = attributes[ `design${ i === 1 ? '' : i }` ]
					const color = attributes[ `color${ i === 1 ? '' : i }` ]
					const textColor = attributes[ `textColor${ i === 1 ? '' : i }` ]
					const icon = attributes[ `icon${ i === 1 ? '' : i }` ]

					const buttonClasses = classnames(
						applyFilters( 'stackable.button.buttonclasses', {}, design, i, this.props )
					)

					return (
						<ButtonEdit key={ i }
							className={ buttonClasses }
							onChange={ text => setAttributes( { [ `text${ i === 1 ? '' : i }` ]: text } ) }
							icon={ icon }
							size={ size }
							backgroundColor={ color }
							color={ textColor }
							text={ text }
							borderRadius={ cornerButtonRadius }
							design={ design }
							onClick={ () => {
								this.setState( { selectedButton: i } )
							} }
							onSelect={ () => {
								this.setState( { selectedButton: i } )
							} }
						/>
					)
				} ) }
				{ applyFilters( 'stackable.button.edit.output.after', null, design, this.props ) }
			</div>
		)

		return (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ align => {
							setAttributes( { align } )
						} }
						controls={ [ 'left', 'center', 'right', 'full' ] }
					/>
				</BlockControls>
				<InspectorControls>
					{ isPro &&
						<PanelButtonSettings
							initialOpen={ true }
							title={ __( 'General Settings', i18n ) }
							buttonBorderRadius={ cornerButtonRadius }
							onChangeButtonBorderRadius={ cornerButtonRadius => setAttributes( { cornerButtonRadius } ) }
						>
							{ applyFilters( 'stackable.button.edit.inspector.general', null, this.props ) }
						</PanelButtonSettings>
					}
					<PanelButtonSettings
						title={ ! isPro && ! showProNotice ? __( 'Button Settings', i18n ) : __( 'Button #1 Settings', i18n ) }
						initialOpen={ true }
						buttonDesign={ design }
						buttonColor={ color }
						buttonTextColor={ textColor }
						buttonSize={ size }
						onChangeButtonColor={ color => setAttributes( { color } ) }
						onChangeButtonTextColor={ textColor => setAttributes( { textColor } ) }
						onChangeButtonSize={ size => {
							setAttributes( { size } )
						} }
						onChangeButtonDesign={ design => {
							setAttributes( { design } )
						} }
						buttonBorderRadius={ cornerButtonRadius }
						onChangeButtonBorderRadius={ ! isPro && ( cornerButtonRadius => setAttributes( { cornerButtonRadius } ) ) }
						buttonIcon={ icon }
						onChangeButtonIcon={ icon => setAttributes( { icon } ) }
					>
					</PanelButtonSettings>
					{ showProNotice &&
						<PanelBody
							initialOpen={ false }
							title={ __( 'Button #2 Settings', i18n ) }
						>
							<ProControl
								title={ __( 'Say Hello to Side by Side Buttons 👋', i18n ) }
								description={ __( 'Give your visitors more buttons to choose from. This feature is only available on Stackable Pro', i18n ) }
							/>
						</PanelBody>
					}
					{ showProNotice &&
						<PanelBody
							initialOpen={ false }
							title={ __( 'Button #3 Settings', i18n ) }
						>
							<ProControl
								title={ __( 'Say Hello to Side by Side Buttons 👋', i18n ) }
								description={ __( 'Give your visitors more buttons to choose from. This feature is only available on Stackable Pro', i18n ) }
							/>
						</PanelBody>
					}
					{ showProNotice &&
						<PanelBody
							initialOpen={ false }
							title={ __( 'Custom CSS', i18n ) }
						>
							<ProControl
								title={ __( 'Say Hello to Custom CSS 👋', i18n ) }
								description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium', i18n ) }
							/>
						</PanelBody>
					}
					{ applyFilters( 'stackable.button.edit.inspector.after', null, design, this.props ) }
				</InspectorControls>
				{ editDesign }
				{ isSelected &&
					<div className={ `ugb-button__group-urls ugb-button__selected-${ this.state.selectedButton } ugb-num-${ buttons }` }>
						{ range( 1, buttons + 1 ).map( i => {
							const url = attributes[ `url${ i === 1 ? '' : i }` ]
							const newTab = attributes[ `newTab${ i === 1 ? '' : i }` ]
							return (
								<URLInputControl
									key={ i }
									value={ url }
									newTab={ newTab }
									onChange={ url => setAttributes( { [ `url${ i === 1 ? '' : i }` ]: url } ) }
									onChangeNewTab={ newTab => setAttributes( { [ `newTab${ i === 1 ? '' : i }` ]: newTab } ) }
								/>
							)
						} ) }
					</div>
				}
			</Fragment>
		)
	}
}

export default edit
