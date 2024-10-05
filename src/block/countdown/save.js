import { CountdownNumber } from './countdown-number'
import { Divider } from './divider'
import { getCountdownAlignment } from './edit'

import {
	BlockDiv,
	ContainerDiv,
	getResponsiveClasses,
	getTypographyClasses,
	Typography,
	CustomCSS,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

const SECONDS = 1
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

export const Save = props => {
	const {
		className,
		attributes,
	} = props

	let duration = ''

	if ( attributes.countdownType === 'recurring' ) {
		// Convert into milli seconds
		duration =
			( attributes.daysLeft * SECONDS_IN_DAY ) +
			( attributes.hoursLeft * SECONDS_IN_HOUR ) +
			( attributes.minutesLeft * SECONDS_IN_MINUTE ) +
			( attributes.secondsLeft * SECONDS )
	}

	const responsiveClass = getResponsiveClasses( props.attributes )

	const digitTextClasses = getTypographyClasses( attributes, 'digit%s' )

	const labelTextClasses = getTypographyClasses( attributes, 'label%s' )

	const messageTextClasses = getTypographyClasses( attributes, 'message%s' )

	const blockClassNames = classnames( [
		className,
		'stk-block-countdown',
		responsiveClass,
		getCountdownAlignment( attributes ),
	] )

	const contentClassNames = classnames( [
		'stk-block-countdown__content-container',
	] )

	const dayDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit-day',
		digitTextClasses,
	] )

	const hourDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit-hour',
		digitTextClasses,
	] )

	const minuteDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit-minute',
		digitTextClasses,
	] )

	const secondDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit-second',
		digitTextClasses,
	] )

	const dayLabelClassNames = classnames( [
		'stk-block-countdown__label-day',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const hourLabelClassNames = classnames( [
		'stk-block-countdown__label-hour',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const minuteLabelClassNames = classnames( [
		'stk-block-countdown__label-minute',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const secondLabelClassNames = classnames( [
		'stk-block-countdown__label-second',
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const messageClassNames = classnames( [
		'stk-block-countdown__message',
		messageTextClasses,
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			data-stk-countdown-date={ attributes.date }
			data-stk-countdown-duration={ duration }
			data-stk-countdown-restart-interval={ attributes.restartInterval }
			data-stk-countdown-type={ attributes.countdownType }
			data-stk-countdown-action={ attributes.actionOnExpiration }
			data-stk-countdown-timezone={ attributes.timezone }
			data-stk-countdown-is-double-digit={ attributes.isDoubleDigitHidden }
			version={ props.version }
			data-v={ props.attributes.version }
		>
			<CustomCSS.Content attributes={ attributes } />
			<div className="stk-block-countdown__container">
				{ attributes.generatedCss && <style>{ attributes.generatedCss }</style> }
				{ attributes.dayShow &&
					<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
						<div className="stk-block-countdown__container-wrapper">
							<CountdownNumber.Content className={ dayDigitClassNames } />
							<Typography.Content
								className={ dayLabelClassNames }
								attrNameTemplate="day%s"
								attributes={ attributes }
							/>
						</div>
					</ContainerDiv.Content>
				}
				{ attributes.hasDivider && attributes.dayShow && <Divider.Content attributes={ attributes } /> }
				{ attributes.hourShow &&
					<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
						<div className="stk-block-countdown__container-wrapper">
							<CountdownNumber.Content className={ hourDigitClassNames } />
							<Typography.Content
								className={ hourLabelClassNames }
								attrNameTemplate="hour%s"
								attributes={ attributes }
							/>
						</div>
					</ContainerDiv.Content>
				}
				{ attributes.hasDivider && attributes.hourShow && <Divider.Content attributes={ attributes } /> }
				{ attributes.minuteShow &&
					<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
						<div className="stk-block-countdown__container-wrapper">
							<CountdownNumber.Content className={ minuteDigitClassNames } />
							<Typography.Content
								className={ minuteLabelClassNames }
								attrNameTemplate="minute%s"
								attributes={ attributes }
							/>
						</div>
					</ContainerDiv.Content>
				}
				{ attributes.hasDivider && attributes.minuteShow && attributes.secondShow && <Divider.Content attributes={ attributes } /> }
				{ attributes.secondShow &&
					<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
						<div className="stk-block-countdown__container-wrapper">
							<CountdownNumber.Content className={ secondDigitClassNames } />
							<Typography.Content
								className={ secondLabelClassNames }
								attrNameTemplate="second%s"
								attributes={ attributes }
							/>
						</div>
					</ContainerDiv.Content>
				}
			</div>
			{ attributes.actionOnExpiration === 'showMessage' &&
				<Typography.Content
					className={ messageClassNames }
					attrNameTemplate="message%s"
					attributes={ attributes }
				/>
			}
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
