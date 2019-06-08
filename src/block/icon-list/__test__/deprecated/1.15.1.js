/**
 * This file contains saved block HTML from older versions.
 * These will be tested if they pass migration.
 * This will be built into the dist folder as `deprecation-tests.json`
 */

module.exports = [
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Default block',
		html: `<!-- wp:ugb/icon-list -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-check ugb-icon--columns-1" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDE5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTczLjggMjguNEw2MC40IDE0MS44IDE1LjcgOTcuMiA1LjEgMTA3LjggNjAuNCAxNjNsMTI0LTEyNC0xMC42LTEwLjZ6Ij48L3BhdGg+PC9zdmc+');--icon-size:20px;--gap:16px"></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'With content',
		html: `<!-- wp:ugb/icon-list -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-check ugb-icon--columns-1" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDE5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTczLjggMjguNEw2MC40IDE0MS44IDE1LjcgOTcuMiA1LjEgMTA3LjggNjAuNCAxNjNsMTI0LTEyNC0xMC42LTEwLjZ6Ij48L3BhdGg+PC9zdmc+');--icon-size:20px;--gap:16px"><li>ewqewqewq</li><li>dwqdwqdqw</li><li>dslkamlkdmsa</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Modified block',
		html: `<!-- wp:ugb/icon-list {"icon":"plus","iconColor":"#0693e3"} -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-plus ugb-icon--columns-1" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDE5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iZmlsbDojMDY5M2UzIj48cGF0aCBkPSJNMTgxLjkgODcuNmgtNzkuM1Y4LjRoLTE1djc5LjJIOC40djE1aDc5LjJ2NzkuMmgxNXYtNzkuMmg3OS4zeiI+PC9wYXRoPjwvc3ZnPg==');--icon-size:20px;--gap:16px"><li>ewqewqewq</li><li>dwqdwqdqw</li><li>dslkamlkdmsa</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Modified block',
		html: `<!-- wp:ugb/icon-list {"icon":"star","iconShape":"outline","iconColor":"#00d084","iconSize":11,"columns":2,"gap":30} -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-star ugb-icon--columns-2" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTk0IDE5NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iZmlsbDojMDBkMDg0Ij48cGF0aCBkPSJNMTg0LjQgNjBjLTcuMi0xNy0xOS4yLTMxLjUtMzQuNC00MS44QzEzNC45IDggMTE2LjUgMiA5Ni45IDJjLTEzLjEgMC0yNS42IDIuNy0zNyA3LjUtMTcuMSA3LjItMzEuNiAxOS4zLTQxLjggMzQuNFMxLjkgNzcuNCAxLjkgOTdjMCAxMy4xIDIuNyAyNS42IDcuNSAzNyA3LjIgMTcuMSAxOS4zIDMxLjYgMzQuNCA0MS44Uzc3LjIgMTkyIDk2LjkgMTkyYzEzLjEgMCAyNS42LTIuNyAzNy03LjUgMTcuMS03LjIgMzEuNi0xOS4zIDQxLjgtMzQuNCAxMC4yLTE1LjIgMTYuMi0zMy41IDE2LjItNTMuMSAwLTEzLjEtMi43LTI1LjYtNy41LTM3em0tMTMuOCA2OC4xYy02LjEgMTQuMy0xNi4yIDI2LjYtMjkgMzUuMi0xMi44IDguNy0yOC4xIDEzLjctNDQuNyAxMy43LTExLjEgMC0yMS42LTIuMi0zMS4xLTYuMy0xNC4zLTYuMS0yNi42LTE2LjItMzUuMi0yOUMyMS45IDEyOSAxNi45IDExMy42IDE2LjkgOTdjMC0xMS4xIDIuMi0yMS42IDYuMy0zMS4xIDYuMS0xNC4zIDE2LjItMjYuNiAyOS0zNS4yQzY0LjkgMjIgODAuMyAxNyA5Ni45IDE3YzExLjEgMCAyMS42IDIuMiAzMS4xIDYuMyAxNC4zIDYuMSAyNi42IDE2LjIgMzUuMiAyOSA4LjYgMTIuOCAxMy43IDI4LjEgMTMuNyA0NC43IDAgMTEuMS0yLjIgMjEuNi02LjMgMzEuMXoiPjwvcGF0aD48cGF0aCBkPSJNOTYuOSA0OS4zTDgyLjIgNzguNWwtMzIuMyA1IDIzLjIgMjMtNS4zIDMyLjIgMjkuMS0xNSAyOSAxNS01LjItMzIuMiAyMy4yLTIzLTMyLjMtNXoiPjwvcGF0aD48L3N2Zz4=');--icon-size:11px;--gap:30px"><li>ewqewqewq</li><li>dwqdwqdqw</li><li>dslkamlkdms</li><li>dsadsaa</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
]
