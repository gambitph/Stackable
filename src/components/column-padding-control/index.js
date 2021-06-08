/**
 * External dependencies
 */
import {
	SpacingControl,
} from '~stackable/components'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'

const ColumnPaddingControl = props => {
	const {
		label,
		setAttributes,
		enablePaddingTop,
		enablePaddingRight,
		enablePaddingBottom,
		enablePaddingLeft,
	} = props

	const {
		columnPaddingTop = '',
		columnPaddingBottom = '',
		columnPaddingRight = '',
		columnPaddingLeft = '',
		columnPaddingUnit = 'px',

		tabletColumnPaddingTop = '',
		tabletColumnPaddingBottom = '',
		tabletColumnPaddingRight = '',
		tabletColumnPaddingLeft = '',
		tabletColumnPaddingUnit = 'px',

		mobileColumnPaddingTop = '',
		mobileColumnPaddingBottom = '',
		mobileColumnPaddingRight = '',
		mobileColumnPaddingLeft = '',
		mobileColumnPaddingUnit = 'px',
	} = props.attributes

	return <Fragment>
		<SpacingControl
			label={ label }
			className="ugb--help-tip-advanced-column-paddings"
			defaultLocked={ true }
			min={ [ 0, 0, 0 ] }
			max={ [ 500, 100, 100 ] }
			step={ 1 }

			valueDesktop={ {
				top: columnPaddingTop,
				right: columnPaddingRight,
				bottom: columnPaddingBottom,
				left: columnPaddingLeft,
			} }
			valueDesktopUnit={ columnPaddingUnit }
			onChangeDesktop={ paddings => {
				setAttributes( {
					columnPaddingTop: paddings.top,
					columnPaddingRight: paddings.right,
					columnPaddingBottom: paddings.bottom,
					columnPaddingLeft: paddings.left,
				} )
			} }
			onChangeDesktopUnit={ columnPaddingUnit => setAttributes( { columnPaddingUnit } ) }

			valueTablet={ {
				top: tabletColumnPaddingTop,
				right: tabletColumnPaddingRight,
				bottom: tabletColumnPaddingBottom,
				left: tabletColumnPaddingLeft,
			} }
			valueTabletUnit={ tabletColumnPaddingUnit }
			onChangeTablet={ paddings => {
				setAttributes( {
					tabletColumnPaddingTop: paddings.top,
					tabletColumnPaddingBottom: paddings.bottom,
					tabletColumnPaddingRight: paddings.right,
					tabletColumnPaddingLeft: paddings.left,
				} )
			} }
			onChangeTabletUnit={ tabletColumnPaddingUnit => setAttributes( { tabletColumnPaddingUnit } ) }

			valueMobile={ {
				top: mobileColumnPaddingTop,
				right: mobileColumnPaddingRight,
				bottom: mobileColumnPaddingBottom,
				left: mobileColumnPaddingLeft,
			} }
			valueMobileUnit={ mobileColumnPaddingUnit }
			onChangeMobile={ paddings => {
				setAttributes( {
					mobileColumnPaddingTop: paddings.top,
					mobileColumnPaddingBottom: paddings.bottom,
					mobileColumnPaddingRight: paddings.right,
					mobileColumnPaddingLeft: paddings.left,
				} )
			} }
			onChangeMobileUnit={ mobileColumnPaddingUnit => setAttributes( { mobileColumnPaddingUnit } ) }

			enableTop={ enablePaddingTop }
			enableRight={ enablePaddingRight }
			enableBottom={ enablePaddingBottom }
			enableLeft={ enablePaddingLeft }
		/>
	</Fragment>
}

ColumnPaddingControl.defaultProps = {
	setAttributes: () => {},
	label: __( 'Column Paddings', i18n ),
	attributes: {},
	enablePaddingTop: true,
	enablePaddingRight: true,
	enablePaddingBottom: true,
	enablePaddingLeft: true,
}

export default ColumnPaddingControl
