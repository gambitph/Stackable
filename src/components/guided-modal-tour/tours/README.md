# Guided Modal Tour Documentation

This directory contains individual tour configurations for the Stackable guided modal tour system. Each tour is defined in its own JavaScript file and automatically imported into the main tour system.

## How It Works

The tour system uses `require.context()` to automatically discover and import all `.js` files in this directory. Each tour's ID (`tourId`) is derived from its filename in kebab-case (e.g., `design-library.js` becomes `design-library`). Each tour file should export a named export corresponding to the tour's purpose.

## Tour Structure

Each tour file should export an object with the following structure:

```javascript
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { createInterpolateElement } from '@wordpress/element'

export const tourName = {
  // Tour-level properties
  hasConfetti: false,
  condition: () => { /* condition logic */ },
  initialize: () => { /* optional initialization */ },
  steps: [
    // Array of step objects
  ]
}
```

## Tour-Level Properties

### `steps` (array)
The array of step objects that define the tour flow.

### `hasConfetti` (boolean)
If `true`, confetti is shown on the last step. Default is `true`.

### `condition` (function)
A function that returns:
- `true` - Show the tour (even if it's already been completed)
- `false` - Do not show the tour
- `null` - Show the tour only once (default behavior)

### `initialize` (function, optional)
A function called when the tour starts. Useful for setting up initial state or content.

## Step Properties

Each step in a tour is an object with the following possible properties:

### `title` (string)
The title text displayed at the top of the modal.

### `description` (string|ReactNode)
The main content or instructions for the step.

### `help` (string|ReactNode, optional)
If provided, a help text will be shown below the description.

### `size` (string, optional)
The size of the modal. Can be:
- `'small'` (default)
- `'medium'`
- `'large'`

### `anchor` (string, optional)
A CSS selector for the element to which the modal should be anchored. If not provided, modal is centered.

### `position` (string, optional)
The position of the modal relative to the anchor. Can be:
- `'left'`
- `'right'`
- `'top'`
- `'bottom'`
- `'center'` (default)

### `offsetX` (number, optional)
X-axis offset in pixels for fine-tuning the modal's position relative to the anchor.

### `offsetY` (number, optional)
Y-axis offset in pixels for fine-tuning the modal's position relative to the anchor.

### `ctaLabel` (string, optional)
If provided, a call-to-action button will be shown with this label.

### `ctaOnClick` (function, optional)
Function to call when the CTA button is clicked. The tour will move to the next step after this is called.

### `showNext` (boolean, optional)
If `true`, a "Next" button is shown. Default is `true`.

### `nextEventTarget` (string, optional)
A CSS selector for an element. If provided, the tour will wait for the specified event on this element before moving to the next step.

### `nextEvent` (string, optional)
The event name to listen for on `nextEventTarget` (e.g., 'click'). Default is 'click'.

### `glowTarget` (string, optional)
A CSS selector for an element to highlight/glow during this step.

### `preStep` (function, optional)
Function called before the step is displayed. Useful for setup or preparation.

### `postStep` (function, optional)
Function called after the step is completed. Useful for cleanup or triggering actions.

### `skipIf` (function, optional)
Function that returns `true` if this step should be skipped. Useful for conditional steps.

## Example Tour

```javascript
import { __ } from '@wordpress/i18n'
import { i18n } from 'stackable'
import { createInterpolateElement } from '@wordpress/element'

export const exampleTour = {
  hasConfetti: false,
  condition: () => {
    // Only show if there's a specific URL parameter
    return window?.location?.search?.includes('tour=example') ? true : null
  },
  steps: [
    {
      title: 'Welcome',
      description: 'This is the first step.',
      size: 'medium',
      anchor: '.my-element',
      position: 'bottom',
      offsetX: 10,
      offsetY: 0,
      ctaLabel: 'Get Started',
      ctaOnClick: () => { console.log('CTA clicked!') },
      showNext: false,
      nextEventTarget: '.my-button',
      nextEvent: 'click',
      glowTarget: '.my-element',
    },
    {
      title: 'Second Step',
      description: 'This is the second step.',
      help: createInterpolateElement(
        'Click the <strong>Continue</strong> button to proceed.',
        { strong: <strong /> }
      ),
      anchor: '.another-element',
      position: 'right',
      nextEventTarget: '.continue-button',
      glowTarget: '.another-element',
    }
  ]
}
```

## Creating New Tours

1. Create a new `.js` file in this directory
2. Import the necessary dependencies (`__`, `i18n`, `createInterpolateElement`)
3. Export a named export with your tour configuration
4. The tour will be automatically discovered and included in the tour system
