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

require_once( 'deprecated.php' );

/**
 * Renders the `ugb/blog-posts` block on server.
 *
 * @since 1.7
 *
 * @param array $attributes The block attributes.
 *
 * @return string Returns the post content with latest posts added.
 */
if ( ! function_exists( 'stackable_render_blog_posts_block' ) ) {
    function stackable_render_blog_posts_block( $attributes ) {
		$attributes = apply_filters( 'stackable_block_migrate_attributes', $attributes, 'blog-posts' );

		// TODO: adjust to v2
        $recent_posts = wp_get_recent_posts(
            array(
                'numberposts' => ! empty( $attributes['numberOfItems'] ) ? $attributes['numberOfItems'] : '',
                'post_status' => 'publish',
                'order' => ! empty( $attributes['order'] ) ? $attributes['order'] : '',
                'orderby' => ! empty( $attributes['orderBy'] ) ? $attributes['orderBy'] : '',
                'category' => ! empty( $attributes['categories'] ) ? $attributes['categories'] : '',
				'suppress_filters' => false,
            )
		);

		$posts_markup = '';
		$props = array( 'attributes' => array() );

        foreach ( $recent_posts as $post ) {
            $post_id = $post['ID'];

            // Category.
            $category = '';
            if ( ! empty( $attributes['displayCategory'] ) ) {
                $category = sprintf(
                    '<div class="ugb-blog-posts__category-list">%s</div>',
                    get_the_category_list( esc_html__( ', ', STACKABLE_I18N ), '', $post_id )
                );
            }

            // Featured image.
            $featured_image = '';
            if ( ! empty( $attributes['displayFeaturedImage'] ) ) {
                $size = 'full';
                if ( $attributes['featuredImageShape'] === 'landscape' ) {
                    $size = 'stackable-landscape';
                } else if ( $attributes['featuredImageShape'] === 'square' ) {
                    $size = 'stackable-square';
                }
				$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), $size, false );

				$classes = array( 'ugb-blog-posts__featured-image' );
				if ( ! empty( $attributes['shadow'] ) || $attributes['shadow'] === 0 ) {
					if ( $attributes['shadow'] !== 3 ) {
						$classes[] = 'ugb--shadow-' . $attributes['shadow'];
					}
				}

				$styles = array();
				if ( ! empty( $attributes['borderRadius'] ) || $attributes['borderRadius'] === 0 ) {
					if ( $attributes['borderRadius'] !== 12 ) {
						$styles[] = 'border-radius: ' . $attributes['borderRadius'] . 'px';
					}
				}

                if ( ! empty( $image ) ) {
                    $featured_image = sprintf(
						'<figure class="%s" style="%s"><a href="%s"><img src="%s" alt="%s"/></a></figure>',
						esc_attr( implode( ' ', $classes ) ),
						esc_attr( implode( '; ', $styles ) ),
                        esc_url( get_permalink( $post_id ) ),
                        $image[0],
                        esc_attr( get_the_title( $post_id ) )
                    );
                }
			}

            // Author.
            $author = '';
            if ( ! empty( $attributes['displayAuthor'] ) ) {
                $author = sprintf(
                    '<span>%s</span>',
                    esc_html( get_the_author_meta( 'display_name', $post['post_author'] ) )
                );
            }

            // Date.
            $date = '';
            if ( ! empty( $attributes['displayDate'] ) ) {
                $date = sprintf(
                    '<time datetime="%1$s" class="ugb-blog-posts__date">%2$s</time>',
                    esc_attr( get_the_date( 'c', $post_id ) ),
                    esc_html( get_the_date( '', $post_id ) )
                );
            }

            // Comments.
            $comments = '';
            if ( ! empty( $attributes['displayComments'] ) ) {
                $num = get_comments_number( $post_id );
                $num = sprintf( _n( '%d comment', '%d comments', $num, STACKABLE_I18N ), $num );

                $comments = sprintf(
                    '<span>%s</span>',
                    $num
                );
            }

            // Title.
            $title = '';
            if ( ! empty( $attributes['displayTitle'] ) ) {
                $title = get_the_title( $post_id );
                if ( ! $title ) {
                    $title = __( '(Untitled)', STACKABLE_I18N );
                }
                $title = sprintf(
                    '<h3 class="ugb-blog-posts__title"><a href="%s">%s</a></h3>',
                    esc_url( get_permalink( $post_id ) ),
                    $title // esc_html( $title )
                );
            }

            // Excerpt.
            $excerpt = '';
            if ( ! empty( $attributes['displayExcerpt'] ) ) {

                $excerpt = stackable_get_excerpt( $post_id, $post );
                if ( ! empty( $excerpt ) ) {
                    $excerpt = sprintf(
                        '<div class="ugb-blog-posts__excerpt">%s</div>',
                        wp_kses_post( $excerpt )
                    );
                }
            }

            // Read more link.
            $read_more = '';
            if ( ! empty( $attributes['displayReadMoreLink'] ) ) {
                $read_more_text = __( 'Continue reading', STACKABLE_I18N );
                if ( ! empty( $attributes['readMoreText'] ) ) {
                    $read_more_text = $attributes['readMoreText'];
                }
                $read_more = sprintf(
                    '<p class="ugb-blog-posts__read_more"><a href="%s">%s</a></p>',
                    esc_url( get_permalink( $post_id ) ),
                    esc_html( $read_more_text )
                );
            }

            /**
             * This is the default basic style.
             */
            $post_markup = "<article class='ugb-blog-posts__item'>";
            $post_markup .= $category;
            $post_markup .= $featured_image;
            if ( $attributes['displayDate'] || $attributes['displayAuthor'] || $attributes['displayComments'] ) {
                $post_markup .= '<aside class="entry-meta ugb-blog-posts__meta">';
                $post_markup .= $author;
                if ( ! empty( $attributes['displayAuthor'] ) && ( ! empty( $attributes['displayDate'] ) || ! empty( $attributes['displayComments'] ) ) ) {
                    $post_markup .= '<span class="ugb-blog-posts__sep">&middot;</span>';
                }
                $post_markup .= $date;
                if ( ! empty( $attributes['displayDate'] ) && ! empty( $attributes['displayComments'] ) ) {
                    $post_markup .= '<span class="ugb-blog-posts__sep">&middot;</span>';
                }
                $post_markup .= $comments;
                $post_markup .= '</aside>';
            }
            $post_markup .= $title;
            $post_markup .= $excerpt;
            $post_markup .= $read_more;
            $post_markup .= "</article>";

            // Let others change the saved markup.
            $props = array(
				'post_id' => $post_id,
                'attributes' => $attributes,
                'category' => $category,
                'featured_image' => $featured_image,
                'author' => $author,
                'date' => $date,
                'comments' => $comments,
                'title' => $title,
                'excerpt' => $excerpt,
                'read_more' => $read_more,
            );

            $post_markup = apply_filters( 'stackable/designs_blog-posts_save', $post_markup, $attributes['design'], $props );
            $posts_markup .= $post_markup . "\n";
        }

        // Main classes.
        $mainClasses = array( 'ugb-blog-posts' );
        if ( ! empty( $attributes['className'] ) ) {
            $mainClasses[] = $attributes['className'];
        }
        if ( ! empty( $attributes['columns'] ) ) {
            $mainClasses[] = 'ugb-blog-posts--columns-' . $attributes['columns'];
        }
        if ( ! empty( $attributes['featuredImageShape'] ) ) {
            $mainClasses[] = 'ugb-blog-posts--feature-image-shape-' . $attributes['featuredImageShape'];
        }
        if ( ! empty( $attributes['design'] ) ) {
            $mainClasses[] = 'ugb-blog-posts--design-' . $attributes['design'];
        }
        if ( ! empty( $attributes['contentAlign'] ) ) {
            $mainClasses[] = 'ugb-blog-posts--align-' . $attributes['contentAlign'];
        }
        if ( ! empty( $attributes['align'] ) ) {
            $mainClasses[] = 'align' . $attributes['align'];
		}
		$mainClasses = apply_filters( 'stackable/blog-posts_main-classes', $mainClasses, $attributes['design'], $props );

        // Main styles.
        $mainStyles = array();
        if ( ! empty( $attributes['accentColor'] ) ) {
            $mainStyles[] = '--s-accent-color: ' . $attributes['accentColor'];
		}

		$before_output = apply_filters( 'stackable/blog-posts_save_output_before', '', $attributes['design'], $props );
		$after_output = apply_filters( 'stackable/blog-posts_save_output_after', '', $attributes['design'], $props );

        $block_content = sprintf(
            '<div class="%s" style="%s">%s%s%s</div>',
            esc_attr( implode( ' ', $mainClasses ) ),
			esc_attr( implode( ';', $mainStyles ) ),
			$before_output,
			$posts_markup,
			$after_output
		);

        return $block_content;
    }
}

if ( ! function_exists( 'stackable_register_blog_posts_block' ) ) {
    /**
     * Registers the `ugb/blog-posts` block on server.
     */
    function stackable_register_blog_posts_block() {
        if ( ! function_exists( 'register_block_type' ) ) {
            return;
        }

        register_block_type(
            'ugb/blog-posts',
            array(
				// TODO: Adjust to v2, copy from index.js
                'attributes' => array(
					'numberOfItems' => array(
						'type' => 'number',
						'default' => 6,
					),
					'postType' => array(
						'type' => 'string',
						'default' => 'post',
					),
					'taxonomyType' => array(
						'type' => 'string',
						'default' => 'category',
					),
					'taxonomy' => array(
						'type' => 'string',
						'default' => '',
					),






                    'className' => array(
                        'type' => 'string',
                    ),
                    'order' => array(
                        'type' => 'string',
                        'default' => 'desc',
                    ),
                    'orderBy' => array(
                        'type' => 'string',
                        'default' => 'date',
                    ),
                    'categories' => array(
                        'type' => 'string',
                    ),
                    // 'postsToShow' => array(
                    //     'type' => 'number',
                    //     'default' => 6,
                    // ),
                    'columns' => array(
                        'type' => 'number',
                        'default' => 2,
                    ),
                    'displayFeaturedImage' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'featuredImageShape' => array(
                        'type' => 'string',
                        'default' => 'landscape',
                    ),
                    'displayTitle' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'displayDate' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'displayCategory' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'displayComments' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'displayAuthor' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'displayExcerpt' => array(
                        'type' => 'boolean',
                        'default' => true,
                    ),
                    'displayReadMoreLink' => array(
                        'type' => 'boolean',
                        'default' => false,
                    ),
                    'readMoreText' => array(
                        'type' => 'string',
                    ),
                    'contentAlign' => array(
                        'type' => 'string',
                    ),
                    'align' => array(
                        'type' => 'string',
                    ),
                    'accentColor' => array(
                        'type' => 'string',
                    ),
                    'design' => array(
                        'type' => 'string',
                        'default' => 'basic',
					),
					'borderRadius' => array(
						'type' => 'number',
						'default' => 12,
					),
					'shadow' => array(
						'type' => 'number',
						'default' => 3,
					),

					// UniqueClass.
					'uniqueClass' => array(
						'type' => 'string',
						'default' => '',
					),

					// Custom CSS attributes.
					'customCSSUniqueID' => array(
						'type' => 'string',
						'default' => '',
					),
					'customCSS' => array(
						'type' => 'string',
						'default' => '',
					),
					'customCSSCompiled' => array(
						'type' => 'string',
						'default' => '',
					),
                ),
                'render_callback' => 'stackable_render_blog_posts_block',
            )
        );
    }
    add_action( 'init', 'stackable_register_blog_posts_block' );
}

if ( ! function_exists( 'stackable_blog_posts_rest_fields' ) ) {
    /**
     * Add more data in the REST API that we'll use in the blog post.
     *
     * @since 1.7
     */
    function stackable_blog_posts_rest_fields() {

		$post_types = get_post_types( array( 'public' => true ), 'objects' );
		foreach ( $post_types as $post_type => $data ) {
			if ( $post_type === 'attachment' ) {
				continue;
			}

			// Featured image urls.
			register_rest_field( $post_type, 'featured_image_urls',
				array(
					'get_callback' => 'stackable_featured_image_urls',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Different sized featured images', STACKABLE_I18N ),
						'type' => 'array',
					),
				)
			);

			// Excerpt.
			register_rest_field( $post_type, 'post_excerpt_stackable',
				array(
					'get_callback' => 'stackable_post_excerpt',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Post excerpt for Stackable', STACKABLE_I18N ),
						'type' => 'string',
					),
				)
			);

			// Category links.
			register_rest_field( $post_type, 'category_list',
				array(
					'get_callback' => 'stackable_category_list',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Category list links', STACKABLE_I18N ),
						'type' => 'string',
					),
				)
			);

			// Author name.
			register_rest_field( $post_type, 'author_info',
				array(
					'get_callback' => 'stackable_author_info',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Author information', STACKABLE_I18N ),
						'type' => 'array',
					),
				)
			);

			// Number of comments.
			register_rest_field( $post_type, 'comments_num',
				array(
					'get_callback' => 'stackable_commments_number',
					'update_callback' => null,
					'schema' => array(
						'description' => __( 'Number of comments', STACKABLE_I18N ),
						'type' => 'number',
					),
				)
			);
		}
    }
    add_action( 'rest_api_init', 'stackable_blog_posts_rest_fields' );
}

if ( ! function_exists( 'stackable_featured_image_urls' ) ) {
    /**
     * Get the different featured image sizes that the blog will use.
     *
     * @since 1.7
     */
    function stackable_featured_image_urls( $object, $field_name, $request ) {
		$image = wp_get_attachment_image_src( $object['featured_media'], 'full', false );
		$sizes = get_intermediate_image_sizes();

		$imageSizes = array(
			'full' => is_array( $image ) ? $image : '',
		);

		foreach ( $sizes as $size ) {
			$imageSizes[ $size ] = is_array( $image ) ? wp_get_attachment_image_src( $object['featured_media'], $size, false ) : '';
		}

		return $imageSizes;
    }
}

if ( ! function_exists( 'stackable_author_info' ) ) {
    /**
     * Get the author name and link.
     *
     * @since 1.7
     */
    function stackable_author_info( $object ) {
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

if ( ! function_exists( 'stackable_commments_number' ) ) {
    /**
     * Get the number of comments.
     *
     * @since 1.7
     */
    function stackable_commments_number( $object ) {
        $num = get_comments_number( $object['id'] );
        return sprintf( _n( '%d comment', '%d comments', $num, STACKABLE_I18N ), $num );
    }
}

if ( ! function_exists( 'stackable_category_list' ) ) {
    /**
     * Get the category links.
     *
     * @since 1.7
     */
    function stackable_category_list( $object ) {
        return get_the_category_list( esc_html__( ', ', STACKABLE_I18N ), '', $object['id'] );
    }
}

if ( ! function_exists( 'stackable_post_excerpt' ) ) {
    /**
     * Get the post excerpt.
     *
     * @since 1.7
     */
    function stackable_post_excerpt( $object ) {
        return stackable_get_excerpt( $object['id'] );
    }
}

if ( ! function_exists( 'stackable_get_excerpt' ) ) {
    /**
     * Get the excerpt.
     *
     * @since 1.7
     */
    function stackable_get_excerpt( $post_id, $post = null ) {
        $excerpt = apply_filters( 'the_excerpt', get_post_field( 'post_excerpt', $post_id, 'display' ) );
        if ( ! empty( $excerpt ) ) {
            return $excerpt;
        }

        $max_excerpt = 100; // WP default is 55.

        if ( ! empty( $post['post_content'] ) ) {
            return apply_filters( 'the_excerpt', wp_trim_words( $post['post_content'], $max_excerpt ) );
        }
        $post_content = apply_filters( 'the_content', get_post_field( 'post_content', $post_id ) );
        return apply_filters( 'the_excerpt', wp_trim_words( $post_content, $max_excerpt ) );
    }
}

if ( ! function_exists( 'stackable_render_block_blog_posts' ) ) {
	/**
	 * Combine our JS & PHP block outputs.
	 *
	 * @since 2.0
	 */
	function stackable_render_block_blog_posts( $block_content, $block ) {
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
		return preg_replace( '/(ugb-block-content[\'"]\s*>)/', '$1' . $block_content, preg_replace( '/&lt;/', '<', $block['innerHTML'] ) );
	}
	add_filter( 'render_block', 'stackable_render_block_blog_posts', 10, 2 );
}

if ( ! function_exists( 'stackable_rest_get_terms' ) ) {
	/**
	 * REST Callback. Gets all the terms registered for all post types (including category and tags).
	 *
	 * @see https://stackoverflow.com/questions/42462187/wordpress-rest-api-v2-how-to-list-taxonomy-terms
	 *
	 * @since 2.0
	 */
	function stackable_rest_get_terms() {
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
			$post_type = $taxonomy->object_type[0];

			// Don't include post formats.
			if ( $post_type === 'post' && $taxonomy_slug === 'post_format' ) {
				continue;
			}

			$return[ $post_type ]['taxonomies'][ $taxonomy_slug ] = array(
				'label' => $taxonomy->label,
				'terms' => get_terms( $taxonomy->name ),
			);
		}

		return new WP_REST_Response( $return, 200 );
	}
}

if ( ! function_exists( 'stackable_get_terms_endpoint' ) ) {
	/**
	 * Define our custom REST API endpoint for getting all the terms/taxonomies.
	 *
	 * @since 2.0
	 */
	function stackable_get_terms_endpoint() {
		register_rest_route( 'wp/v2', '/stk_terms', array(
			'methods' => 'GET',
			'callback' => 'stackable_rest_get_terms',
		) );
	}
	add_action( 'rest_api_init', 'stackable_get_terms_endpoint' );
}

if ( ! function_exists( 'stackable_add_custom_orderby_params' ) ) {
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
	function stackable_add_custom_orderby_params( $query_params ) {
		if ( ! in_array( 'rand', $query_params['orderby']['enum'] ) ) {
			$query_params['orderby']['enum'][] = 'rand';
		}
		if ( ! in_array( 'menu_order', $query_params['orderby']['enum'] ) ) {
			$query_params['orderby']['enum'][] = 'menu_order';
		}
		return $query_params;
	}
}

if ( ! function_exists( 'stackable_add_custom_orderby' ) ) {
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
	function stackable_add_custom_orderby() {
		$post_types = get_post_types( array( 'public' => true ) );
		foreach ( $post_types as $post_type ) {
			add_filter( 'rest_' . $post_type . '_collection_params', 'stackable_add_custom_orderby_params' );
		}
	}

	add_action( 'rest_api_init', 'stackable_add_custom_orderby' );
}
