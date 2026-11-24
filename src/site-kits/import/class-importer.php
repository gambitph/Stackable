<?php
/**
 * Shared Site Kit import orchestration.
 *
 * @package Stackable
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Site_Kit_Importer' ) ) {
	class Stackable_Site_Kit_Importer {

		private $rollback;
		private $media;
		private $theme;
		private $content;
		private $plugins;
		private $settings;

		public function __construct( $rollback, $media, $theme, $content, $plugins, $settings ) {
			$this->rollback = $rollback;
			$this->media = $media;
			$this->theme = $theme;
			$this->content = $content;
			$this->plugins = $plugins;
			$this->settings = $settings;
		}

		/**
		 * Apply a validated package with either a complete or explicit selection plan.
		 *
		 * @param Stackable_Site_Kit_Import_Package $package Validated package.
		 * @param array                             $selection Import selection.
		 * @return array|WP_Error
		 */
		public function import( $package, $selection = array() ) {
			$data = $package->get_data_array();
			$plan = Stackable_Site_Kit_Import_Plan::from_request( $selection, $data );
			if ( is_wp_error( $plan ) ) {
				return $plan;
			}

			$preflight = $this->preflight( $data, $plan, $package->get_files() );
			if ( is_wp_error( $preflight ) ) {
				return $preflight;
			}

			$selected_data = $this->selected_data( $data, $plan );
			$selected_media = $this->media->select( $data, $selected_data );
			$warnings = array();
			try {
				if ( $plan->includes( 'plugins' ) ) {
					$result = $this->plugins->import( $data, $plan );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
					$result = $this->validate_blocks( $selected_data );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
				}

				if ( $selected_media ) {
					$result = $this->media->import( $data, $package->get_files(), $selected_media );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
				}

				if ( $plan->includes( 'theme' ) ) {
					$result = $this->theme->import( $data );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
				}

				if ( $plan->includes( 'stackable' ) ) {
					$result = $this->settings->import( $data['stackable'] );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
				}

				$page_map = array();
				if ( $plan->includes( 'pages' ) ) {
					$page_map = $this->content->import_pages( $data );
					if ( is_wp_error( $page_map ) ) {
						return $this->fail( $page_map );
					}
				}
				if ( $plan->includes( 'theme' ) ) {
					$result = $this->theme->apply_shell_flags( $data, $page_map );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
				}

				if ( $plan->includes( 'navigation' ) ) {
					$result = $this->content->import_navigation( $data );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
					$result = $this->content->resolve_template_navigation_tokens( $data );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
				}

				if ( $plan->includes( 'plugins' ) ) {
					$result = $this->plugins->import_settings( $data, $plan );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
					$warnings = array_merge( $warnings, $result );
				}
				if ( $plan->includes( 'navigation' ) ) {
					$result = $this->theme->apply_site_settings( $data, $page_map );
					if ( is_wp_error( $result ) ) {
						return $this->fail( $result );
					}
				}

				$this->settings->flush_caches( $data );
				return array(
					'slug' => $data['slug'],
					'groups' => $plan->get_groups(),
					'pages' => count( $page_map ),
					'media' => $this->media->count(),
					'warnings' => $warnings,
				);
			} catch ( Throwable $exception ) {
				return $this->fail( new WP_Error( 'site_kit_import_failed', $exception->getMessage() ) );
			}
		}

		public function preflight( $data, $plan, $package_files = array() ) {
			if ( 'start-stackable' !== get_template() ) {
				return new WP_Error( 'site_kit_import_theme_required', __( 'Activate the Start Stackable theme before importing a Site Kit.', STACKABLE_I18N ) );
			}
			if ( 'premium' === $data['plan'] && ! $this->has_premium_access() ) {
				return new WP_Error( 'site_kit_import_premium_required', __( 'This Site Kit requires an active Stackable Premium license.', STACKABLE_I18N ) );
			}

			$required_version = ltrim( $data['requires']['stackable'], ">= \t\n\r\0\x0B" );
			if ( $required_version && version_compare( STACKABLE_VERSION, $required_version, '<' ) ) {
				return new WP_Error( 'site_kit_import_stackable_version', __( 'Update Stackable before importing this Site Kit.', STACKABLE_I18N ) );
			}

			$selected_data = $this->selected_data( $data, $plan );
			$selected_media = $this->media->select( $data, $selected_data );
			$capabilities = array();
			if ( $plan->includes( 'pages' ) ) {
				$capabilities = array_merge( $capabilities, array( 'edit_pages', 'publish_pages' ) );
			}
			if ( $selected_media ) {
				$capabilities[] = 'upload_files';
			}
			if ( $plan->includes( 'theme' ) || $plan->includes( 'navigation' ) || $plan->includes( 'stackable' ) ) {
				$capabilities[] = 'edit_theme_options';
			}
			if ( $plan->includes( 'plugins' ) ) {
				$capabilities[] = 'activate_plugins';
			}
			foreach ( array_unique( $capabilities ) as $capability ) {
				if ( ! current_user_can( $capability ) ) {
					return new WP_Error( 'site_kit_import_forbidden', sprintf( __( 'The current user is missing the %s capability.', STACKABLE_I18N ), $capability ) );
				}
			}

			if ( $plan->includes( 'plugins' ) ) {
				$plugin_result = $this->plugins->preflight( $data, $plan );
				if ( is_wp_error( $plugin_result ) ) {
					return $plugin_result;
				}
			}

			$block_result = $this->validate_blocks( $selected_data );
			if ( is_wp_error( $block_result ) && ! $plan->includes( 'plugins' ) ) {
				return $block_result;
			}

			if ( $selected_media ) {
				$media_result = $this->media->preflight( $data, $package_files, $selected_media );
				if ( is_wp_error( $media_result ) ) {
					return $media_result;
				}
			}
			if ( $plan->includes( 'stackable' ) ) {
				$settings_result = $this->settings->preflight( $data['stackable'] );
				if ( is_wp_error( $settings_result ) ) {
					return $settings_result;
				}
			}

			return true;
		}

		private function selected_data( $data, $plan ) {
			$selected = array();
			if ( $plan->includes( 'pages' ) ) {
				$selected[] = $data['pages'];
				$selected[] = $data['patterns'];
			}
			if ( $plan->includes( 'theme' ) ) {
				$selected[] = $data['theme'];
			}
			if ( $plan->includes( 'navigation' ) ) {
				$selected[] = $data['menu'];
				$selected[] = $data['site'];
			}
			if ( $plan->includes( 'stackable' ) ) {
				$selected[] = $data['stackable'];
			}
			return $selected;
		}

		private function validate_blocks( $selected_data ) {
			if ( ! class_exists( 'WP_Block_Type_Registry' ) ) {
				return true;
			}
			$registry = WP_Block_Type_Registry::get_instance();
			foreach ( $this->collect_block_names( $selected_data ) as $block_name ) {
				if ( ! $registry->is_registered( $block_name ) ) {
					return new WP_Error( 'site_kit_import_missing_block', sprintf( __( 'The required block type %s is unavailable.', STACKABLE_I18N ), $block_name ) );
				}
			}
			return true;
		}

		private function collect_block_names( $value ) {
			$names = array();
			if ( is_string( $value ) ) {
				if ( preg_match_all( '/<!--\s+wp:([a-z0-9-]+(?:\/[a-z0-9-]+)?)/i', $value, $matches ) ) {
					foreach ( $matches[1] as $name ) {
						$names[] = false === strpos( $name, '/' ) ? 'core/' . $name : $name;
					}
				}
				return array_values( array_unique( $names ) );
			}
			if ( is_array( $value ) ) {
				foreach ( $value as $item ) {
					$names = array_merge( $names, $this->collect_block_names( $item ) );
				}
			}
			return array_values( array_unique( $names ) );
		}

		private function has_premium_access() {
			return defined( 'STACKABLE_BUILD' ) && 'premium' === STACKABLE_BUILD && function_exists( 'sugb_fs' ) && sugb_fs()->can_use_premium_code();
		}

		private function fail( $error ) {
			$rollback_errors = $this->rollback->rollback();
			$error->add_data(
				array(
					'status' => 422,
					'rollbackErrors' => $rollback_errors,
				)
			);
			return $error;
		}
	}
}
