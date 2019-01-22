<?php
/**
 * News section.
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_news_feed_links' ) ) {
	function stackable_news_feed_links() {
		include_once( ABSPATH . WPINC . '/feed.php' );

		$rss = fetch_feed( 'https://wpstackable.com/feed' );

		if ( is_wp_error( $rss ) ) {
			return;
		}

		// Get 5 news entries.
		$max_items = $rss->get_item_quantity( 5 );
		$rss_items = $rss->get_items( 0, $max_items );

		if ( ! count( $rss_items ) ) {
			return;
		}

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
	}
}
