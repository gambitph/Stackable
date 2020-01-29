/**
 * External dependencies
 */
import {
	createResponsiveStyles,
	createTypographyStyles,
	whiteIfDarkBlackIfLight,
	appendImportant,
	__getValue,
} from '~stackable/util'
import deepmerge from 'deepmerge'

/**
 * Internal dependencies
 */
import { showOptions } from './util'

export const createStyles = props => {
	const getValue = __getValue( props.attributes )

	const {
		columnBackgroundColor = '',
		design = 'basc',
		showReadmore = true,
	} = props.attributes

	const show = showOptions( props )

	const styles = []

	if ( ! show.columnBackground ) {
		styles.push( {
			'.ugb-blog-posts__featured-image': {
				borderRadius: appendImportant( getValue( 'borderRadius', '%spx' ) ),
			},
		} )
	}

	const {
		contentOrder = '',
	} = props.attributes
	if ( contentOrder && show.contentOrderStyles ) {
		// Values follow this pattern "category,title,meta,excerpt".
		contentOrder.split( ',' ).forEach( ( content, i ) => {
			const order = i === 0 ? 1 :
				i === 3 ? 10 :
					i + 3

			styles.push( {
				[ `.ugb-blog-posts__${ content }` ]: {
					order: appendImportant( order ),
				},
			} )

			// Always order the read more button right after the excerpt.
			if ( showReadmore && content === 'excerpt' ) {
				styles.push( {
					'.ugb-blog-posts__readmore': {
						order: appendImportant( order ),
					},
				} )
			}
		} )
	}

	// Image.
	const {
		showImage = true,
	} = props.attributes
	if ( showImage && show.imageHeight ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__featured-image img', 'image%sHeight', 'height', '%spx', props.attributes, true ) )
	}
	if ( showImage && show.imageWidth && design === 'list' ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__item', 'image%sWidth', 'gridTemplateColumns', '%spx minmax(0, 1fr)', props.attributes, true ) )
	}

	// Category.
	const {
		categoryHighlighted = false,
		categoryColor = '',
		showCategory = true,
	} = props.attributes
	if ( showCategory ) {
		if ( categoryHighlighted ) {
			styles.push( {
				'.ugb-blog-posts__category a': {
					backgroundColor: appendImportant( getValue( 'categoryColor' ) ),
					color: appendImportant( whiteIfDarkBlackIfLight( '', getValue( 'categoryColor' ) ) ),
				},
				'.ugb-blog-posts__category a:hover': {
					opacity: ! getValue( 'categoryHoverColor' ) ? 0.8 : undefined, // Opacity hover if no hover color.
					backgroundColor: appendImportant( getValue( 'categoryHoverColor' ) ),
					color: appendImportant( whiteIfDarkBlackIfLight( '', getValue( 'categoryHoverColor' ) ) ),
				},
			} )
		} else {
			styles.push( {
				'.ugb-blog-posts__category a': {
					color: appendImportant( whiteIfDarkBlackIfLight( categoryColor, show.columnBackground && columnBackgroundColor ) ),
				},
				'.ugb-blog-posts__category a:hover': {
					opacity: categoryColor && ! getValue( 'categoryHoverColor' ) ? 0.8 : undefined, // Opacity hover if no hover color.
					color: appendImportant( getValue( 'categoryHoverColor' ) ),
				},
			} )
		}

		styles.push( {
			'.ugb-blog-posts__category': {
				...createTypographyStyles( 'category%s', 'desktop', props.attributes, { importantSize: true } ),
				textAlign: getValue( 'categoryAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-blog-posts__category': {
					...createTypographyStyles( 'category%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'categoryTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-blog-posts__category': {
					...createTypographyStyles( 'category%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'categoryMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Title.
	const {
		titleColor = '',
		showTitle = true,
	} = props.attributes
	if ( showTitle ) {
		styles.push( {
			'.ugb-blog-posts__title a': {
				color: appendImportant( whiteIfDarkBlackIfLight( titleColor, show.columnBackground && columnBackgroundColor ) ),
			},
			'.ugb-blog-posts__title a:hover': {
				opacity: titleColor && ! getValue( 'titleHoverColor' ) ? 0.8 : undefined, // Opacity hover if no hover color.
				color: appendImportant( getValue( 'titleHoverColor' ) ),
			},
			'.ugb-blog-posts__title': {
				...createTypographyStyles( 'title%s', 'desktop', props.attributes, { importantSize: true } ),
				textAlign: getValue( 'titleAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-blog-posts__title': {
					...createTypographyStyles( 'title%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-blog-posts__title': {
					...createTypographyStyles( 'title%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'titleMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Excerpt.
	const {
		excerptColor = '',
		showExcerpt = true,
	} = props.attributes
	if ( showExcerpt ) {
		styles.push( {
			'.ugb-blog-posts__excerpt, .ugb-blog-posts__excerpt p': {
				...createTypographyStyles( 'excerpt%s', 'desktop', props.attributes, { importantSize: true } ),
				color: appendImportant( whiteIfDarkBlackIfLight( excerptColor, show.columnBackground && columnBackgroundColor ) ),
			},
			'.ugb-blog-posts__excerpt': {
				textAlign: getValue( 'excerptAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-blog-posts__excerpt, .ugb-blog-posts__excerpt p': {
					...createTypographyStyles( 'excerpt%s', 'tablet', props.attributes, { importantSize: true } ),
				},
				'.ugb-blog-posts__excerpt': {
					textAlign: getValue( 'excerptTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-blog-posts__excerpt, .ugb-blog-posts__excerpt p': {
					...createTypographyStyles( 'excerpt%s', 'mobile', props.attributes, { importantSize: true } ),
				},
				'.ugb-blog-posts__excerpt': {
					textAlign: getValue( 'excerptMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Meta.
	const {
		metaColor = '',
		showMeta = true,
		showAuthor = true,
		showDate = true,
		showComments = true,
	} = props.attributes
	if ( showMeta && ( showAuthor || showDate || showComments ) ) {
		styles.push( {
			'.ugb-blog-posts__meta': {
				...createTypographyStyles( 'meta%s', 'desktop', props.attributes, { importantSize: true } ),
				color: appendImportant( whiteIfDarkBlackIfLight( metaColor, show.columnBackground && columnBackgroundColor ) ),
				textAlign: getValue( 'metaAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-blog-posts__meta': {
					...createTypographyStyles( 'meta%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'metaTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-blog-posts__meta': {
					...createTypographyStyles( 'meta%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'metaMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Read more.
	const {
		readmoreColor = '',
	} = props.attributes
	if ( showReadmore ) {
		styles.push( {
			'.ugb-blog-posts__readmore a': {
				color: appendImportant( whiteIfDarkBlackIfLight( readmoreColor, show.columnBackground && columnBackgroundColor ) ),
			},
			'.ugb-blog-posts__readmore a:hover': {
				opacity: readmoreColor && ! getValue( 'readmoreHoverColor' ) ? 0.8 : undefined, // Opacity hover if no hover color.
				color: appendImportant( getValue( 'readmoreHoverColor' ) ),
			},
			'.ugb-blog-posts__readmore': {
				...createTypographyStyles( 'readmore%s', 'desktop', props.attributes, { importantSize: true } ),
				textAlign: getValue( 'readmoreAlign', '%s !important' ),
			},
			tablet: {
				'.ugb-blog-posts__readmore': {
					...createTypographyStyles( 'readmore%s', 'tablet', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'readmoreTabletAlign', '%s !important' ),
				},
			},
			mobile: {
				'.ugb-blog-posts__readmore': {
					...createTypographyStyles( 'readmore%s', 'mobile', props.attributes, { importantSize: true } ),
					textAlign: getValue( 'readmoreMobileAlign', '%s !important' ),
				},
			},
		} )
	}

	// Spacing.
	if ( show.imageSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__featured-image', 'image%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.categorySpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__category', 'category%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.titleSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__title', 'title%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.excerptSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__excerpt', 'excerpt%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.metaSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__meta', 'meta%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}
	if ( show.readmoreSpacing ) {
		styles.push( ...createResponsiveStyles( '.ugb-blog-posts__readmore', 'readmore%sBottomMargin', 'marginBottom', '%spx', props.attributes, true ) )
	}

	return deepmerge.all( styles )
}

export default createStyles
