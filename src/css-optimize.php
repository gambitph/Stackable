<?php
/**
 * CSS Optimization: Optimizes the CSS rendered by our blocks in the frontend in
 * a safe manner.
 *
 * Main logic: when a block is rendered, we check if the block has a `style`,
 * then we stip those out and gather them all into a single one, optimizing the
 * output by combining similar selectors together.
 *
 * This is done in the head part of the page load, so there should be no
 * flickering of unstyled blocks. In order for the styles to be gathered in the
 * head, we trigger all Stackable block rendering at the wp_head just so we can
 * gather all the styles.
 *
 * This is a safe method, where if the styles aren't displayed in the head (or
 * it failed somehow), then the styles would remain as part of the blocks.
 *
 * @since 3.3.0
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_CSS_Optimize' ) ) {

	/**
	 * Stackable Optimize CSS.
	 */
    class Stackable_CSS_Optimize {

		/**
		 * Checker if we are currently gathering styles in wp_head
		 *
		 * @var boolean
		 */
		public $doing_head_styles = false;

		/**
		 * Contains all the uniqueIds of the blocks that have their styles
		 * optimized (if a block is included in here, it means we can safely
		 * strip out the style tag).
		 *
		 * @var array
		 */
		public $done_unique_ids = array();

		/**
		 * This holds all the styles that are gathered from the blocks.
		 *
		 * @var array
		 */
		public $styles = array();

		/**
		 * Initialize
		 */
		function __construct() {
			// Gather or strip CSS from our blocks.
			add_filter( 'render_block', array( $this, 'optimize_block_css' ), 10, 2 );

			// This triggers our blocks to render very early in the page load so
			// we can start gathering styles for the head.
			add_filter( 'wp_head', array( $this, 'trigger_early_render' ), 1 );

			// The print our optimized block styles.
			add_filter( 'wp_head', array( $this, 'print_styles' ) );
		}

		/**
		 * Triggers the early render of our blocks.
		 *
		 * @return void
		 */
		public function trigger_early_render() {
			$this->doing_head_styles = true;

			// Go through all the posts detected.
			global $wp_query;
			if ( ! empty( $wp_query ) && property_exists( $wp_query, 'posts' ) ) {
				foreach ( $wp_query->posts as $post ) {
					// Trigger all our blocks to render once, this will force
					// our render_block filter to trigger, caching all the CSS
					// we used.
					$blocks = parse_blocks( $post->post_content );
					foreach ( $blocks as $block ) {
						if ( stripos( $block['blockName'], 'stackable/' ) !== false ) {
							render_block( $block );
						}
					}
				}
			}

			$this->doing_head_styles = false;

			remove_filter( 'wp_head', array( $this, 'trigger_early_render' ) );
		}

		/**
		 * Optimizes the CSS of a block. This strips out the style tag and adds
		 * it to the styles array for later optimization. If the block already
		 * ran through this, simply strip out the style tag since we can assume
		 * that the CSS is already present in the page.
		 *
		 * @param String $block_content
		 * @param Array $block
		 *
		 * @return String The modified block content
		 */
		public function optimize_block_css( $block_content, $block ) {
			// Only do this to our blocks.
			if ( ! empty( $block ) && is_array( $block ) && stripos( $block['blockName'], 'stackable/' ) === 0 ) {
				if ( stripos( $block_content, '<style' ) !== false ) {

					// We need the unique id for tracking.
					if ( is_array( $block['attrs'] ) && array_key_exists( 'uniqueId', $block['attrs'] ) ) {
						$unique_id = $block['attrs']['uniqueId'];

						// Gather all the styles.
						preg_match_all( '#<style[^>]*>(.*?)</style>#', $block_content, $styles );
						// $style contains:
						// 0 = whole style tag
						// 1 = css inside the style tag

						foreach ( $styles[0] as $i => $style_tag ) {
							// Remove the styles since they will be optimized and added in the page.
							if ( $this->doing_head_styles || in_array( $unique_id, $this->done_unique_ids ) ) {
								$block_content = str_replace( $style_tag, '', $block_content );
							}

							// Add the styles to our list of styles to optimize.
							if ( $this->doing_head_styles && ! in_array( $unique_id, $this->done_unique_ids ) ) {
								$this->styles[] = $styles[1][ $i ];
								$this->done_unique_ids[] = $unique_id;
							}
						}
					}
				}
			}
			return $block_content;
		}

		/**
		 * Prints out an optimized version of all the gathered styles.
		 *
		 * @return void
		 */
		public function print_styles() {
			if ( ! count( $this->styles ) ) {
				return;
			}

			// This contains styles as keys and selectors as values for easy
			// lookups.
			$all_style_rules = array();

			// Organize the styles gathered so we can group together similar selectors.
			// The styles will be organized into:
			// - media query
			//   - style rule
			//     - selector
			//     - selector 2
			//     - ...
			foreach ( $this->styles as $style ) {
				// Extract all media queries, selectors and rules for optimization.
				preg_match_all( '#(@\w+.*?\{)?(.*?)(\{[^\}]+\})\}?#', $style, $style_matches );
				// $style_matches contains:
				// 1 = media query if there is one
				// 2 = selector
				// 3 = style rules

				foreach ( $style_matches[1] as $i => $media_query ) {
					$media_query = ! empty( $media_query ) ? substr( $media_query, 0, -1 ) : $media_query;
					$selector = $style_matches[2][ $i ];
					$style_rule = $style_matches[3][ $i ];

					if ( ! array_key_exists( $media_query, $all_style_rules ) ) {
						$all_style_rules[ $media_query ] = array();
					}

					if ( ! array_key_exists( $style_rule, $all_style_rules[ $media_query ] ) ) {
						$all_style_rules[ $media_query ][ $style_rule ] = array();
					}

					// We can have multiple selectors for the same rule.
					$selectors = explode( ',', $selector );

					foreach ( $selectors as $selector ) {
						$all_style_rules[ $media_query ][ $style_rule ][] = trim( $selector );
					}
				}
			}

			// Print out the organized styles.
			echo "\n";
			echo '<style class="stk-block-styles">';
			foreach ( $all_style_rules as $media_query => $styles ) {
				if ( ! empty( $media_query ) ) {
					echo $media_query . '{';
				}

				// Just combine the selectors.  Note: One possible optimization
				// here is instead of simply combining all selectors with a
				// comma, you can combine them using :is(), this will lessen the
				// selectors.
				foreach ( $styles as $style_rules => $selector_arr ) {
					echo implode( ',', $selector_arr ) . $style_rules;
				}

				if ( ! empty( $media_query ) ) {
					echo '}';
				}
			}
			echo '</style>';

			// Done printing styles, clear all saved block styles.
			$this->styles = array();
		}
	}

	new Stackable_CSS_Optimize();
}
