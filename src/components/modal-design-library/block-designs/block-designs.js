/**
 * Internal deprendencies
 */
import Sidebar from '../sidebar'
import Cover from '../cover'
import ControlSeparator from '../../control-separator'
import Topbar from '../topbar'
import FeaturedList from '../featured-list'

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

const BlockDesigns = props => {
	const {
		itemProps,
		options,
		contentTitle,
		columns,
		plan,
		block,
		mood,
		search,
		isBusy,
		blockList,
		designs,
		isDevMode,
		onDesignSelect,
		setIsDevMode,
		setColumns,
		setPlan,
		setBlock,
		setMood,
		setSearch,
		setDoReset,
		isApplyingDesign,
	} = props.moduleProps

	return (
		<Fragment>
			<aside className="ugb-modal-design-library__sidebar">
				<div className="ugb-modal-design-library__filters">

					<Sidebar
						options={ options }
						value={ plan }
						onSelect={ setPlan }
						forceDisabledExcept={ props.selectedBlock ? [ 'free', 'premium' ] : null }
					/>

					<ControlSeparator />

					<Sidebar
						title={ __( 'Browse By Block', i18n ) }
						options={ blockList }
						value={ block }
						onSelect={ setBlock }
						forceDisabledExcept={ props.selectedBlock ? props.selectedBlock : null }
					/>

				</div>
			</aside>

			<aside className="ugb-modal-design-library__content">

				<Cover
					title={ __( 'Stackable Block Designs', i18n ) }
					description={ __( 'Choose from over 200 predesigned templates you can customize with Stackable.', i18n ) }
					placeholder={ __( 'Ex: Corporate, Minimalist, Header, etc.', i18n ) }
					value={ search }
					onChange={ setSearch }
				/>

				<div className="ugb-modal-design-library__content-body">
					<Topbar
						setColumns={ setColumns }
						columns={ columns }
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
						onSelect={ onDesignSelect }
						options={ designs }
						itemProps={ itemProps }
						itemIsBusy={ isApplyingDesign }
					/>
				</div>

			</aside>

		</Fragment>
	)
}

BlockDesigns.defaultProps = {
	moduleProps: {},
}

export default BlockDesigns
