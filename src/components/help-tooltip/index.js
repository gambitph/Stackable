/**
 * Internal dependencies
 */
import getVideoUrl from './videos'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	CheckboxControl, Dashicon, PanelBody, Popover,
} from '@wordpress/components'
import { __ } from '@wordpress/i18n'

const NOOP = () => {}

const HelpTooltip = props => {
	return <Popover
		className="stk-control-help-tooltip"
		title={ props.title }
		focusOnMount={ false }
		placement="left"
		offset={ 28 }
		noArrow={ false }
		onFocusOutside={ props.onClose }
	>
		<PanelBody>
			<button
				className="stk-control-help-tooltip__remove"
				onClick={ props.onClose }
			>
				<Dashicon icon="no-alt" />
			</button>
			{ props.video &&
				<video
					width="600"
					autoPlay
					loop
					muted
					playsInline
					src={ getVideoUrl( props.video ) }
				/>
			}
			<h4>{ props.title }</h4>
			<p>{ props.description }</p>
			<CheckboxControl
				label={ __( 'Stop showing tooltips', i18n ) }
				className="ugb-help-tooltip__checkbox"
				checked={ ! props.tooltipsEnabled }
				onChange={ checked => props.onTooltipsEnabledChange( ! checked ) }
			/>
		</PanelBody>
	</Popover>
}

HelpTooltip.defaultProps = {
	title: '',
	video: '',
	description: '',
	onClose: NOOP,
	tooltipsEnabled: true,
	onTooltipsEnabledChange: NOOP,
}

export default HelpTooltip
