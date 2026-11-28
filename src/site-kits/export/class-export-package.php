<?php
/**
 * Site Kit export package value object.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Export_Package' ) ) {
	class Stackable_Site_Kit_Export_Package {

		private $data;
		private $files;
		private $warnings;

		public function __construct( $data, $files = array(), $warnings = array() ) {
			$this->data = $data;
			$this->files = $files;
			$this->warnings = $warnings;
		}

		public function get_data() {
			return $this->data;
		}

		public function get_files() {
			return $this->files;
		}

		public function get_warnings() {
			return $this->warnings;
		}
	}
}
