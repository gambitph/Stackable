/**
 * A Panel for selecting designs
 */
/**
 * External dependencies
 */
import classnames from 'classnames'
import { i18n } from 'stackable'
import { useGlobalState } from '~stackable/util/global-state'

/**
 * WordPress dependencies
 */
import { Fragment, useState } from '@wordpress/element'
import { FormToggle, PanelBody } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { useBlockEditContext } from '@wordpress/block-editor'

const PanelAdvancedSettings = props => {
	// Remember whether this panel was open/closed before.
	const { isSelected, name } = useBlockEditContext()
	const [ tab ] = useGlobalState( `tabCache-${ name }`, 'style' )
	const [ initialOpen, setInitialOpen ] = useGlobalState( `panelCache-${ name }-${ tab }-${ props.title }`, props.initialOpen )

	const [ isOpen, setIsOpen ] = useState( initialOpen )
	const [ showAdvanced, setShowAdvanced ] = useState( props.initialAdvanced )

	const hasToggle = props.hasToggle && props.onChange

	const onToggle = () => {
		setIsOpen( ! isOpen )
		setInitialOpen( ! isOpen )
		if ( props.onToggle ) {
			props.onToggle( ! isOpen )
		}
	}

	const mainClasses = classnames( [
		props.className,
		'ugb-toggle-panel-body',
	], {
		'ugb-toggle-panel-body--advanced': showAdvanced,
		[ `ugb-panel--${ props.id }` ]: props.id,
	} )

	const title = (
		<Fragment>
			{ hasToggle && (
				<span className={ `editor-panel-toggle-settings__panel-title` }>
					<FormToggle
						className="ugb-toggle-panel-form-toggle"
						checked={ props.checked }
						onClick={ ev => {
							ev.stopPropagation()
							ev.preventDefault()
							const checked = props.checked
							if ( checked && isOpen ) {
								// Comment this out since it jumps the inspector.
								// this.onToggle()
							} else if ( ! checked && ! isOpen ) {
								onToggle()
							}
							if ( props.onChange ) {
								props.onChange( ! checked )
							}
						} }
						aria-describedby={ props.title }
					/>
					{ props.title }
				</span>
			) }
			{ ! hasToggle && props.title }
		</Fragment>
	)

	return ( isSelected || ! name ) && ( // If there's no name, then the panel is used in another place.
		<PanelBody
			className={ mainClasses }
			initialOpen={ initialOpen }
			onToggle={ onToggle }
			opened={ props.isOpen !== null ? props.isOpen : isOpen }
			title={ title }
		>
			{ props.children }
			{ showAdvanced && props.advancedChildren }
			{ props.advancedChildren && (
				<button
					className="ugb-panel-advanced-button"
					onClick={ () => setShowAdvanced( ! showAdvanced ) }
				>{ showAdvanced ? __( 'Simple', i18n ) : __( 'Advanced', i18n ) }</button>
			) }
		</PanelBody>
	)
}

PanelAdvancedSettings.defaultProps = {
	id: '',
	className: '',
	title: __( 'Settings', i18n ),
	checked: false,
	onChange: null,
	initialOpen: false,
	hasToggle: true,
	initialAdvanced: false,
	advancedChildren: null,
	onToggle: () => {},
	isOpen: null,
}

export default PanelAdvancedSettings
