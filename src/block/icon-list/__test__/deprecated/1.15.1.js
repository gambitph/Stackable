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
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Block Demo',
		html: `<!-- wp:ugb/icon-list {"icon":"star","iconShape":"","iconColor":"#fcb900"} -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-star ugb-icon--columns-1" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDE5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iZmlsbDojZmNiOTAwIj48cGF0aCBkPSJNOTUuNCA2LjNsMjkuMiA1OCA2NC4yIDkuOS00Ni4yIDQ1LjcgMTAuNSA2NC4xLTU3LjctMjkuOEwzNy42IDE4NGwxMC41LTY0LjFMMiA3NC4ybDY0LjItOS45eiI+PC9wYXRoPjwvc3ZnPg==');--icon-size:20px;--gap:16px"><li>Luxury rooms</li><li>Restaurants &amp; Bar</li><li>Business Center</li><li>Swimming Pool</li><li>Golf Course</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Block Demo',
		html: `<!-- wp:ugb/icon-list {"columns":2} -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-check ugb-icon--columns-2" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDE5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTczLjggMjguNEw2MC40IDE0MS44IDE1LjcgOTcuMiA1LjEgMTA3LjggNjAuNCAxNjNsMTI0LTEyNC0xMC42LTEwLjZ6Ij48L3BhdGg+PC9zdmc+');--icon-size:20px;--gap:16px"><li>Choose from different icon designs: check, plus, arrow, cross or star</li><li>Display different icon shape: plain, circle and circle outlined</li><li>Changeable icon color &amp; size</li><li>Display up to 3 columns</li><li>Changeable spacing for list gap</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Block Demo',
		html: `<!-- wp:ugb/icon-list {"icon":"plus","iconShape":"outline","iconColor":"#0693e3","columns":3} -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-plus ugb-icon--columns-3" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTk0IDE5NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iZmlsbDojMDY5M2UzIj48cGF0aCBkPSJNMTA0LjUgNTUuNGgtMTV2MzQuMUg1NS40djE1aDM0LjF2MzQuMWgxNXYtMzQuMWgzNC4xdi0xNWgtMzQuMXoiPjwvcGF0aD48cGF0aCBkPSJNMTg0LjUgNjBjLTcuMi0xNy0xOS4yLTMxLjUtMzQuNC00MS44QzEzNSA4IDExNi42IDIgOTcgMiA4My45IDIgNzEuNCA0LjcgNjAgOS41Yy0xNy4xIDcuMi0zMS42IDE5LjMtNDEuOCAzNC40UzIgNzcuNCAyIDk3YzAgMTMuMSAyLjcgMjUuNiA3LjUgMzcgNy4yIDE3LjEgMTkuMyAzMS42IDM0LjQgNDEuOFM3Ny4zIDE5MiA5NyAxOTJjMTMuMSAwIDI1LjYtMi43IDM3LTcuNSAxNy4xLTcuMiAzMS42LTE5LjMgNDEuOC0zNC40QzE4NiAxMzQuOSAxOTIgMTE2LjYgMTkyIDk3YzAtMTMuMS0yLjctMjUuNi03LjUtMzd6bS0xMy44IDY4LjFjLTYuMSAxNC4zLTE2LjIgMjYuNi0yOSAzNS4yQzEyOC45IDE3MiAxMTMuNiAxNzcgOTcgMTc3Yy0xMS4xIDAtMjEuNi0yLjItMzEuMS02LjMtMTQuMy02LjEtMjYuNi0xNi4yLTM1LjItMjlDMjIgMTI5IDE3IDExMy42IDE3IDk3YzAtMTEuMSAyLjItMjEuNiA2LjMtMzEuMSA2LjEtMTQuMyAxNi4yLTI2LjYgMjktMzUuMkM2NSAyMiA4MC40IDE3IDk3IDE3YzExLjEgMCAyMS42IDIuMiAzMS4xIDYuMyAxNC4zIDYuMSAyNi42IDE2LjIgMzUuMiAyOUMxNzEuOSA2NS4xIDE3NyA4MC40IDE3NyA5N2MwIDExLjEtMi4yIDIxLjYtNi4zIDMxLjF6Ij48L3BhdGg+PC9zdmc+');--icon-size:20px;--gap:16px"><li>Anesthesiology</li><li>Dermatology</li><li>ENT-HNS</li><li>General Medicine</li><li>Nuclear Medicine</li><li>Obstetrics</li><li>Psychiatry</li><li>Oncology</li><li>Rehabilitation</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Block Demo',
		html: `<!-- wp:ugb/icon-list {"icon":"arrow","iconColor":"#f78da7","iconSize":22,"columns":2} -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper"><ul class="ugb-icon-list ugb-icon--icon-arrow ugb-icon--columns-2" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDE5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHlsZT0iZmlsbDojZjc4ZGE3Ij48cGF0aCBkPSJNNTkuNCAxNzcuNWw4Mi40LTgyLjQtODIuNC04Mi4zLTEwLjYgMTAuNiA3MS44IDcxLjctNzEuOCA3MS44IDEwLjYgMTAuNnoiPjwvcGF0aD48L3N2Zz4=');--icon-size:22px;--gap:16px"><li>Developer</li><li>Tester</li><li>HR Manager</li><li>Customer Care</li><li>Accountant</li><li>Messenger</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
	{
		block: 'Icon List',
		version: '1.15.4',
		description: 'Custom CSS',
		plan: 'Premium',
		html: `<!-- wp:ugb/icon-list {"customCSSUniqueID":"ugb-179676b","customCSS":"/* Icon list container */\n.ugb-icon-list-wrapper {\n\tbackground: red;\n}\n\n/* Icon list list */\n.ugb-icon-list-wrapper .ugb-icon-list {\n\t\n}\n\n/* Icon list list text */\n.ugb-icon-list-wrapper .ugb-icon-list li {\n\t\n}\n\n/* Icon list icon */\n.ugb-icon-list-wrapper .ugb-icon-list li:before {\n\t\n}","customCSSCompiled":".ugb-179676b.ugb-icon-list-wrapper{background:red !important}"} -->
		<div class="wp-block-ugb-icon-list ugb-icon-list-wrapper ugb-179676b"><style>.ugb-179676b.ugb-icon-list-wrapper{background:red !important}</style><ul class="ugb-icon-list ugb-icon--icon-check ugb-icon--columns-1" style="--icon:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTkwIDE5MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTczLjggMjguNEw2MC40IDE0MS44IDE1LjcgOTcuMiA1LjEgMTA3LjggNjAuNCAxNjNsMTI0LTEyNC0xMC42LTEwLjZ6Ij48L3BhdGg+PC9zdmc+');--icon-size:20px;--gap:16px"><li>dkjwqkdjnwq</li><li>dwkqjndwkjqnw</li></ul></div>
		<!-- /wp:ugb/icon-list -->`,
	},
]
