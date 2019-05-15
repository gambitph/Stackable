import * as deepmerge from 'deepmerge'
import { addFilter, applyFilters, doAction } from '@wordpress/hooks'
import { FourNumberControl, WhenResponsiveScreen } from '@stackable/components'
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { PanelBody } from '@wordpress/components'

const inspectorControls = ( blockName, options ) => ( output, props ) => {
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
				{ applyFilters( `stackable.${ blockName }.edit.advanced.spacing.before`, null, props ) }
				{ options.margins && <Fragment>
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
									marginTop: margins.top !== '' ? parseInt( margins.top, 10 ) : '',
									marginRight: margins.right !== '' ? parseInt( margins.right, 10 ) : '',
									marginBottom: margins.bottom !== '' ? parseInt( margins.bottom, 10 ) : '',
									marginLeft: margins.left !== '' ? parseInt( margins.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ marginUnit => setAttributes( { marginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ options.enableMarginLeft }
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
									tabletMarginTop: margins.top !== '' ? parseInt( margins.top, 10 ) : '',
									tabletMarginRight: margins.right !== '' ? parseInt( margins.right, 10 ) : '',
									tabletMarginBottom: margins.bottom !== '' ? parseInt( margins.bottom, 10 ) : '',
									tabletMarginLeft: margins.left !== '' ? parseInt( margins.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ tabletMarginUnit => setAttributes( { tabletMarginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ options.enableMarginLeft }
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
									mobileMarginTop: margins.top !== '' ? parseInt( margins.top, 10 ) : '',
									mobileMarginRight: margins.right !== '' ? parseInt( margins.right, 10 ) : '',
									mobileMarginBottom: margins.bottom !== '' ? parseInt( margins.bottom, 10 ) : '',
									mobileMarginLeft: margins.left !== '' ? parseInt( margins.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ mobileMarginUnit => setAttributes( { mobileMarginUnit } ) }
							enableTop={ options.enableMarginTop }
							enableRight={ options.enableMarginRight }
							enableBottom={ options.enableMarginBottom }
							enableLeft={ options.enableMarginLeft }
						/>
					</WhenResponsiveScreen>
				</Fragment> }
				{ options.paddings && <Fragment>
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
									paddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									paddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									paddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									paddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ paddingUnit => setAttributes( { paddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
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
									tabletPaddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									tabletPaddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									tabletPaddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									tabletPaddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ tabletPaddingUnit => setAttributes( { tabletPaddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
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
									mobilePaddingTop: paddings.top !== '' ? parseInt( paddings.top, 10 ) : '',
									mobilePaddingRight: paddings.right !== '' ? parseInt( paddings.right, 10 ) : '',
									mobilePaddingBottom: paddings.bottom !== '' ? parseInt( paddings.bottom, 10 ) : '',
									mobilePaddingLeft: paddings.left !== '' ? parseInt( paddings.left, 10 ) : '',
								} )
							} }
							onChangeUnit={ mobilePaddingUnit => setAttributes( { mobilePaddingUnit } ) }
							enableTop={ options.enablePaddingTop }
							enableRight={ options.enablePaddingRight }
							enableBottom={ options.enablePaddingBottom }
							enableLeft={ options.enablePaddingLeft }
						/>
					</WhenResponsiveScreen>
				</Fragment> }
				{ applyFilters( `stackable.${ blockName }.edit.advanced.spacing.after`, null, props ) }
			</PanelBody>
		</Fragment>
	)
}

const addToStyleObject = ( blockName, options = {} ) => ( styleObject, props ) => {
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

	// const blockClass = applyFilters( `stackable.${ blockName }.advanced-spacing.selector`, `.${ props.mainClassName }` )
	const blockClass = applyFilters( `stackable.${ blockName }.advanced-spacing.selector`, options.selector || `.${ props.mainClassName }` )
	const margins = applyFilters( `stackable.${ blockName }.advanced-spacing.margins`, {
		[ blockClass ]: {
			marginTop: marginTop !== '' ? `${ marginTop }${ marginUnit }` : undefined,
			marginRight: marginRight !== '' ? `${ marginRight }${ marginUnit }` : undefined,
			marginBottom: marginBottom !== '' ? `${ marginBottom }${ marginUnit }` : undefined,
			marginLeft: marginLeft !== '' ? `${ marginLeft }${ marginUnit }` : undefined,
		},
		tablet: {
			[ blockClass ]: {
				marginTop: tabletMarginTop !== '' ? `${ tabletMarginTop }${ tabletMarginUnit }` : undefined,
				marginRight: tabletMarginRight !== '' ? `${ tabletMarginRight }${ tabletMarginUnit }` : undefined,
				marginBottom: tabletMarginBottom !== '' ? `${ tabletMarginBottom }${ tabletMarginUnit }` : undefined,
				marginLeft: tabletMarginLeft !== '' ? `${ tabletMarginLeft }${ tabletMarginUnit }` : undefined,
			},
		},
		mobile: {
			[ blockClass ]: {
				marginTop: mobileMarginTop !== '' ? `${ mobileMarginTop }${ mobileMarginUnit }` : undefined,
				marginRight: mobileMarginRight !== '' ? `${ mobileMarginRight }${ mobileMarginUnit }` : undefined,
				marginBottom: mobileMarginBottom !== '' ? `${ mobileMarginBottom }${ mobileMarginUnit }` : undefined,
				marginLeft: mobileMarginLeft !== '' ? `${ mobileMarginLeft }${ mobileMarginUnit }` : undefined,
			},
		},
	} )
	const paddings = applyFilters( `stackable.${ blockName }.advanced-spacing.paddings`, {
		[ blockClass ]: {
			paddingTop: paddingTop !== '' ? `${ paddingTop }${ paddingUnit }` : undefined,
			paddingRight: paddingRight !== '' ? `${ paddingRight }${ paddingUnit }` : undefined,
			paddingBottom: paddingBottom !== '' ? `${ paddingBottom }${ paddingUnit }` : undefined,
			paddingLeft: paddingLeft !== '' ? `${ paddingLeft }${ paddingUnit }` : undefined,
		},
		tablet: {
			[ blockClass ]: {
				paddingTop: tabletPaddingTop !== '' ? `${ tabletPaddingTop }${ tabletPaddingUnit }` : undefined,
				paddingRight: tabletPaddingRight !== '' ? `${ tabletPaddingRight }${ tabletPaddingUnit }` : undefined,
				paddingBottom: tabletPaddingBottom !== '' ? `${ tabletPaddingBottom }${ tabletPaddingUnit }` : undefined,
				paddingLeft: tabletPaddingLeft !== '' ? `${ tabletPaddingLeft }${ tabletPaddingUnit }` : undefined,
			},
		},
		mobile: {
			[ blockClass ]: {
				paddingTop: mobilePaddingTop !== '' ? `${ mobilePaddingTop }${ mobilePaddingUnit }` : undefined,
				paddingRight: mobilePaddingRight !== '' ? `${ mobilePaddingRight }${ mobilePaddingUnit }` : undefined,
				paddingBottom: mobilePaddingBottom !== '' ? `${ mobilePaddingBottom }${ mobilePaddingUnit }` : undefined,
				paddingLeft: mobilePaddingLeft !== '' ? `${ mobilePaddingLeft }${ mobilePaddingUnit }` : undefined,
			},
		},
	} )

	return deepmerge.all( [ styleObject, margins, paddings ] )
}

const addAttributes = attributes => {
	return {
		...attributes,
		marginTop: {
			type: 'number',
			default: '',
		},
		marginRight: {
			type: 'number',
			default: '',
		},
		marginBottom: {
			type: 'number',
			default: '',
		},
		marginLeft: {
			type: 'number',
			default: '',
		},
		marginUnit: {
			type: 'string',
			default: 'px',
		},

		tabletMarginTop: {
			type: 'number',
			default: '',
		},
		tabletMarginRight: {
			type: 'number',
			default: '',
		},
		tabletMarginBottom: {
			type: 'number',
			default: '',
		},
		tabletMarginLeft: {
			type: 'number',
			default: '',
		},
		tabletMarginUnit: {
			type: 'string',
			default: 'px',
		},

		mobileMarginTop: {
			type: 'number',
			default: '',
		},
		mobileMarginRight: {
			type: 'number',
			default: '',
		},
		mobileMarginBottom: {
			type: 'number',
			default: '',
		},
		mobileMarginLeft: {
			type: 'number',
			default: '',
		},
		mobileMarginUnit: {
			type: 'string',
			default: 'px',
		},

		paddingTop: {
			type: 'number',
			default: '',
		},
		paddingRight: {
			type: 'number',
			default: '',
		},
		paddingBottom: {
			type: 'number',
			default: '',
		},
		paddingLeft: {
			type: 'number',
			default: '',
		},
		paddingUnit: {
			type: 'string',
			default: 'px',
		},

		tabletPaddingTop: {
			type: 'number',
			default: '',
		},
		tabletPaddingRight: {
			type: 'number',
			default: '',
		},
		tabletPaddingBottom: {
			type: 'number',
			default: '',
		},
		tabletPaddingLeft: {
			type: 'number',
			default: '',
		},
		tabletPaddingUnit: {
			type: 'string',
			default: 'px',
		},

		mobilePaddingTop: {
			type: 'number',
			default: '',
		},
		mobilePaddingRight: {
			type: 'number',
			default: '',
		},
		mobilePaddingBottom: {
			type: 'number',
			default: '',
		},
		mobilePaddingLeft: {
			type: 'number',
			default: '',
		},
		mobilePaddingUnit: {
			type: 'string',
			default: 'px',
		},
	}
}

const advancedSpacing = ( blockName, options = {} ) => {
	const optionsToPass = {
		selector: '',
		margins: true,
		paddings: true,
		modifyStyles: true,
		enableMarginTop: true,
		enableMarginRight: true,
		enableMarginBottom: true,
		enableMarginLeft: true,
		enablePaddingTop: true,
		enablePaddingRight: true,
		enablePaddingBottom: true,
		enablePaddingLeft: true,
		...options,
	}

	addFilter( `stackable.${ blockName }.edit.inspector.advanced.before`, `stackable/${ blockName }/advanced-spacing`, inspectorControls( blockName, optionsToPass ), 5 )
	if ( optionsToPass.modifyStyles ) {
		addFilter( `stackable.${ blockName }.styles`, `stackable/${ blockName }/advanced-spacing`, addToStyleObject( blockName, optionsToPass ) )
	}
	addFilter( `stackable.${ blockName }.attributes`, `stackable/${ blockName }/advanced-spacing`, addAttributes )
	doAction( `stackable.module.advanced-spacing`, blockName )
}

export default advancedSpacing
