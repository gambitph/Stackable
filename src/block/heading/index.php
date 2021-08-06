<?php
// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Stackable\Context\Core\Stackable_Context;

if ( ! class_exists( 'Stackable_Heading_Block' ) ) {
	class Stackable_Heading_Block {
		function __construct() {
			add_filter( 'stackable.register-blocks.options', array( $this, 'stackable_register_heading_block_type' ), 1, 3 );
		}

		public function stackable_register_heading_block_type( $register_options, $name, $metadata ) {
			if ( $name !== 'stackable/heading' ) {
				return $register_options;
			}

			$register_options[ 'render_callback' ] = array( new Stackable_Context(), 'render_callback' );

			return $register_options;
		}
	}

	new Stackable_Heading_Block();
}

