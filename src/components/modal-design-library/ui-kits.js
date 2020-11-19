/**
 * Internal deprendencies
 */
import Sidebar from './sidebar'
import Cover from './cover'
import ControlSeparator from '../control-separator'
import Topbar from './topbar'
import FeaturedList from './featured-list'
import useBlockDesigns from './use-block-designs'

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
	} = useBlockDesigns( props )

	return (
		<Fragment>
			<aside className="ugb-modal-design-library__sidebar">
				<div className="ugb-modal-design-library__filters">

					<Sidebar
						options={ [
							{
								label: __( 'All UI Kits', i18n ),
								value: '',
							},
							{
								label: __( 'Free UI Kits', i18n ),
								value: 'free',
							},
							{
								label: __( 'Premium UI Kits', i18n ),
								value: 'premium',
							},
						] }
						value={ plan }
						onSelect={ setPlan }
					/>

					<ControlSeparator />

					<Sidebar
						title={ __( 'Browse By Style', i18n ) }
						options={ blockList }
						value={ block }
						onSelect={ setBlock }
					/>

				</div>
			</aside>

			<aside className="ugb-modal-design-library__content">

				<Cover
					title={ __( 'Stackable UI Kits', i18n ) }
					description={ __( 'Need to design a website ASAP? We\'ve got you covered with our brand new UI Kit designs.', i18n ) }
					placeholder={ __( 'Ex. Corporate, Minimalist, etc.', i18n ) }
					value={ search }
					onChange={ setSearch }
					color={ [ '#a911b9', '#e54476' ] }
				/>

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
					title={ __( 'All UI Kits', i18n ) }
					columns={ columns }
					isBusy={ isBusy }
					onSelect={ onDesignSelect }
					options={ designs }
				/>
			</aside>

		</Fragment>
	)
}

export default BlockDesigns
