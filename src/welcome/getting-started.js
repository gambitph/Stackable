
/**
 * Internal dependencies
 */
import SVGTutorialsIcon from './images/tutorials.svg'
import SVGDocsIcon from './images/docs.svg'
import SVGCommunityIcon from './images/user.svg'
import SVGArrowUpRightIcon from './images/arrow-up-right.svg'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

/**
 * External dependencies
 */
import { i18n } from 'stackable'

const generalProps = [
	{
		title: __( 'Tutorials', i18n ),
		subtitle: __( 'Get to know the plugin and start your journey with our brand new Stackable Courses.', i18n ),
		link: 'https://wpstackable.com/learn/?utm_source=plugin&utm_medium=getting_started&utm_campaign=tutorial_button',
		icon: <SVGTutorialsIcon />,
	},
	{
		title: __( 'Documentation and Support', i18n ),
		subtitle: __( 'Get assistance with troubleshooting, guides, FAQs, and updates.', i18n ),
		link: 'https://docs.wpstackable.com/',
		icon: <SVGDocsIcon />,
	},
	{
		title: __( 'Community', i18n ),
		subtitle: __( 'Join our very active Stackable Community on Facebook.', i18n ),
		link: 'https://www.facebook.com/groups/wpstackable/',
		icon: <SVGCommunityIcon />,
	},
]

const essentialsProps = [
	{
		title: __( 'Flexbox Controls', i18n ),
		subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
		src: 'https://www.youtube.com/embed/73N9uXnpUJE',
		url: '#',
	},
	{
		title: __( 'How to Customize Blocks', i18n ),
		subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
		src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
		url: '#',
	},
	{
		title: __( 'How to Use Copy & Paste Styles', i18n ),
		subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
		src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
		url: '#',
	},
	{
		title: __( 'Introduction to Wireframes', i18n ),
		subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
		src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
		url: '#',
	},
	{
		title: __( 'How to Use the Design Library', i18n ),
		subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
		src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
		url: '#',
	},
	{
		title: __( 'How to Use the Column Blocks', i18n ),
		subtitle: __( 'Lorem ipsum dolor sit amet consectetur. Molestie in arcu est feugiat pulvinar sit.', i18n ),
		src: 'https://www.youtube.com/embed/MaXOZ-1UIvs',
		url: '#',
	},
]

const GeneralCard = ( {
	title, subtitle, link, icon,
} ) => {
	return <a href={ link } className="s-card s-card-link" target="_blank" rel="noreferrer">
		<div className="s-icon-wrapper"> { icon } </div>
		<h3 className="s-card-title"> { title } </h3>
		<p className="s-card-subtitle"> { subtitle } </p>
		<div className="s-bottom-icon-wrapper"> <SVGArrowUpRightIcon /> </div>
	</a>
}

const EssentialsCard = ( {
	title, subtitle, src,
} ) => {
	return <div className="s-card">
		<div className="s-video-wrapper s-card-top">
			<iframe className="s-video" src={ src } title={ title } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
		</div>
		<h3 className="s-card-title"> { title } </h3>
		<p className="s-card-subtitle"> { subtitle } </p>
	</div>
}

export const GettingStarted = () => {
	return <>
		<div className="s-body">

			<div className="s-getting-started__centered">
				<h2 className="title"> { __( 'Unleash the Full Potential of the WordPress Block Editor by Turning It into a Page Builder', i18n ) } </h2>
				<p className="subtitle">{ __( 'Learn the essentials in just a few minutes by watching this video. Scroll down to see more quick tutorials.', i18n ) } </p>

				<div className="s-video-wrapper s-getting-started-video">
					<iframe className="s-video" src="https://www.youtube.com/embed/MaXOZ-1UIvs" title={ __( 'Getting Started', i18n ) } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
				</div>

				<div className="s-button-container"><a href="/wp-admin/post-new.php?post_type=page" target="_new" className="s-button s-secondary-button uppercase">
					{ __( 'Create a new page', i18n ) }
				</a></div>
			</div>

			<div className="s-getting-started__section">
				<div className="s-card-container s-card-general">
					{ generalProps.map( ( item, key ) => {
						return <GeneralCard { ...item } key={ key } />
					} ) }
				</div>
			</div>
			<div className="s-getting-started__section">
				<div className="s-card-header">
					<h2> { __( 'Learn the essentials', i18n ) } </h2>
					<p> { __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat tempus sollicitudin rhoncus pretium tellus.', i18n ) } </p>
				</div>
				<div className="s-card-container s-card-essentials">
					{ essentialsProps.map( ( item, key ) => {
						return <EssentialsCard { ...item } key={ key } />
					} ) }
				</div>
			</div>

			<div className="s-getting-started__footer-banner">
				<div className="s-banner-wrapper">
					<div className="s-banner-content">
						<h2> { __( 'Check out our library of tutorials and guides', i18n ) } </h2>
						<p> { __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat tempus sollicitudin rhoncus pretium tellus.', i18n ) } </p>
					</div>
					<div className="s-button-container"><a href="https://wpstackable.com/learn/?utm_source=plugin&utm_medium=getting_started&utm_campaign=tutorial_button" target="_blank" rel="noreferrer" className="s-button s-secondary-button">
						{ __( 'Go to Stackable Learn', i18n ) }
					</a></div>
				</div>
			</div>
		</div>
	</>
}
