// TODO: Search and replace BLOCKSLUG with slug of block e.g. "heading"
/**
 * Internal dependencies
 */
import createStyles from './style'
import ImageDesignBasic from './images/basic.png'
import ImageDesignPlain from './images/plain.png'
import { showOptions } from './util'

/**
 * External dependencies
 */
import {
	BlockContainer,
	DesignPanelBody,
	ContentAlignControl,
	AdvancedRangeControl,
	PanelAdvancedSettings,
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
import { cacheImageData } from '~stackable/util'
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
import { withSelect } from '@wordpress/data'

addFilter( 'stackable.BLOCKSLUG.edit.inspector.layout.before', 'stackable/BLOCKSLUG', ( output, props ) => {
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
				options={ applyFilters( 'stackable.BLOCKSLUG.edit.layouts', [
					{
						label: __( 'Basic', i18n ), value: 'basic', image: ImageDesignBasic,
					},
					{
						label: __( 'Plain', i18n ), value: 'plain', image: ImageDesignPlain,
					},
					// TODO: add more free layouts if supported.
				] ) }
				onChange={ design => setAttributes( { design } ) }
			/>
		</Fragment>
	)
} )

addFilter( 'stackable.BLOCKSLUG.edit.inspector.style.before', 'stackable/BLOCKSLUG', ( output, props ) => {
	const { setAttributes } = props
	const {
		columns,
		borderRadius = '',
		shadow = '',
	} = props.attributes

	const show = showOptions( props )

	return (
		<Fragment>
			{ output }
			<PanelAdvancedSettings 
				title={ __( 'General', i18n ) }
				initialOpen={ true }
			>
				<AdvancedRangeControl
					label={ __( 'Columns', i18n ) }
					value={ columns }
					onChange={ columns => setAttributes( { columns } ) }
					min={ 1 }
					max={ 4 }
					className="ugb--help-tip-general-columns"
				/>
				{ show.columnBackground &&
					<AdvancedRangeControl
						label={ __( 'Border Radius', i18n ) }
						value={ borderRadius }
						onChange={ borderRadius => setAttributes( { borderRadius } ) }
						min={ 0 }
						max={ 50 }
						allowReset={ true }
						placeholder="12"
						className="ugb--help-tip-general-border-radius"
					/>
				}
				{ show.columnBackground &&
					<AdvancedRangeControl
						label={ __( 'Shadow / Outline', i18n ) }
						value={ shadow }
						onChange={ shadow => setAttributes( { shadow } ) }
						min={ 0 }
						max={ 9 }
						allowReset={ true }
						placeholder="3"
						className="ugb--help-tip-general-shadow"
					/>
				}
				<ContentAlignControl
					setAttributes={ setAttributes }
					blockAttributes={ props.attributes }
				/>
			</PanelAdvancedSettings>
			{ /* TODO: Add more edit controls. */ }
		</Fragment>
	)
} )

const edit = props => {
	const {
		className,
		setAttributes,
	} = props

	const {
		design = 'basic',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-BLOCKSLUG--v2',
		`ugb-BLOCKSLUG--design-${ design }`,
	], applyFilters( 'stackable.BLOCKSLUG.mainclasses', {
	}, props ) )

	return (
		<BlockContainer.Edit className={ mainClasses } blockProps={ props } render={ () => (
			<Fragment>
				{ /* TODO: add block edit rendered markup here */ }
			</Fragment>
		) } />
	)
}

export default compose(
	withUniqueClass,
	withSetAttributeHook,
	withGoogleFont,
	withTabbedInspector(),
	// TODO: add attribute names of all alignment attributes that will be reset when the main align option is set.
	withContentAlignReseter( [ 'Icon%sAlign', 'Number%sAlign', 'Title%sAlign', 'Description%sAlign' ] ),
	withBlockStyles( createStyles, { editorMode: true } ),
	withClickOpenInspector( [
		// TODO: remove / add the elements that when clicked will open the inspector.
		[ '.ugb-BLOCKSLUG__item', 'column-background' ],
		[ '.ugb-BLOCKSLUG__title', 'title' ],
		[ '.ugb-BLOCKSLUG__counter', 'number' ],
		[ '.ugb-BLOCKSLUG__description', 'description' ],
		[ '.ugb-button', 'button' ],
	] ),
	// TODO: If the block uses images, add the image attributes here so that the image sizes will be cached in the editor.
	// withSelect( ( select, props ) => {
	// 	// Once the editor is loaded, cache the other sizes of the image.
	// 	cacheImageData( props.attributes.imageId, select )
	// } ),
)( edit )
