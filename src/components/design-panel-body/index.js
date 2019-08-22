/**
 * A Panel for selecting designs
 */

/**
 * External dependencies
 */
import { DesignControl } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import classnames from 'classnames'
import { i18n } from 'stackable'
import { omit } from 'lodash'
import { PanelBody } from '@wordpress/components'

function DesignPanelBody( props ) {
	const {
		options,
		selected,
		title = __( 'Layout', i18n ),
		selectedOptionInTitle = true,
		help = '',
		className = '',
		initialOpen = true,
	} = props
	const selectedOption = options ? options.find( opt => opt.value === selected ) : null
	const panelTitle = selectedOption ? `${ title } – ${ selectedOption.label }` : title
	const mainClasses = classnames( [ 'ugb-design-panel-body', className ] )

	return (
		<PanelBody
			title={ selectedOptionInTitle ? <span>{ panelTitle }</span> : title }
			className={ mainClasses }
			initialOpen={ initialOpen }
			{ ...omit( props, [ 'help' ] ) }
		>
			{ help &&
				<p className="components-base-control__help">{ help }</p>
			}
			{ options &&
				<DesignControl { ...omit( props, [ 'help', 'title' ] ) } />
			}
			{ props.children }
		</PanelBody>
	)
}

export default DesignPanelBody
