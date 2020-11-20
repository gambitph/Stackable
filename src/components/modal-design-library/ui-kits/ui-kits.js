/**
 * Internal deprendencies
 */
import Sidebar from '../sidebar'
import Cover from '../cover'
import ControlSeparator from '../../control-separator'
import Topbar from '../topbar'
import FeaturedList from '../featured-list'

import PreviewCover from './preview-cover'
import PreviewInfo from './preview-info'

/**
 * External deprendencies
 */
import { i18n } from 'stackable'
import { AdvancedToolbarControl } from '~stackable/components'

/**
 * WordPress deprendencies
 */
import { __ } from '@wordpress/i18n'
import { Fragment } from '@wordpress/element'
import { Button } from '@wordpress/components'
import ProControl from '~stackable/components/pro-control'

// UI Kit Mock Home Design.
const TEST_UI_KIT_HOME = true
// UI Kit Mock Preview Design.
const TEST_UI_KIT_PREVIEW = false

const UIKits = props => {
	const {
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
		setColumns,
	} = props.moduleProps

	return (
		<Fragment>
			<aside className="ugb-modal-design-library__sidebar">
				<div className="ugb-modal-design-library__filters">

					{ TEST_UI_KIT_HOME && (
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

					{ TEST_UI_KIT_PREVIEW && (
						<div className="ugb-modal-design-library__preview-sidebar">
							<Button
								className="ugb-modal-design-library__back-button"
								isLink
							>
								{ __( 'Back to UI Kits', i18n ) }
							</Button>
							<ProControl
								title={ __( 'Upcoming Feature', i18n ) }
								description={ __( 'Build your website with a few clicks with our upcoming Premium feature that will let you use our predesigned templates with ease.', i18n ) }
								button={ __( 'Get Premium', i18n ) }
								button2={ __( 'Learn More', i18n ) }
								showHideNote={ false }
								showButton2={ true }
							/>
						</div>
					) }

				</div>
			</aside>

			<aside className="ugb-modal-design-library__content">

				{ TEST_UI_KIT_HOME && (
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
								setIsDevMode={ undefined }
								isDevMode={ undefined }
								setDoReset={ undefined }
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
								isBusy={ undefined }
								onSelect={ undefined }
								options={ undefined }
							/>
						</div>

					</Fragment>
				) }

				{ TEST_UI_KIT_PREVIEW && (
					<Fragment>

						<PreviewCover
							image={ 'https://beinglol.com/media/facebook-cover/Be-Yourself-facebook-covers-3141.jpeg' }
						/>

						<div className="ugb-modal-design-library__content-body">

							<Topbar
								setColumns={ undefined }
								columns={ undefined }
								setIsDevMode={ undefined }
								isDevMode={ undefined }
								setDoReset={ undefined }
							>
								<div className="ugb-design-library__ui-kit-topbar-wrapper">
									<div className="ugb-design-library__ui-kit-header-text">
										<h2>{ __( 'Peplum', i18n ) }</h2>
										<p>{ __( '8 Block Designs', i18n ) }</p>
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
								colors={ [
									'gray',
									'pink',
									'black',
									'white',
								] }
								typography={ [
									'Yeseva One',
									'Josefin Sans',
								] }
							/>

							<FeaturedList
								columns={ undefined }
								isBusy={ undefined }
								onSelect={ undefined }
								options={ undefined }
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
