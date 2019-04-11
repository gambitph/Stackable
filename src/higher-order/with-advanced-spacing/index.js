import { addFilter, removeFilter } from '@wordpress/hooks'
import { Component, Fragment } from '@wordpress/element'
import { FourNumberControl, WhenResponsiveScreen } from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { createHigherOrderComponent } from '@wordpress/compose'
import { PanelBody } from '@wordpress/components'

const withAdvancedSpacing = spacingSelector => createHigherOrderComponent(
	WrappedComponent => class extends Component {
		constructor() {
			super( ...arguments )

			this.advancedSpacingBefore = this.advancedSpacingBefore.bind( this )
			this.advancedSpacingStyles = this.advancedSpacingStyles.bind( this )
		}

		advancedSpacingBefore( output, props ) {
			const { setAttributes } = props
			const {
				marginTop = '',
				marginRight = '',
				marginBottom = '',
				marginLeft = '',
				marginUnit = 'px',

				tabletMarginTop = '',
				tabletMarginRight = '',
				tabletMarginBottom = '',
				tabletMarginLeft = '',
				tabletMarginUnit = 'px',

				mobileMarginTop = '',
				mobileMarginRight = '',
				mobileMarginBottom = '',
				mobileMarginLeft = '',
				mobileMarginUnit = 'px',

				paddingTop = '',
				paddingBottom = '',
				paddingRight = '',
				paddingLeft = '',
				paddingUnit = 'px',

				tabletPaddingTop = '',
				tabletPaddingBottom = '',
				tabletPaddingRight = '',
				tabletPaddingLeft = '',
				tabletPaddingUnit = 'px',

				mobilePaddingTop = '',
				mobilePaddingBottom = '',
				mobilePaddingRight = '',
				mobilePaddingLeft = '',
				mobilePaddingUnit = 'px',
			} = props.attributes

			return (
				<Fragment>
					{ output }
					<PanelBody
						title={ __( 'Spacing' ) }
						initialOpen={ true }
					>
						<WhenResponsiveScreen screen="desktop">
							<FourNumberControl
								label={ __( 'Margins' ) }
								units={ [ 'px', '%' ] }
								screens={ [ 'desktop', 'tablet', 'mobile' ] }
								top={ marginTop }
								bottom={ marginBottom }
								right={ marginRight }
								left={ marginLeft }
								unit={ marginUnit }
								onChange={ margins => {
									setAttributes( {
										marginTop: margins.top,
										marginRight: margins.right,
										marginBottom: margins.bottom,
										marginLeft: margins.left,
									} )
								} }
								onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<FourNumberControl
								label={ __( 'Margins' ) }
								units={ [ 'px', '%' ] }
								screens={ [ 'desktop', 'tablet', 'mobile' ] }
								top={ tabletMarginTop }
								bottom={ tabletMarginBottom }
								right={ tabletMarginRight }
								left={ tabletMarginLeft }
								unit={ tabletMarginUnit }
								onChange={ margins => {
									setAttributes( {
										tabletMarginTop: margins.top,
										tabletMarginRight: margins.right,
										tabletMarginBottom: margins.bottom,
										tabletMarginLeft: margins.left,
									} )
								} }
								onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<FourNumberControl
								label={ __( 'Margins' ) }
								units={ [ 'px', '%' ] }
								screens={ [ 'desktop', 'tablet', 'mobile' ] }
								top={ mobileMarginTop }
								bottom={ mobileMarginBottom }
								right={ mobileMarginRight }
								left={ mobileMarginLeft }
								unit={ mobileMarginUnit }
								onChange={ margins => {
									setAttributes( {
										mobileMarginTop: margins.top,
										mobileMarginRight: margins.right,
										mobileMarginBottom: margins.bottom,
										mobileMarginLeft: margins.left,
									} )
								} }
								onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="desktop">
							<FourNumberControl
								label={ __( 'Paddings' ) }
								units={ [ 'px', 'em', '%' ] }
								screens={ [ 'desktop', 'tablet', 'mobile' ] }
								top={ paddingTop }
								bottom={ paddingBottom }
								right={ paddingRight }
								left={ paddingLeft }
								unit={ paddingUnit }
								onChange={ paddings => {
									setAttributes( {
										paddingTop: paddings.top,
										paddingRight: paddings.right,
										paddingBottom: paddings.bottom,
										paddingLeft: paddings.left,
									} )
								} }
								onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="tablet">
							<FourNumberControl
								label={ __( 'Paddings' ) }
								units={ [ 'px', 'em', '%' ] }
								screens={ [ 'desktop', 'tablet', 'mobile' ] }
								top={ tabletPaddingTop }
								bottom={ tabletPaddingBottom }
								right={ tabletPaddingRight }
								left={ tabletPaddingLeft }
								unit={ tabletPaddingUnit }
								onChange={ paddings => {
									setAttributes( {
										tabletPaddingTop: paddings.top,
										tabletPaddingRight: paddings.right,
										tabletPaddingBottom: paddings.bottom,
										tabletPaddingLeft: paddings.left,
									} )
								} }
								onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
							/>
						</WhenResponsiveScreen>
						<WhenResponsiveScreen screen="mobile">
							<FourNumberControl
								label={ __( 'Paddings' ) }
								units={ [ 'px', 'em', '%' ] }
								screens={ [ 'desktop', 'tablet', 'mobile' ] }
								top={ mobilePaddingTop }
								bottom={ mobilePaddingBottom }
								right={ mobilePaddingRight }
								left={ mobilePaddingLeft }
								unit={ mobilePaddingUnit }
								onChange={ paddings => {
									setAttributes( {
										mobilePaddingTop: paddings.top,
										mobilePaddingRight: paddings.right,
										mobilePaddingBottom: paddings.bottom,
										mobilePaddingLeft: paddings.left,
									} )
								} }
								onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
							/>
						</WhenResponsiveScreen>
					</PanelBody>
				</Fragment>
			)
		}

		advancedSpacingStyles( styleObject, props ) {
			const {
				marginTop = '',
				marginRight = '',
				marginBottom = '',
				marginLeft = '',
				marginUnit = 'px',

				tabletMarginTop = '',
				tabletMarginRight = '',
				tabletMarginBottom = '',
				tabletMarginLeft = '',
				tabletMarginUnit = 'px',

				mobileMarginTop = '',
				mobileMarginRight = '',
				mobileMarginBottom = '',
				mobileMarginLeft = '',
				mobileMarginUnit = 'px',

				paddingTop = '',
				paddingBottom = '',
				paddingRight = '',
				paddingLeft = '',
				paddingUnit = 'px',

				tabletPaddingTop = '',
				tabletPaddingBottom = '',
				tabletPaddingRight = '',
				tabletPaddingLeft = '',
				tabletPaddingUnit = 'px',

				mobilePaddingTop = '',
				mobilePaddingBottom = '',
				mobilePaddingRight = '',
				mobilePaddingLeft = '',
				mobilePaddingUnit = 'px',
			} = props.attributes

			const blockClass = spacingSelector ? spacingSelector : `.${ props.mainClassName }`
			styleObject = {
				...styleObject,
				[ blockClass ]: {
					...styleObject[ blockClass ],
					marginTop: marginTop !== '' ? `${ marginTop }${ marginUnit }` : undefined,
					marginRight: marginRight !== '' ? `${ marginRight }${ marginUnit }` : undefined,
					marginBottom: marginBottom !== '' ? `${ marginBottom }${ marginUnit }` : undefined,
					marginLeft: marginLeft !== '' ? `${ marginLeft }${ marginUnit }` : undefined,

					paddingTop: paddingTop !== '' ? `${ paddingTop }${ paddingUnit }` : undefined,
					paddingRight: paddingRight !== '' ? `${ paddingRight }${ paddingUnit }` : undefined,
					paddingBottom: paddingBottom !== '' ? `${ paddingBottom }${ paddingUnit }` : undefined,
					paddingLeft: paddingLeft !== '' ? `${ paddingLeft }${ paddingUnit }` : undefined,
				},
				tablet: {
					[ blockClass ]: {
						...( styleObject.tablet ? styleObject.tablet[ blockClass ] : {} ),
						tabletMarginTop: tabletMarginTop !== '' ? `${ tabletMarginTop }${ tabletMarginUnit }` : undefined,
						tabletMarginRight: tabletMarginRight !== '' ? `${ tabletMarginRight }${ tabletMarginUnit }` : undefined,
						tabletMarginBottom: tabletMarginBottom !== '' ? `${ tabletMarginBottom }${ tabletMarginUnit }` : undefined,
						tabletMarginLeft: tabletMarginLeft !== '' ? `${ tabletMarginLeft }${ tabletMarginUnit }` : undefined,

						tabletPaddingTop: tabletPaddingTop !== '' ? `${ tabletPaddingTop }${ tabletPaddingUnit }` : undefined,
						tabletPaddingRight: tabletPaddingRight !== '' ? `${ tabletPaddingRight }${ tabletPaddingUnit }` : undefined,
						tabletPaddingBottom: tabletPaddingBottom !== '' ? `${ tabletPaddingBottom }${ tabletPaddingUnit }` : undefined,
						tabletPaddingLeft: tabletPaddingLeft !== '' ? `${ tabletPaddingLeft }${ tabletPaddingUnit }` : undefined,
					},
				},
				mobile: {
					[ blockClass ]: {
						...( styleObject.mobile ? styleObject.mobile[ blockClass ] : {} ),
						mobileMarginTop: mobileMarginTop !== '' ? `${ mobileMarginTop }${ mobileMarginUnit }` : undefined,
						mobileMarginRight: mobileMarginRight !== '' ? `${ mobileMarginRight }${ mobileMarginUnit }` : undefined,
						mobileMarginBottom: mobileMarginBottom !== '' ? `${ mobileMarginBottom }${ mobileMarginUnit }` : undefined,
						mobileMarginLeft: mobileMarginLeft !== '' ? `${ mobileMarginLeft }${ mobileMarginUnit }` : undefined,

						mobilePaddingTop: mobilePaddingTop !== '' ? `${ mobilePaddingTop }${ mobilePaddingUnit }` : undefined,
						mobilePaddingRight: mobilePaddingRight !== '' ? `${ mobilePaddingRight }${ mobilePaddingUnit }` : undefined,
						mobilePaddingBottom: mobilePaddingBottom !== '' ? `${ mobilePaddingBottom }${ mobilePaddingUnit }` : undefined,
						mobilePaddingLeft: mobilePaddingLeft !== '' ? `${ mobilePaddingLeft }${ mobilePaddingUnit }` : undefined,
					},
				},
			}

			return styleObject
		}

		componentDidMount() {
			const blockName = this.props.blockName
			addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advancedspacing`, this.advancedSpacingBefore )
			addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/advancedstyles`, this.advancedSpacingStyles )
		}

		componentWillUnmount() {
			const blockName = this.props.blockName
			removeFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advancedspacing` )
			removeFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/advancedstyles` )
		}

		render() {
			return (
				<WrappedComponent { ...this.props } />
			)
		}
	},
	'withAdvancedSpacing'
)

export default withAdvancedSpacing
