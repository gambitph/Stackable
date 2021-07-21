# Auto Block Recovery

This auto-fixes invalid Stackable blocks when the editor initializes.

Only errors due to styling issues will get fixed. Styling issues are limited to
differences in the contents of `<style>` tags. Other causes of errors such as
change in text content, attributes, and other structural changes are not
included.

This measure is implemented because Stackable blocks have a large number of
options which are compiled into CSS. And block updates and bug fixes that change
styling rules will result in block invalidations.

Ideally, we would need to create deprecation and migration functions to handle
the block updates, but due to the complexity of Stackable blocks (and that most
block functionality is shared across multiple blocks), it would be easier and
faster to simply auto-fix the block errors instead of writing deprecation
functions.
