<?php
/**
 * Welcome screen.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_get_latest_update_article' ) ) {
	/**
	 * Gets the latest update article. No caching.
	 */
	function stackable_get_latest_update_article() {
		$response = wp_remote_get( 'https://wpstackable.com/wp-json/wp/v2/posts?categories=3&per_page=1' );

		if ( is_wp_error( $response ) || '200' != wp_remote_retrieve_response_code( $response ) ) {
			return null;
		}

		$post = json_decode( wp_remote_retrieve_body( $response ) );
		if ( ! count( $post ) ) {
			return null;
		}

		$post = $post[0];

		$url = add_query_arg( array(
			'utm_source' => 'Plugin',
			'utm_campaign' => 'Update Notice',
			'utm_medium' => 'notification',
		), $post->link );

		$excerpt = wp_kses( $post->excerpt->rendered, array(
			'a' => array(
				'href' => array(),
				'title' => array(),
			),
			'em' => array(),
			'strong' => array(),
		) );

		return array(
			'url' => $url,
			'slug' => $post->slug,
			'title' => $post->title->rendered,
			'excerpt' => $excerpt,
		);
	}
}

if ( ! function_exists( 'stackable_get_latest_update_article_cached' ) ) {
	/**
	 * Gets the latest update article. Cached for 24 hours.
	 */
	function stackable_get_latest_update_article_cached() {
		$article = get_transient( 'stackable_update_article' );
		if ( $article ) {
			return $article;
		}

		$article = stackable_get_latest_update_article();
		set_transient( 'stackable_update_article', $article, 2 * 60 * 60 * 24 );
		return $article;
	}
}
