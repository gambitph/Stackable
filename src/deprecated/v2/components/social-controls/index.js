/**
 * External dependencies
 */
import {
	AdvancedToggleControl,
	ControlSeparator,
} from '~stackable/components'
import { ButtonControlsHelper } from '..'
import { SOCIAL_SITES } from '~stackable/util'
import { getPropsWithDefaults } from '../../../../util/props'
import { upperFirst } from 'lodash'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { TextControl } from '@wordpress/components'
import {
	__, _x, sprintf,
} from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const SocialControls = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, SOCIAL_CONTROLS_DEFAULT_PROPS )
	return (
		<Fragment>
			{ props.socialUrlFields &&
				<Fragment>
					{ Object.keys( SOCIAL_SITES ).map( socialId =>
						<TextControl
							key={ socialId }
							className="ugb-social-url-text-control"
							label={ sprintf( _x( '%s Link', 'name', i18n ), SOCIAL_SITES[ socialId ].label ) }
							value={ props[ `${ socialId }Url` ] }
							onChange={ props[ `onChange${ upperFirst( socialId ) }Url` ] }
							placeholder="http://"
						/>
					) }
				</Fragment>
			}

			{ props.onChangeNewTab && (
				<AdvancedToggleControl
					label={ __( 'Open link in new tab', i18n ) }
					checked={ props.newTab }
					onChange={ props.onChangeNewTab }
				/>
			) }

			<ControlSeparator />

			<ButtonControlsHelper
				attrNameTemplate={ props.attrNameTemplate }
				setAttributes={ props.setAttributes }
				blockAttributes={ props.blockAttributes }
				useSocialColors={ props.useSocialColors }
				onChangeUseSocialColors={ props.onChangeUseSocialColors }
				onChangeUrl={ false }
				onChangeNewTab={ false }
				onChangeNoFollow={ false }
				onChangeIcon={ false }
				hasTypography={ false }
			/>
		</Fragment>
	)
}

const SOCIAL_CONTROLS_DEFAULT_PROPS = {
	attrNameTemplate: '%s',
	setAttributes: () => {},
	blockAttributes: {},
	socialUrlFields: true,

	newTab: false,
	onChangeNewTab: () => {},
	useSocialColors: true,
	onChangeUseSocialColors: () => {},
}

export default SocialControls
