# Changelog

All notable changes to this project will be documented in this file.

## [0.3.1] - Final Rebranding
### Changed
- Removed all references to previous game inspirations from documentation, code, and HTML.
- Updated HTML title to 'TopDown Game - Phaser'.

## [0.3.0] - Phaser Refactor
### Changed
- Removed React + PixiJS frontend.
- Added new Phaser.js + TypeScript frontend with Vite.
- Basic grid, player, and camera logic implemented.
- Project ready for tilemap, asset, and AI/LLM integration as a top-down game.

## [0.2.0] - Feature Release
### Added
- Centered robot display: Robot remains centered on the screen.
- Scrolling world mechanic: Map scrolls underneath the robot based on WASD/Arrow key input.
- Prevented browser page scroll on game key input.
### Changed
- Refactored PixiJS rendering logic for centered view.
- Updated keyboard input handling for world scrolling.
- Improved CSS layout for game view.

## [0.1.1] - Bugfix Release
### Fixed
- PixiJS v8 initialization to correctly render on modern browsers
- Canvas rendering approach to use app.renderer.canvas instead of deprecated app.view
- Added error handling for PixiJS initialization to improve debugging

## [0.1.0] - Initial Release
### Added
- Project skeleton with React + PixiJS frontend and FastAPI backend
- Project structure and asset folders
- .gitignore, README.md, updates.md, LICENSE, .editorconfig, push.md
- Automated push workflow and changelog tracking 