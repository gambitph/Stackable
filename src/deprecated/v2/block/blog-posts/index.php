<?php
/**
 * Server-side rendering of the `ugb/blog-posts` block.
 *
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require_once( dirname( __FILE__ ) . '/deprecated.php' );
require_once( dirname( __FILE__ ) . '/attributes.php' );
require_once( dirname( __FILE__ ) . '/util.php' );

if ( ! function_exists( 'stackable_attributes_default_v2' ) ) {
	/**
	 * Merges an attribute array with default values.
	 * Merged when the attribute value is "" or doesn't exist.
	 *
	 * @since 2.0
	 */
	function stackable_attributes_default_v2( $attributes, $defaults ) {
		$out = array();
		foreach ( $attributes as $name => $value ) {
			$out[ $name ] = $value;
		}
		foreach ( $defaults as $name => $default ) {
			if ( array_key_exists( $name, $out ) ) {
				if ( $out[ $name ] === '' ) {
					$out[ $name ] = $default;
				}
			} else {
				$out[ $name ] = $default;
			}
		}
		return $out;
	}
}

if ( ! function_exists( 'stackable_blog_posts_block_default_attributes_v2' ) ) {
	function stackable_blog_posts_block_default_attributes_v2( $attributes ) {
		$defaults = array(
			'postType' => 'post',
			'numberOfItems' => 6,
			'orderBy' => 'date',
			'order' => 'desc',
			'taxonomyType' => 'category',
			'taxonomy' => '',
			'taxonomyFilterType' => '__in',
			'postOffset' => 0,
			'postExclude' => '',
			'postInclude' => '',
			'design' => 'basic',
			'shadow' => 3,
			'imageSize' => 'large',
			'titleTag' => 'h3',
			'metaSeparator' => 'dot',
			'excerptLength' => 55,
			'readmoreText' => '',
			'showAuthor' => true,
			'showDate' => true,
			'showComments' => true,
			'showImage' => true,
			'showCategory' => true,
			'showTitle' => true,
			'showMeta' => true,
			'showExcerpt' => true,
			'showReadmore' => true,

			'columns' => 2,
		);

		return stackable_attributes_default_v2( $attributes, $defaults );
	}
}

if ( ! function_exists( 'stackable_blog_posts_post_query_v2' ) ) {
	function stackable_blog_posts_post_query_v2( $attributes ) {
		$passed_attributes = array(
				'post_type' => $attributes['postType'],
				'post_status' => 'publish',
				'order' => $attributes['order'],
				'orderby' => $attributes['orderBy'],
				'numberposts' => $attributes['numberOfItems'],
				'suppress_filters' => false,
  	);

		if ( ! empty( $attributes['taxonomy'] ) && ! empty( $attributes['taxonomyType'] ) ) {
			// Categories.
			if ( $attributes['taxonomyType'] === 'category' ) {
				$passed_attributes[ 'category' . $attributes['taxonomyFilterType'] ] = explode( ',', $attributes['taxonomy'] );
			// Tags.
			} else if ( $attributes['taxonomyType'] === 'post_tag' ) {
				$passed_attributes[ 'tag' . $attributes['taxonomyFilterType'] ] = explode( ',', $attributes['taxonomy'] );
			// Custom taxonomies.
			} else {
				$passed_attributes['tax_query'] = array(
					array(
						'taxonomy' => $attributes['taxonomyType'],
						'field' => 'term_id',
						'terms' => explode( ',', $attributes['taxonomy'] ),
						'operator' => $attributes['taxonomyFilterType'] === '__in' ? 'IN' : 'NOT IN',
					),
				);
			}
  	}

		return apply_filters( 'stackable/blog-post/v2/post_query',
			$passed_attributes,
			$attributes
		);
	}
}

/**
 * Renders the `ugb/blog-posts` block on server.
 *
 * @since 1.7
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post content with latest posts added.
 */
if ( ! function_exists( 'stackable_render_blog_posts_block_v2' ) ) {
    function stackable_render_blog_posts_block_v2( $attributes, $content ) {
		// Migrate attributes if this is an old block.
		if ( stackable_block_blog_posts_is_deprecated_v2( $attributes, $content ) ) {
			$attributes = apply_filters( 'stackable_block_migrate_attributes_v2', $attributes, 'blog-posts' );
		}

		$attributes = stackable_blog_posts_block_default_attributes_v2( $attributes );
		$post_query = stackable_blog_posts_post_query_v2( $attributes );

		$recent_posts = wp_get_recent_posts( $post_query );

		// Manually slice the array based on the number of posts per page.
		if ( is_array( $recent_posts ) && count( $recent_posts ) > (int) $post_query['numberposts'] ) {
			$recent_posts = array_slice( $recent_posts, 0, (int) $post_query['numberposts'] );
		}

		$posts_markup = '';
		$show = stackable_blog_posts_util_show_options_v2( $attributes );
		$props = array( 'attributes' => array() );

		/**
		 * Classes.
		 */

		// Item classes.
		$item_classes = array( 'ugb-blog-posts__item' );
		if ( ! $show['imageShadow'] && (int) $attributes['shadow'] !== 0 ) {
			$item_classes[] = 'ugb--shadow-' . $attributes['shadow'];
		}
		// Add background gradient class.
		if ( $show['showBackgroundInItem'] &&
			( $attributes['columnBackgroundColorType'] === 'gradient' ||
			  $attributes['columnBackgroundMediaUrl' ] ||
			  $attributes['columnTabletBackgroundMediaUrl' ] ||
			  $attributes['columnMobileBackgroundMediaUrl' ] ) ) {
			$item_classes[] = 'ugb--has-background-overlay';
		}
		$item_classes = implode( ' ', $item_classes );

		$content_classes = array( 'ugb-blog-posts__content' );
		// Add background gradient class.
		if ( $show['showBackgroundInContent'] &&
			( $attributes['columnBackgroundColorType'] === 'gradient' ||
			  $attributes['columnBackgroundMediaUrl' ] ||
			  $attributes['columnTabletBackgroundMediaUrl' ] ||
			  $attributes['columnMobileBackgroundMediaUrl' ] ) ) {
			$content_classes[] = 'ugb--has-background-overlay';
		}
		$content_classes = implode( ' ', $content_classes );

		// Image classes.
		$featured_image_classes = array( 'ugb-blog-posts__featured-image' );
		if ( $show['imageShadow'] && (int) $attributes['shadow'] !== 0 ) {
			$featured_image_classes[] = 'ugb--shadow-' . $attributes['shadow'];
		}
		$featured_image_classes = implode( ' ', $featured_image_classes );

		/**
		 * END Classes.
		 */

		// Meta separators.
		$meta_separators = array(
			'dot' => '·',
			'space' => ' ',
			'comma' => ',',
			'dash' => '—',
			'pipe' => '|',
		);

        foreach ( $recent_posts as $i => $post ) {
			$post_id = $post['ID'];

			// Featured image.
			$featured_image = '';
			$featured_image_background = '';
			$featured_image_id = get_post_thumbnail_id( $post_id );
			if ( ! empty( $featured_image_id ) ) {
				$featured_image_urls = stackable_featured_image_urls_from_url_v2( $featured_image_id );
				$featured_image_src = $featured_image_urls[ $attributes['imageSize'] ];
				if ( ! empty( $featured_image_src ) ) {
					$image_alt = get_post_meta( $featured_image_id, '_wp_attachment_image_alt', true );
					$thumbnail = get_the_post_thumbnail(
						$post_id,
						$attributes['imageSize'],
						array(
							'alt' => esc_attr( ! empty( $image_alt ) ? $image_alt : '' ),
							'width' => esc_attr( $featured_image_src[1] ),
							'height' => esc_attr( $featured_image_src[2] ),
						)
					);

					// Get the image tag in the thumbnail markup.
					preg_match( "/<img[^\>]*>/", $thumbnail, $match );

					// Remove the built in style attribute in the image.
					if ( is_array( $match ) && count( $match ) > 0 ) {
						// Only remove the style tag inside the image tag.
						$new_img = preg_replace( '/style=\"[^\"]*\"\s?/', "", $match[ 0 ] );
						$thumbnail = preg_replace( "/<img[^\>]*>/", $new_img, $thumbnail );
					}

					$featured_image = sprintf(
						'<figure class="%s"><a href="%s">%s</a></figure>',
						esc_attr( $featured_image_classes ),
						esc_url( get_permalink( $post_id ) ),
						$thumbnail
					);

					$featured_image_background = sprintf(
						'<div class="%s" style="background-image: url(%s)"></div>',
						'ugb-blog-posts__featured-image-background',
						esc_url( $featured_image_src[0] )
					);
				}
			}

			// Title.
			$title = get_the_title( $post_id );
			if ( ! $title ) {
				$title = __( '(Untitled)', STACKABLE_I18N );
			}
			$title = sprintf(
				'<%s class="%s"><a href="%s">%s</a></%s>',
				$attributes['titleTag'],
				'ugb-blog-posts__title',
				esc_url( get_permalink( $post_id ) ),
				$title,
				$attributes['titleTag']
			);

			// Category.
			$category = sprintf(
				'<div class="ugb-blog-posts__category">%s</div>',
				get_the_category_list( esc_html__( ', ', STACKABLE_I18N ), '', $post_id )
			);

			// Separator.
			$separator = sprintf(
				'<span class="ugb-blog-posts__sep">%s</span>',
				$meta_separators[ $attributes['metaSeparator'] ]
			);

			// Author.
			$author = sprintf(
				'<span>%s</span>',
				esc_html( get_the_author_meta( 'display_name', $post['post_author'] ) )
			);

            // Date.
			$date = sprintf(
				'<time datetime="%1$s" class="ugb-blog-posts__date">%2$s</time>',
				esc_attr( get_the_date( 'c', $post_id ) ),
				esc_html( get_the_date( '', $post_id ) )
			);

            // Comments.
			$num = get_comments_number( $post_id );
			$num = sprintf( _n( '%d comment', '%d comments', $num, STACKABLE_I18N ), $num );

			$comments = sprintf(
				'<span>%s</span>',
				$num
			);

            // Excerpt.
			$excerpt = stackable_get_excerpt_v2( $post_id, $post );

			// Trim the excerpt.
			if ( ! empty( $excerpt ) ) {
				$excerpt = explode( ' ', $excerpt );
				$trim_to_length = (int) $attributes['excerptLength'] ? (int) $attributes['excerptLength'] : 55;
				if ( count( $excerpt ) > $trim_to_length ) {
					$excerpt = implode( ' ', array_slice( $excerpt, 0, $trim_to_length ) ) . '...';
				} else {
					$excerpt = implode( ' ', $excerpt );
				}

				$excerpt = sprintf(
					'<div class="ugb-blog-posts__excerpt">%s</div>',
					wp_kses_post( $excerpt )
				);
			}

			// Read more link.
			$readmore_text = __( 'Continue reading', STACKABLE_I18N );
			if ( ! empty( $attributes['readmoreText'] ) ) {
				$readmore_text = $attributes['readmoreText'];
			}
			$readmore = sprintf(
				'<p class="ugb-blog-posts__readmore"><a href="%s">%s</a></p>',
				esc_url( get_permalink( $post_id ) ),
				esc_html( $readmore_text )
			);

			// Meta.
			$showAuthor = $attributes['showAuthor'];
			$showDate = $attributes['showDate'];
			$showComments = $attributes['showComments'];
			$meta = '';
			if ( $showAuthor || $showDate || $showComments ) {
				$meta = sprintf(
					'<aside class="entry-meta ugb-blog-posts__meta">%s%s%s%s%s</aside>',
					$showAuthor && $author ? $author : '',
					$showAuthor && $author && ( ( $showDate && $date ) || ( $showComments && $comments ) ) ? $separator : '',
					$showDate && $date ? $date : '',
					( ( $showAuthor && $author ) || ( $showDate && $date ) ) && $showComments && $comments ? $separator : '',
					$showComments && $comments ? $comments : ''
				);
			}

			$output = apply_filters( 'stackable/blog-posts/v2/edit.output', null, $attributes, array(
				'itemClasses' => $item_classes,
				'contentClasses' => $content_classes,
				'featuredImageBackground' => $featured_image_background,
				'featuredImage' => $featured_image,
				'category' => $category,
				'title' => $title,
				'author' => $author,
				'separator' => $separator,
				'date' => $date,
				'comments' => $comments,
				'excerpt' => $excerpt,
				'readmore' => $readmore,
				'meta' => $meta,
			), $i );

			if ( ! empty( $output ) ) {
				$posts_markup .= $output;
			} else {
				$posts_markup .= sprintf(
					'<article class="%s">%s%s<div class="%s">%s%s%s%s%s%s</div></article>',
					$item_classes,
					$attributes['showImage'] && $show['imageAsBackground'] ? $featured_image_background : '',
					$attributes['showImage'] && ! $show['imageAsBackground'] && $show['imageOutsideContainer'] ? $featured_image : '',
					$content_classes,
					$attributes['showImage'] && ! $show['imageAsBackground'] && ! $show['imageOutsideContainer'] ? $featured_image : '',
					$attributes['showCategory'] ? $category : '',
					$attributes['showTitle'] ? $title : '',
					$attributes['showMeta'] ? $meta : '',
					$attributes['showExcerpt'] ? $excerpt : '',
					$attributes['showReadmore'] ? $readmore : ''
				);
			}
		}

		do_action( 'stackable/blog-posts/v2/render', $attributes, $content );

        return apply_filters( 'stackable/blog-posts/v2/edit.output.markup', $posts_markup, $attributes, $content );
    }
}

if ( ! function_exists( 'stackable_register_blog_posts_block_v2' ) ) {
    /**
     * Add our render attributes.
     */
    function stackable_register_blog_posts_block_v2( $options, $block_name ) {
		if ( $block_name !== 'ugb/blog-posts' ) {
			return $options;
		}

		$options['attributes'] = stackable_blog_posts_attributes_v2();
		$options['render_callback'] = 'stackable_render_blog_posts_block_v2';
		return $options;
    }
    add_filter( 'stackable.v2.register-blocks.options', 'stackable_register_blog_posts_block_v2', 10, 2 );
}

if ( ! function_exists( 'stackable_blog_posts_rest_fields_v2' ) ) {
    /**
     * Add more data in the REST API that we'll use in the blog post.
     *
     * @since 1.7
     */
    function stackable_blog_posts_rest_fields_v2() {
		$post_types = get_post_types( array( 'public' => true ), 'objects' );
		foreach ( $post_types as $post_type => $data ) {
			if ( $post_type === 'attachment' ) {
				continue;
			}

			// Featured image urls.
			register_rest_field( $post_type, 'featured_image_urls_v2',
				array(
					'get_callback' => 'stackable_featured_image_urls_v2',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Different sized featured images', STACKABLE_I18N ),
						'type' => 'array',
					),
				)
			);

			// Excerpt.
			register_rest_field( $post_type, 'post_excerpt_stackable_v2',
				array(
					'get_callback' => 'stackable_post_excerpt_v2',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Post excerpt for Stackable', STACKABLE_I18N ),
						'type' => 'string',
					),
				)
			);

			// Category links.
			register_rest_field( $post_type, 'category_list_v2',
				array(
					'get_callback' => 'stackable_category_list_v2',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Category list links', STACKABLE_I18N ),
						'type' => 'string',
					),
				)
			);

			// Author name.
			register_rest_field( $post_type, 'author_info_v2',
				array(
					'get_callback' => 'stackable_author_info_v2',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Author information', STACKABLE_I18N ),
						'type' => 'array',
					),
				)
			);

			// Number of comments.
			register_rest_field( $post_type, 'comments_num_v2',
				array(
					'get_callback' => 'stackable_commments_number_v2',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Number of comments', STACKABLE_I18N ),
						'type' => 'number',
					),
				)
			);
		}
    }

	if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
		add_action( 'rest_api_init', 'stackable_blog_posts_rest_fields_v2' );
	}
}

if ( ! function_exists( 'stackable_featured_image_urls_v2' ) ) {
    /**
     * Get the different featured image sizes that the blog will use.
	 * Used in the custom REST API endpoint.
     *
     * @since 1.7
     */
    function stackable_featured_image_urls_v2( $object, $field_name, $request ) {
		return stackable_featured_image_urls_from_url_v2( ! empty( $object['featured_media'] ) ? $object['featured_media'] : '' );
	}
}

if ( ! function_exists( 'stackable_featured_image_urls_from_url_v2' ) ) {
	/**
     * Get the different featured image sizes that the blog will use.
     *
     * @since 2.0
     */
	function stackable_featured_image_urls_from_url_v2( $attachment_id ) {
		$image = wp_get_attachment_image_src( $attachment_id, 'full', false );
		$sizes = get_intermediate_image_sizes();

		$imageSizes = array(
			'full' => is_array( $image ) ? $image : '',
		);

		foreach ( $sizes as $size ) {
			$imageSizes[ $size ] = is_array( $image ) ? wp_get_attachment_image_src( $attachment_id, $size, false ) : '';
		}

		return $imageSizes;
	}
}

if ( ! function_exists( 'stackable_author_info_v2' ) ) {
    /**
     * Get the author name and link.
     *
     * @since 1.7
     */
    function stackable_author_info_v2( $object ) {
		// Some CPTs may not support authors.
		if ( ! array_key_exists( 'author', $object ) ) {
			return array(
				'name' => '',
				'url' => '',
			);
		}

        return array(
            'name' => get_the_author_meta( 'display_name', $object['author'] ),
            'url' => get_author_posts_url( $object['author'] ),
        );
    }
}

if ( ! function_exists( 'stackable_commments_number_v2' ) ) {
    /**
     * Get the number of comments.
     *
     * @since 1.7
     */
    function stackable_commments_number_v2( $object ) {
        $num = get_comments_number( $object['id'] );
        return sprintf( _n( '%d comment', '%d comments', $num, STACKABLE_I18N ), $num );
    }
}

if ( ! function_exists( 'stackable_category_list_v2' ) ) {
    /**
     * Get the category links.
     *
     * @since 1.7
     */
    function stackable_category_list_v2( $object ) {
        return get_the_category_list( esc_html__( ', ', STACKABLE_I18N ), '', $object['id'] );
    }
}

if ( ! function_exists( 'stackable_post_excerpt_v2' ) ) {
    /**
     * Get the post excerpt.
     *
     * @since 1.7
     */
    function stackable_post_excerpt_v2( $object ) {
        return stackable_get_excerpt_v2( $object['id'] );
    }
}

if ( ! function_exists( 'stackable_get_excerpt_v2' ) ) {
	/**
	 * Get the excerpt.
	 *
	 * @since 1.7
	 */
	function stackable_get_excerpt_v2( $post_id, $post = null ) {
		// Remove jetpack sharing button.
		add_filter( 'sharing_show', '__return_false' );
		// If there's an excerpt provided, use it.
		$excerpt = get_post_field( 'post_excerpt', $post_id, 'display' );
		// We need to check before running the filters since some plugins override it.
		if ( ! empty( $excerpt ) ) {
			$excerpt = apply_filters( 'the_excerpt', $excerpt );
		}

		if ( empty( $excerpt ) ) {
			$max_excerpt = 100; // WP default is 55.

			// If there's post content given to us, trim it and use that.
			if ( ! empty( $post['post_content'] ) ) {
				$excerpt = apply_filters( 'the_excerpt', wp_trim_words( $post['post_content'], $max_excerpt ) );
			} else {
				// If there's no post content given to us, then get the content.
				$post_content = get_post_field( 'post_content', $post_id );
				if ( ! empty( $post_content ) ) {
					// Remove the jetpack sharing button filter.
					$post_content = apply_filters( 'the_content', $post_content );
					$excerpt = apply_filters( 'the_excerpt', wp_trim_words( $post_content, $max_excerpt ) );
				}
			}
		}

		// Remove the jetpack sharing button filter.
		remove_filter( 'sharing_show', '__return_false' );
		return empty( $excerpt ) ? "" : $excerpt;
  }
}

if ( ! function_exists( 'stackable_render_block_blog_posts_v2' ) ) {
	/**
	 * Combine our JS & PHP block outputs.
	 *
	 * @since 2.0
	 */
	function stackable_render_block_blog_posts_v2( $block_content, $block ) {
		if ( $block['blockName'] !== 'ugb/blog-posts' ) {
			return $block_content;
		}
		if ( empty( $block['innerHTML'] ) ) {
			return $block_content;
		}

		/**
		 * Our expected SAVE output (generated by save.js) is:
		 *
		 * <div class="wp-block-ugb-blog-posts ...">
		 *     <style> ...some generated styles </style>
		 *     <div class="ugb-inner-block">
		 *         <div class="ugb-block-content"></div>
		 *     </div>
		 * </div>
		 *
		 * We need to place the contents inside ".ugb-block-content"
		 */

		// The innerHTML contains the HTML created by the save JS method.
		// Fix the tags or else they will print out escaped.
		$new_content = preg_replace( '/&lt;/', '<', $block['innerHTML'] );

		// Split the content into parts, so that we can place the contents in the correct position.
		// This is better than doing a straight preg_replace since the content may contain '$1' that would affect
		// the replacement https://github.com/gambitph/Stackable/issues/505
		$parts = preg_split( '/(ugb-block-content[\'"]\s*>)/', $new_content, -1, PREG_SPLIT_DELIM_CAPTURE );
		if ( count( $parts ) < 3 ) {
			return $block_content;
		}
		return $parts[0] . $parts[1] . $block_content . $parts[2];
	}

	if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
		add_filter( 'render_block_ugb/blog-posts', 'stackable_render_block_blog_posts_v2', 10, 2 );
	}
}

if ( ! function_exists( 'stackable_rest_get_terms_v2' ) ) {
	/**
	 * REST Callback. Gets all the terms registered for all post types (including category and tags).
	 *
	 * @see https://stackoverflow.com/questions/42462187/wordpress-rest-api-v2-how-to-list-taxonomy-terms
	 *
	 * @since 2.0
	 */
	function stackable_rest_get_terms_v2() {
		$args = array(
			'public' => true,
		);
		$taxonomies = get_taxonomies( $args, 'objects' );

		$return = array();

		$post_types = get_post_types( array( 'public' => true ), 'objects' );
		foreach ( $post_types as $post_type => $data ) {
			// Don't include attachments.
			if ( $post_type === 'attachment' ) {
				continue;
			}
			$return[ $post_type ] = array(
				'label' => $data->label,
				'taxonomies' => array(),
			);
		}

		foreach ( $taxonomies as $taxonomy_slug => $taxonomy ) {
			foreach ( $taxonomy->object_type as $post_type ) {

				// Don't include post formats.
				if ( $post_type === 'post' && $taxonomy_slug === 'post_format' ) {
					continue;
				}

				$return[ $post_type ]['taxonomies'][ $taxonomy_slug ] = array(
					'label' => $taxonomy->label,
					'terms' => get_terms( $taxonomy->name ),
				);
			}
		}

		return new WP_REST_Response( $return, 200 );
	}
}

if ( ! function_exists( 'stackable_get_terms_endpoint_v2' ) ) {
	/**
	 * Define our custom REST API endpoint for getting all the terms/taxonomies.
	 *
	 * @since 2.0
	 */
	function stackable_get_terms_endpoint_v2() {
		register_rest_route( 'stackable/v2', '/terms', array(
			'methods' => 'GET',
			'callback' => 'stackable_rest_get_terms_v2',
			'permission_callback' => function () {
				return current_user_can( 'edit_posts' );
			},
		) );
	}
	if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
		add_action( 'rest_api_init', 'stackable_get_terms_endpoint_v2' );
	}
}

if ( ! function_exists( 'stackable_add_custom_orderby_params_v2' ) ) {
	/**
	 * The callback to add `rand` as an option for orderby param in REST API.
	 * Hook to `rest_{$this->post_type}_collection_params` filter.
	 *
	 * @param array $query_params Accepted parameters.
	 * @return array
	 *
	 * @see https://felipeelia.dev/wordpress-rest-api-enable-random-order-of-posts-list/
	 * @see https://www.timrosswebdevelopment.com/wordpress-rest-api-post-order/
	 */
	function stackable_add_custom_orderby_params_v2( $query_params ) {
		if ( ! in_array( 'rand', $query_params['orderby']['enum'] ) ) {
			$query_params['orderby']['enum'][] = 'rand';
		}
		if ( ! in_array( 'menu_order', $query_params['orderby']['enum'] ) ) {
			$query_params['orderby']['enum'][] = 'menu_order';
		}
		return $query_params;
	}
}

if ( ! function_exists( 'stackable_add_custom_orderby_v2' ) ) {
	/**
	 * Add `rand` as an option for orderby param in REST API.
	 * Hook to `rest_{$this->post_type}_collection_params` filter.
	 *
	 * @param array $query_params Accepted parameters.
	 * @return array
	 *
	 * @see https://felipeelia.dev/wordpress-rest-api-enable-random-order-of-posts-list/
	 * @see https://www.timrosswebdevelopment.com/wordpress-rest-api-post-order/
	 */
	function stackable_add_custom_orderby_v2() {
		$post_types = get_post_types( array( 'public' => true ) );
		foreach ( $post_types as $post_type ) {
			add_filter( 'rest_' . $post_type . '_collection_params', 'stackable_add_custom_orderby_params_v2' );
		}
	}

	if ( has_stackable_v2_frontend_compatibility() || has_stackable_v2_editor_compatibility() ) {
		add_action( 'rest_api_init', 'stackable_add_custom_orderby_v2' );
	}
}
