<?php

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_load_videopopup_frontend_script' ) ) {
	function stackable_load_videopopup_frontend_script() {
		if ( ! is_admin() ) {
			wp_enqueue_script(
				'stk-frontend-video-popup',
				plugins_url( 'dist/frontend_block_video_popup.js', STACKABLE_FILE ),
				array(),
				STACKABLE_VERSION,
				true
			);
		}
	}
	add_action( 'stackable/video-popup/enqueue_scripts', 'stackable_load_videopopup_frontend_script' );
}

if ( ! class_exists( 'Stackable_Video_Popup_Schema' ) ) {
	class Stackable_Video_Popup_Schema {
		public $video_entities = [];

		function __construct() {
			add_filter( 'render_block_stackable/video-popup', array( $this, 'render_block_video_popup_schema' ), 10, 2 );
			add_filter( 'wp_footer', array( $this, 'print_video_popup_schema' ) );
		}

		public function print_video_popup_schema() {
			if ( count( $this->video_entities ) ) {
				// Compile all video schema entities into a single script
				echo '<script type="application/ld+json"> [ ' . implode( ', ', $this->video_entities ) . ' ] </script>';
			}
		}

		public function render_block_video_popup_schema( $block_content, $block ) {
			// Initialize video schema
			$video_schema = array();
			$video_schema[ '@context' ] = 'https://schema.org';
			$video_schema[ '@type' ] = 'VideoObject';

			// Get video schema properties from block attributes
			$attributes = $block[ 'attrs' ];

			// Get video name from the title of the post if not set
			$name = isset( $attributes[ 'videoName' ] ) ? $attributes[ 'videoName' ] : ( get_the_title() ?? '');
			// Get video upload date from the date of the post if not set
			$upload_date = isset( $attributes[ 'videoUploadDate' ] ) ? $attributes[ 'videoUploadDate' ] : ( get_the_date( 'c' ) || '');
			$description = isset( $attributes[ 'videoDescription' ] ) ? $attributes[ 'videoDescription' ] : '';
			$content_url = isset( $attributes[ 'videoLink' ] ) ? $attributes[ 'videoLink' ] : '';

			$video_schema[ 'name' ] = $name;
			$video_schema[ 'description' ] = $description;
			$video_schema[ 'uploadDate' ] = $upload_date;
			$video_schema[ 'contentUrl' ] = $content_url;

			// Get thumbnail URL from the image block if it exists
			if ( isset( $block[ 'innerBlocks' ] )
				&& count( $block[ 'innerBlocks' ] ) === 2
				&& $block[ 'innerBlocks' ][ 1 ][ 'blockName' ] === 'stackable/image'
			) {
				$image_attributes = $block[ 'innerBlocks' ][ 1 ][ 'attrs' ];
				$thumbnail_url = isset( $image_attributes[ 'imageUrl' ] ) ? $image_attributes[ 'imageUrl' ] : '';
				$video_schema[ 'thumbnailUrl' ] = $thumbnail_url;
			}

			$video_schema_json = json_encode( $video_schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
			$this->video_entities[] = $video_schema_json;

			return $block_content;
		}
	}

	new Stackable_Video_Popup_Schema();
}