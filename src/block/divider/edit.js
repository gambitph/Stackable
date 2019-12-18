/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignBasic from './images/basic.png'
import ImageDesignBar from './images/bar.png'
import ImageDesignDots from './images/dots.png'
import ImageDesignAsterisks from './images/asterisks.png'

/**
 * External dependencies
 */
import {
	BlockContainer,
	DesignPanelBody,
	ContentAlignControl,
	AdvancedRangeControl,
	FourRangeControl,
	ColorPaletteControl,
} from '~stackable/components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
} from '~stackable/higher-order'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { i18n } from 'stackable'
import {
	PanelBody,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { compose } from '@wordpress/compose'

addFilter( 'stackable.divider.edit.inspector.layout.before', 'stackable/divider', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'basic',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<DesignPanelBody
				initialOpen={ true }
				selected={ design }
				options={ applyFilters( 'stackable.divider.edit.layouts', [
					{
						label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
					},
					{
						label: __( 'Bar', i18n ), value: 'bar', image: ImageDesignBar,
					},
					{
						label: __( 'Dots', i18n ), value: 'dots', image: ImageDesignDots,
					},
					{
						label: __( 'Asterisks', i18n ), value: 'asterisks', image: ImageDesignAsterisks,
					},
				] ) }
				onChange={ design => setAttributes( { design } ) }
			/>
		</Fragment>
	)
} )

addFilter( 'stackable.divider.edit.inspector.style.before', 'stackable/divider', ( output, props ) => {
	const { setAttributes } = props
	const {
		color = '',
		hrMarginTop = '',
		hrMarginBottom = '',
		height = '',
		width = '',
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody title={ __( 'General', i18n ) }>
				<ColorPaletteControl
					value={ color }
					onChange={ color => setAttributes( { color } ) }
					label={ __( 'Color', i18n ) }
				/>
				<FourRangeControl
					label={ __( 'Vertical Margin', i18n ) }
					top={ hrMarginTop }
					bottom={ hrMarginBottom }
					max={ 100 }
					onChange={ ( { top, bottom } ) => setAttributes( { hrMarginTop: top, hrMarginBottom: bottom } ) }
					enableLeft={ false }
					enableRight={ false }
					className="ugb--help-tip-divider-margin"
				/>
				<AdvancedRangeControl
					label={ __( 'Height', i18n ) + ' / ' + __( 'Size', i18n ) }
					min={ 1 }
					max={ 100 }
					allowReset={ true }
					value={ height }
					onChange={ height => setAttributes( { height } ) }
				/>
				<AdvancedRangeControl
					label={ __( 'Width', i18n ) + ' (%)' }
					min={ 1 }
					max={ 100 }
					allowReset={ true }
					value={ width }
					onChange={ width => setAttributes( { width } ) }
				/>
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
	} = props

	const {
		design = 'basic',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-divider--v2',
		`ugb-divider--design-${ design }`,
	], applyFilters( 'stackable.divider.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<hr className="ugb-divider__hr" />
				{ ( design === 'dots' || design === 'asterisks' ) &&
					<div className="ugb-divider__dots" aria-hidden="true">
						<div className="ugb-divider__dot"></div>
						<div className="ugb-divider__dot"></div>
						<div className="ugb-divider__dot"></div>
					</div>
				}
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	withContentAlignReseter(),
	withBlockStyles( createStyles, { editorMode: true } ),
)( edit )
