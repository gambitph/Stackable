/**
 * Internal dependencies
 */
import createStyles from './style'
// import { showOptions } from './util'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'

/**
 * External dependencies
 */
import {
	BlockContainer,
	DesignPanelBody,
	ProControlButton,
	ContentAlignControl,
	ResponsiveControl,
	AdvancedSelectControl,
	AdvancedToolbarControl,
	WhenResponsiveScreen,
	AdvancedRangeControl,
	ControlSeparator,
	BackgroundControlsHelper,
	ColorPaletteControl,
	DivBackground,
	PanelAdvancedSettings,
	DesignControl,
} from '~stackable/components'
import {
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector,
	withContentAlignReseter,
	withBlockStyles,
	withClickOpenInspector,
} from '~stackable/higher-order'
// import { cacheImageData } from '~stackable/util'
import classnames from 'classnames'

/**
 * WordPress dependencies
 */
import { i18n, showProNotice } from 'stackable'
import { PanelBody, ToggleControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { addFilter, applyFilters } from '@wordpress/hooks'
import { Fragment } from '@wordpress/element'
import { InnerBlocks } from '@wordpress/block-editor'
import { compose } from '@wordpress/compose'
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.column.edit.inspector.layout.before', 'stackable/column', ( output, props ) => {
	const { setAttributes } = props
	const {
		design = 'plain',
		columns = 2,
	} = props.attributes

	return (
		<Fragment>
			{ output }
			<PanelBody
				initialOpen={ true }
				title={ __( 'Layout', i18n ) }
			>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 2 }
					max={ design !== 'grid' ? 6 : 8 }
					placeholder="2"
					className="ugb--help-tip-general-columns"
				/>
				<DesignControl
					selected={ design }
					options={ applyFilters( 'stackable.column.edit.layouts', [
						{
							label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
						},
						{
							label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
						},
					] ) }
					onChange={ design => setAttributes( { design } ) }
				 />
				{ showProNotice && <ProControlButton /> }
			</PanelBody>
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		hasInnerBlocks,
	} = props

	const {
		design = 'plain',
		// shadow = '',
		// contentWidth = 100,
		// restrictContentWidth = false,
		// uniqueClass = '',
	} = props.attributes

	// const show = showOptions( props )

	const mainClasses = classnames( [
		className,
		`ugb-column--design-${ design }`,
	], applyFilters( 'stackable.columns.mainclasses', {
		// 'ugb-container--width-small': contentWidth <= 50,
	}, props ) )

	const itemClasses = classnames( [
		'ugb-column__item',
	], {
		// [ `ugb--shadow-${ shadow }` ]: shadow !== '',
	} )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				<DivBackground
					className={ itemClasses }
					backgroundAttrName="column%s"
					blockProps={ props }
				>
					<InnerBlocks
						templateLock={ false }
						renderAppender={
							hasInnerBlocks ?
								undefined :
								() => <InnerBlocks.ButtonBlockAppender />
						}
					/>
				</DivBackground>
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
	withSelect( ( select, ownProps ) => {
		const { clientId } = ownProps
		const { getBlockOrder } = select( 'core/block-editor' )

		return {
			hasInnerBlocks: getBlockOrder( clientId ).length > 0,
		}
	} ),
)( edit )
