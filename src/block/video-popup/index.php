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

		public function get_upload_date_timezone( $timezone_name ) {
			// If it uses local timezone, get offset from WordPress settings
			if ( ! $timezone_name ) {
				$offset  = (float) get_option( 'gmt_offset' );
				$hours   = (int) $offset;
				$minutes = ( $offset - $hours );
				$sign      = ( $offset < 0 ) ? '-' : '+';
				$abs_hour  = abs( $hours );
				$abs_mins  = abs( $minutes * 60 );

				return sprintf( '%s%02d:%02d', $sign, $abs_hour, $abs_mins );
			}

			$timezone = new DateTimeZone( $timezone_name );
			$datetime = new DateTime('now', $timezone);
			return $datetime->format('P');
		}

		public function render_block_video_popup_schema( $block_content, $block ) {
			// Initialize video schema
			$video_schema = array(
				'@context' => 'https://schema.org',
				'@type' => 'VideoObject'
			);

			// Get video schema properties from block attributes
			$attributes = $block[ 'attrs' ];

			// Get video name from the title of the post if not set
			$name = isset( $attributes[ 'videoName' ] ) ? $attributes[ 'videoName' ] : ( get_the_title() ?? '');
			// Get video upload date from the date of the post if not set
			$upload_date_timezone = $this->get_upload_date_timezone( isset( $attributes[ 'videoUploadDateTimezone' ] ) ? $attributes[ 'videoUploadDateTimezone' ] : false );
			$upload_date = isset( $attributes[ 'videoUploadDate' ] ) ? $attributes[ 'videoUploadDate' ] . $upload_date_timezone : ( get_the_date( 'c' ) ?? '');
			$description = isset( $attributes[ 'videoDescription' ] ) ? $attributes[ 'videoDescription' ] : '';
			$content_url = isset( $attributes[ 'videoLink' ] ) ? $attributes[ 'videoLink' ] : '';

			$video_schema[ 'name' ] = esc_attr( $name );
			$video_schema[ 'description' ] = esc_attr( $description );
			$video_schema[ 'uploadDate' ] = esc_attr( $upload_date );
			$video_schema[ 'contentUrl' ] = esc_url( $content_url );

			// Get thumbnail URL from the image block if it exists
			if ( isset( $block[ 'innerBlocks' ] )
				&& count( $block[ 'innerBlocks' ] ) === 2
				&& $block[ 'innerBlocks' ][ 1 ][ 'blockName' ] === 'stackable/image'
			) {
				$image_attributes = $block[ 'innerBlocks' ][ 1 ][ 'attrs' ];
				$thumbnail_url = isset( $image_attributes[ 'imageUrl' ] ) ? $image_attributes[ 'imageUrl' ]
					: ( isset( $image_attributes[ 'imageExternalUrl' ] ) ? $image_attributes[ 'imageExternalUrl' ] : '' );
				$video_schema[ 'thumbnailUrl' ] = esc_url( $thumbnail_url );
			}

			$video_schema_json = wp_json_encode( $video_schema, JSON_UNESCAPED_SLASHES );
			$this->video_entities[] = $video_schema_json;

			return $block_content;
		}
	}

	new Stackable_Video_Popup_Schema();
}