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
        $recent_posts = wp_get_recent_posts(
            array(
                'numberposts' => ! empty( $attributes['postsToShow'] ) ? $attributes['postsToShow'] : '',
                'post_status' => 'publish',
                'order' => ! empty( $attributes['order'] ) ? $attributes['order'] : '',
                'orderby' => ! empty( $attributes['orderBy'] ) ? $attributes['orderBy'] : '',
                'category' => ! empty( $attributes['categories'] ) ? $attributes['categories'] : '',
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
                    get_the_category_list( esc_html__( ', ', 'stackable' ), '', $post_id )
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
                $num = sprintf( _n( '%d comment', '%d comments', $num, 'stackable' ), $num );

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
                    $title = __( '(Untitled)', 'stackable' );
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
                $read_more_text = __( 'Continue reading', 'stackable' );
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
                'attributes' => array(
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
                    'postsToShow' => array(
                        'type' => 'number',
                        'default' => 6,
                    ),
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

        // Featured image urls.
        register_rest_field( 'post', 'featured_image_urls',
            array(
                'get_callback' => 'stackable_featured_image_urls',
                'update_callback' => null,
                'schema' => array(
                    'description' => __( 'Different sized featured images' ),
                    'type' => 'array',
                ),
            )
        );

        // Excerpt.
        register_rest_field( 'post', 'post_excerpt_stackable',
            array(
                'get_callback' => 'stackable_post_excerpt',
                'update_callback' => null,
                'schema' => array(
                    'description' => __( 'Post excerpt for Stackable' ),
                    'type' => 'string',
                ),
            )
        );

        // Category links.
        register_rest_field( 'post', 'category_list',
            array(
                'get_callback' => 'stackable_category_list',
                'update_callback' => null,
                'schema' => array(
                    'description' => __( 'Category list links' ),
                    'type' => 'string',
                ),
            )
        );

        // Author name.
        register_rest_field( 'post', 'author_info',
            array(
                'get_callback' => 'stackable_author_info',
                'update_callback' => null,
                'schema' => array(
                    'description' => __( 'Author information' ),
                    'type' => 'array',
                ),
            )
        );

        // Number of comments.
        register_rest_field( 'post', 'comments_num',
            array(
                'get_callback' => 'stackable_commments_number',
                'update_callback' => null,
                'schema' => array(
                    'description' => __( 'Number of comments' ),
                    'type' => 'number',
                ),
            )
        );
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
        return array(
            'full' => is_array( $image ) ? $image : '',
            'landscape_large' => is_array( $image ) ? wp_get_attachment_image_src( $object['featured_media'], 'stackable-landscape-large', false ) : '',
            'portrait_large' => is_array( $image ) ? wp_get_attachment_image_src( $object['featured_media'], 'stackable-portrait-large', false ) : '',
            'square_large' => is_array( $image ) ? wp_get_attachment_image_src( $object['featured_media'], 'stackable-square-large', false ) : '',
            'landscape' => is_array( $image ) ? wp_get_attachment_image_src( $object['featured_media'], 'stackable-landscape', false ) : '',
            'portrait' => is_array( $image ) ? wp_get_attachment_image_src( $object['featured_media'], 'stackable-portrait', false ) : '',
            'square' => is_array( $image ) ? wp_get_attachment_image_src( $object['featured_media'], 'stackable-square', false ) : '',
        );
    }
}

if ( ! function_exists( 'stackable_author_info' ) ) {
    /**
     * Get the author name and link.
     *
     * @since 1.7
     */
    function stackable_author_info( $object ) {
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
        return sprintf( _n( '%d comment', '%d comments', $num, 'stackable' ), $num );
    }
}

if ( ! function_exists( 'stackable_category_list' ) ) {
    /**
     * Get the category links.
     *
     * @since 1.7
     */
    function stackable_category_list( $object ) {
        return get_the_category_list( esc_html__( ', ', 'stackable' ), '', $object['id'] );
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

        if ( ! empty( $post['post_content'] ) ) {
            return apply_filters( 'the_excerpt', wp_trim_words( $post['post_content'], 55 ) );
        }

        $post_content = apply_filters( 'the_content', get_post_field( 'post_content', $post_id ) );
        return apply_filters( 'the_excerpt', wp_trim_words( $post_content, 55 ) );
    }
}

if ( ! function_exists( 'stackable_blog_posts_image_sizes' ) ) {
    /**
     * Add all the image sizes.
     *
     * @since 1.7
     */
    function stackable_blog_posts_image_sizes() {
        add_image_size( 'stackable-landscape-large', 1200, 800, true );
        add_image_size( 'stackable-square-large', 1200, 1200, true );
        add_image_size( 'stackable-portrait-large', 1200, 1800, true );
        add_image_size( 'stackable-landscape', 600, 400, true );
        add_image_size( 'stackable-portrait', 600, 900, true );
        add_image_size( 'stackable-square', 600, 600, true );
    }
    add_action( 'after_setup_theme', 'stackable_blog_posts_image_sizes' );
}
