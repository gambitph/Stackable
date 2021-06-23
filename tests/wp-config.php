<?php

/* Path to the WordPress codebase you'd like to test. Add a forward slash in the end. */
define( 'ABSPATH', dirname( dirname( __FILE__ ) ) . '/wordpress/' );

/*
 * Path to the theme to test with.
 *
 * The 'default' theme is symlinked from test/phpunit/data/themedir1/default into
 * the themes directory of the WordPress installation defined above.
 */
define( 'WP_DEFAULT_THEME', 'default' );

/*
 * Test with multisite enabled.
 * Alternatively, use the tests/phpunit/multisite.xml configuration file.
 */
// define( 'WP_TESTS_MULTISITE', true );

/* Force known bugs to be run.
 * Tests with an associated Trac ticket that is still open are normally skipped.
 */
// define( 'WP_TESTS_FORCE_KNOWN_BUGS', true );

// Test with WordPress debug mode (default).
define( 'WP_DEBUG', true );

// ** MySQL settings ** //

/*
 * This configuration file will be used by the copy of WordPress being tested.
 * wordpress/wp-config.php will be ignored.
 *
 * WARNING WARNING WARNING!
 * These tests will DROP ALL TABLES in the database with the prefix named below.
 * DO NOT use a production database or one that is shared with something else.
 */
define( 'DB_NAME'       , getenv( 'MYSQL_DATABASE' ) ? getenv( 'MYSQL_DATABASE' ) : 'stackable' );
define( 'DB_USER'       , getenv( 'MYSQL_USER' ) ? getenv( 'MYSQL_USER' ) : 'root' );
define( 'DB_PASSWORD'   , getenv( 'MYSQL_PASSWORD' ) ? getenv( 'MYSQL_PASSWORD' ) : '' );
define( 'DB_HOST'       , getenv( 'MYSQL_GITHUB_ACTION' ) ? '127.0.0.1:' . getenv( 'MYSQL_PORT' ) : 'localhost:/tmp/mysql.sock' );
define( 'DB_CHARSET'    , 'utf8' );
define( 'DB_COLLATE'    , '' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 */
define( 'AUTH_KEY',         'po.u=PIa9F%i|!J{^x(h(-!N<o&$H6||[eqQVlS(FO;;cV71)T7vl|DsZSfcZ,c;' );
define( 'SECURE_AUTH_KEY',  'TpWAT}.QTu+/fXVDH2B*bl[FohhYX1b,,^.Pu#QK(|dEtD!.T`eGK?~AI>Es$cs:' );
define( 'LOGGED_IN_KEY',    ']rf-`hK<J$-bGlB)O[V`KFp(s`Wa,~+-vtR}W(_GaT& .J{.wTvE./Fz+k+Dc>,k' );
define( 'NONCE_KEY',        '|X*Bq^,$k@?(%^6FQ/h`^;]y7TZyx6$J/7Ymn(4IK=~!&v&;~]&w]2!4&%ss08+}' );
define( 'AUTH_SALT',        ' {Y3J*J]%y~%m~ES&D+K+Ybxxt@CC$cx?5oh=<,d*}+7]5M={h`{+pd9AVbwUE|}' );
define( 'SECURE_AUTH_SALT', '$l&`@QBP:Up:HDASe[ez2x_66`aT_02?e>AL@hkE%<QBR3m?Z;_2;2AVYpvbnufh' );
define( 'LOGGED_IN_SALT',   '2-fyDq:~`_NHVtdn|6Bcl%G-S98j2+ er}fm+Lh;Ud0xb4:t|gs_)flQrN7`9&H_' );
define( 'NONCE_SALT',       '+{fvOmh{[$<PG~c][:U6!RIA4#[n~8#lJ#V97))j6 7y[#C1+i=AR0vWYJRE.qF;' );

$table_prefix = 'wptests_';   // Only numbers, letters, and underscores please!

define( 'WP_TESTS_DOMAIN', 'https://github.com/gambitph/Stackable' );
define( 'WP_TESTS_EMAIL', 'admin@gambit.ph' );
define( 'WP_TESTS_TITLE', 'Stackable Free Plugin Test' );

define( 'WP_PHP_BINARY', 'php' );

define( 'WPLANG', '' );
