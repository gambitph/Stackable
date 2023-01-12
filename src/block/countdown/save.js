import { CountdownStyles } from './style'
import { CountdownNumber } from './countdown-number'

import {
	BlockDiv,
	ContainerDiv,
	Divider,
	getResponsiveClasses,
	getTypographyClasses,
	Typography,
} from '~stackable/block-components'
import { version as VERSION } from 'stackable'
import classnames from 'classnames'
import { withVersion } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose'

const SECONDS = 1000
const SECONDS_IN_MINUTE = SECONDS * 60
const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24

const Save = props => {
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

	const blockClassNames = classnames( [
		className,
		'stk-block-countdown',
		responsiveClass,
	] )

	const contentClassNames = classnames( [
		'stk-block-content',
	] )

	const dayDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_day',
		digitTextClasses,
	] )

	const hourDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_hour',
		digitTextClasses,
	] )

	const minuteDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_minute',
		digitTextClasses,
	] )

	const secondDigitClassNames = classnames( [
		'stk-block-countdown__digit',
		'stk-block-countdown__digit_second',
		digitTextClasses,
	] )

	const labelClassNames = classnames( [
		'stk-block-countdown__label',
		labelTextClasses,
	] )

	const dividerClassNames = classnames( [
		'stk-block-countdown__divider',
	] )

	return (
		<BlockDiv.Content
			className={ blockClassNames }
			attributes={ attributes }
			data-stk-countdown-date={ attributes.date }
			data-stk-countdown-duration={ duration }
			data-stk-countdown-restart-interval={ attributes.restartInterval }
			data-stk-countdown-type={ attributes.countdownType }
		>
			<CountdownStyles.Content version={ props.version } attributes={ attributes } />
			<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
				<CountdownNumber.Content className={ dayDigitClassNames } />
				<Typography.Content
					className={ labelClassNames }
					attrNameTemplate="day%s"
					attributes={ attributes }
				/>
			</ContainerDiv.Content>
			{ attributes?.hasDivider && <Divider.Content className={ dividerClassNames } attributes={ attributes } /> }
			<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
				<CountdownNumber.Content className={ hourDigitClassNames } />
				<Typography.Content
					className={ labelClassNames }
					attrNameTemplate="hour%s"
					attributes={ attributes }
				/>
			</ContainerDiv.Content>
			{ attributes?.hasDivider && <Divider.Content className={ dividerClassNames } attributes={ attributes } /> }
			<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
				<CountdownNumber.Content className={ minuteDigitClassNames } />
				<Typography.Content
					className={ labelClassNames }
					attrNameTemplate="minute%s"
					attributes={ attributes }
				/>
			</ContainerDiv.Content>
			{ attributes?.hasDivider && <Divider.Content className={ dividerClassNames } attributes={ attributes } /> }
			<ContainerDiv.Content className={ contentClassNames } attributes={ attributes }>
				<CountdownNumber.Content className={ secondDigitClassNames } />
				<Typography.Content
					className={ labelClassNames }
					attrNameTemplate="second%s"
					attributes={ attributes }
				/>
			</ContainerDiv.Content>
		</BlockDiv.Content>
	)
}

export default compose(
	withVersion( VERSION )
)( Save )
