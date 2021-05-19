/**
 * Internal dependencies
 */
import { Fragment } from '@wordpress/element'
import {
	BorderStyle, SizeStyle, BackgroundStyle,
} from '../helpers'

export const Style = props => {
	const options = {
		attrNameTemplate: 'block%s',
	}

	return (
		<Fragment>
			{ props.attributes.hasBackground && <BackgroundStyle { ...props } options={ options } /> }
			<BorderStyle { ...props } options={ options } />
			<SizeStyle { ...props } options={ options } />
		</Fragment>
	)
}

Style.Content = props => {
	const options = {
		attrNameTemplate: 'block%s',
	}

	return (
		<Fragment>
			{ props.attributes.hasBackground && <BackgroundStyle.Content { ...props } options={ options } /> }
			<BorderStyle.Content { ...props } options={ options } />
			<SizeStyle.Content { ...props } options={ options } />
		</Fragment>
	)
}
