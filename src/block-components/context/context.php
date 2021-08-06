<?php
namespace Stackale\Context\DefaultContext;

class Stackable_Default_Context {
	function __construct() {
		add_filter( 'stackable.block-components.context.render-content', array( $this, 'context_handler' ), 1, 3 );
	}

	/**
	 * Helper function for handling context values from the !#STK_CONTEXT_ string.
	 *
	 * @example
	 * ```
	 * $this->context_handler( 'postTitle', array( 'postId' => 1234 ) );
	 * returns the Post Title by the given post ID
	 * ```
	 *
	 * @param string $context_string
	 * @param array $context
	 *
	 * @return string|null content
	 */
	public function context_handler( $output, $context_string, $context ) {
		switch ( $context_string ) {
			case 'postTitle': return $this->get_post_title( $context );
			default: return $output;
		}
	}

	/**
	 * Get the post title.
	 *
	 * @param array $context
	 * @return string post title or null.
	 */
	public function get_post_title( $context ) {
		if ( ! array_key_exists( 'postId', $context ) ) {
			return null;
		}

		return get_the_title( $context[ 'postId' ] );
	}
}

new Stackable_Default_Context();
