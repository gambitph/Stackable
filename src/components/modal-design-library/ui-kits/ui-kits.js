/**
 * Internal deprendencies
 */
import Sidebar from '../sidebar'
import Cover from '../cover'
import ControlSeparator from '../../control-separator'
import Topbar from '../topbar'
import FeaturedList from '../featured-list'

import PreviewInfo from './preview-info'

/**
 * External deprendencies
 */
import { i18n, isPro } from 'stackable'
import { AdvancedToolbarControl } from '~stackable/components'

/**
 * WordPress deprendencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { Button } from '@wordpress/components'
import ProControl from '~stackable/components/pro-control'

const UIKits = props => {
	const {
		setColumns,
		styleList,
		style,
		setStyle,
		search,
		setSearch,
		setPlan,
		plan,
		contentTitle,
		options,
		mood,
		setMood,
		columns,
		UIKits,
		isBusy,
		isDevMode,
		setIsDevMode,
		setDoReset,
		itemProps,
		previewMode,
		isApplyingDesign,
		previewInnerProps,
		onDesignSelect,
		backbuttonLabel,
		backButtonOnClick,
	} = props.moduleProps

	return (
		<Fragment>
			<aside className="ugb-modal-design-library__sidebar">
				<div className="ugb-modal-design-library__filters">

					{ ! previewMode && (
						<Fragment>
							<Sidebar
								options={ options }
								value={ plan }
								onSelect={ setPlan }
							/>

							<ControlSeparator />

							<Sidebar
								title={ __( 'Browse By Style', i18n ) }
								options={ styleList }
								value={ style }
								onSelect={ setStyle }
							/>
						</Fragment>
					) }

					{ !! previewMode && (
						<div className="ugb-modal-design-library__preview-sidebar">
							<Button
								className="ugb-modal-design-library__back-button"
								isLink
								onClick={ backButtonOnClick }
							>
								{ backbuttonLabel }
							</Button>
							{ ! isPro && (
								<ProControl
									title={ __( 'Upcoming Feature', i18n ) }
									description={ __( 'Build your website with a few clicks with our upcoming Premium feature that will let you use our predesigned templates with ease.', i18n ) }
									button={ __( 'Get Premium', i18n ) }
									showHideNote={ false }
								/>
							) }
						</div>
					) }

				</div>
			</aside>

			<aside className="ugb-modal-design-library__content">

				{ ! previewMode && (
					<Fragment>
						<Cover
							title={ __( 'Stackable UI Kits', i18n ) }
							description={ __( 'Need to design a website ASAP? We\'ve got you covered with our brand new UI Kit designs.', i18n ) }
							placeholder={ __( 'Ex. Corporate, Minimalist, etc.', i18n ) }
							value={ search }
							onChange={ setSearch }
							color={ [ '#a911b9', '#e54476' ] }
						/>

						<div className="ugb-modal-design-library__content-body">
							<Topbar
								setColumns={ setColumns }
								columns={ setColumns }
								setIsDevMode={ setIsDevMode }
								isDevMode={ isDevMode }
								setDoReset={ setDoReset }
							>
								<AdvancedToolbarControl
									controls={ [
										{
											value: '',
											title: __( 'All', i18n ),
										},
										{
											value: 'light',
											title: __( 'Light', i18n ),
										},
										{
											value: 'dark',
											title: __( 'Dark', i18n ),
										},
									] }
									value={ mood }
									onChange={ setMood }
								/>
							</Topbar>

							<FeaturedList
								title={ contentTitle }
								columns={ columns }
								isBusy={ isBusy }
								onSelect={ undefined }
								options={ UIKits }
								itemProps={ itemProps }
							/>
						</div>

					</Fragment>
				) }

				{ !! previewMode && (
					<Fragment>

						<div className="ugb-modal-design-library__content-body">

							{ previewMode.plan === 'premium' && (
								<div className="ugb-modal-design-library__premium-tag">
									{ __( 'Premium', i18n ) }
								</div>
							) }

							<Topbar
								setColumns={ setColumns }
								columns={ columns }
								setIsDevMode={ setIsDevMode }
								isDevMode={ isDevMode }
								setDoReset={ setDoReset }
							>
								<div className="ugb-design-library__ui-kit-topbar-wrapper">
									<div className="ugb-design-library__ui-kit-header-text">
										<h2>{ previewMode.label }</h2>
										<p>{ previewMode.description }</p>
									</div>
									<Button
										disabled
										isSecondary
									>
										{ __( 'Apply UI Kit to Site - Coming Soon!', i18n ) }
									</Button>
								</div>
							</Topbar>

							<PreviewInfo
								colors={ previewMode.colors }
							/>

							<FeaturedList
								columns={ columns }
								isBusy={ isBusy }
								onSelect={ onDesignSelect }
								options={ previewMode.blockList }
								itemProps={ previewInnerProps }
								itemIsBusy={ isApplyingDesign }
							/>

						</div>

					</Fragment>
				) }

			</aside>

		</Fragment>
	)
}

UIKits.defaultProps = {
	moduleProps: {},
}

export default UIKits
