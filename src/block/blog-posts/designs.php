<?php
/**
 * @package Stackable
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_blog_posts_design_list' ) ) {

    /**
     * Render the list design markup.
     *
     * @since 1.7
     */
    function stackable_blog_posts_design_list( $markup, $design, $props ) {
        $attributes = $props['attributes'];

        if ( $design === 'list' ) {
            $markup = "<article class='ugb-blog-posts__item'>";
            $markup .= $props['featured_image'];
            $markup .= "<div class='ugb-blog-posts__side'>";
            $markup .= $props['category'];
            $markup .= $props['title'];
            if ( $attributes['displayDate'] || $attributes['displayAuthor'] || $attributes['displayComments'] ) {
                $markup .= '<aside class="entry-meta ugb-blog-posts__meta">';
                $markup .= $props['author'];
                if ( ! empty( $attributes['displayAuthor'] ) && ( ! empty( $attributes['displayDate'] ) || ! empty( $attributes['displayComments'] ) ) ) {
                    $markup .= '<span class="ugb-blog-posts__sep">&middot;</span>';
                }
                $markup .= $props['date'];
                if ( ! empty( $attributes['displayDate'] ) && ! empty( $attributes['displayComments'] ) ) {
                    $markup .= '<span class="ugb-blog-posts__sep">&middot;</span>';
                }
                $markup .= $props['comments'];
                $markup .= '</aside>';
            }
            $markup .= $props['excerpt'];
            $markup .= $props['read_more'];
            $markup .= "</div>";
            $markup .= "</article>";
            return $markup;
        }

        return $markup;
    }
    add_filter( 'stackable/designs_blog-posts_save', 'stackable_blog_posts_design_list', 10, 3 );
}
