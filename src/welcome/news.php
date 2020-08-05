<?php
/**
 * News section.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_news_feed_links' ) ) {

	/**
	 * Gets the news feed. Returns the cached copy if available.
	 * Caches the news feed acquired.
	 *
	 * @return String
	 */
	function stackable_news_feed_links() {

		// Get cached.
		if ( get_transient( 'stackable_news_feed_links' ) ) {
			return get_transient( 'stackable_news_feed_links' );
		}

		include_once( ABSPATH . WPINC . '/feed.php' );

		$rss = fetch_feed( 'https://wpstackable.com/feed/' );

		if ( is_wp_error( $rss ) ) {
			return;
		}

		// Get 5 news entries.
		$max_items = $rss->get_item_quantity( 5 );
		$rss_items = $rss->get_items( 0, $max_items );

		if ( ! count( $rss_items ) ) {
			return;
		}

		ob_start();

		?><ul><?php
		foreach ( $rss_items as $item ) {

			$url = add_query_arg(
				array(
					'utm_source' => 'welcome',
					'utm_medium' => 'settings',
					'utm_campaign' => 'news',
					'utm_content' => 'newslink'
				),
				$item->get_permalink()
			);

			$title = $item->get_title();
			$diff = date( 'U' ) - $item->get_date( 'U' );
			if ( $diff / 60 / 60 / 24 <= 10 ) {
				$title = "🔥 " . $title;
			}

			?>
			<li>
				<a href="<?php echo esc_url( $url ) ?>" title="<?php echo esc_attr( $item->get_title() ) ?>" target="stackable">
					<?php echo esc_html( $title ) ?>
				</a>
				<time><?php echo esc_html( $item->get_date( 'M j Y' ) ) ?></time>
			</li>
			<?php
		}
		?></ul><?php

		$out = ob_get_clean();
		set_transient( 'stackable_news_feed_links', $out, 60 * 60 * 24 );
		return $out;
	}
}

if ( ! function_exists( 'stackable_news_feed_links_cached' ) ) {

	/**
	 * Shows the cached news feed. Shows nothing if nothing's cached.
	 *
	 * @return String
	 */
	function stackable_news_feed_links_cached() {
		echo get_transient( 'stackable_news_feed_links' );
	}
}

if ( ! function_exists( 'stackable_news_feed_ajax' ) ) {

	/**
	 * Ajax handler for loading & caching news feed.
	 *
	 * @return void
	 */
	function stackable_news_feed_ajax() {
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( $_POST['nonce'] ) : '';

		if ( ! wp_verify_nonce( $nonce, 'stackable_news_feed' ) ) {
			wp_send_json_error( __( 'Security error, please refresh the page and try again.', STACKABLE_I18N ) );
		}

		wp_send_json_success( stackable_news_feed_links() );
	}
	add_action( 'wp_ajax_stackable_news_feed_ajax', 'stackable_news_feed_ajax' );
}

if ( ! function_exists( 'stackable_get_news_feed_nonce' ) ) {

	/**
	 * Create a nonce for disabling blocks.
	 *
	 * @return String
	 */
	function stackable_get_news_feed_nonce() {
		return wp_create_nonce( 'stackable_news_feed' );
	}
}
