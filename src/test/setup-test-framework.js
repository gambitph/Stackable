/**
 * External dependencies
 */
import React from 'react'
import '@testing-library/jest-dom'

global.React = React

// Some modules refer to wp.*, just prevent errors.
global.wp = {}
