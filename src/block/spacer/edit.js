import { PanelBody, RangeControl } from '@wordpress/components'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import classnames from 'classnames'
import { Fragment } from '@wordpress/element'
import { InspectorControls } from '@wordpress/block-editor'
import { ProControl } from '@stackable/components'
import { showProNotice } from 'stackable'

const edit = props => {
	const { className } = props
	const {
		height,
		design = '',
	} = props.attributes

	const mainClasses = classnames( [
		className,
		'ugb-spacer',
	], applyFilters( 'stackable.spacer.mainclasses', {}, design, props ) )

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody>
					<RangeControl
						label={ __( 'Height' ) }
						value={ height }
						min="30"
						max="200"
						onChange={ height => {
							props.setAttributes( { height } )
						} }
					/>
				</PanelBody>
				{ showProNotice &&
					<PanelBody
						initialOpen={ false }
						title={ __( 'Custom CSS' ) }
					>
						<ProControl
							title={ __( 'Say Hello to Custom CSS 👋' ) }
							description={ __( 'Further tweak this block by adding guided custom CSS rules. This feature is only available on Stackable Premium' ) }
						/>
					</PanelBody>
				}
				{ applyFilters( 'stackable.spacer.edit.inspector.after', null, design, props ) }
			</InspectorControls>
			<div className={ mainClasses } style={ { height: height + 'px' } }>
				{ applyFilters( 'stackable.spacer.edit.output.before', null, design, props ) }
			</div>
		</Fragment>
	)
}

export default edit
