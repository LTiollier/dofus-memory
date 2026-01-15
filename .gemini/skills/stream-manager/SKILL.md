---
name: stream_manager
description: Manages video streams, browser permissions, and media lifecycle.
---

# Stream Manager

Handles the complexities of the `getDisplayMedia` API and video element lifecycle management.

## When to Use This Skill

Use this skill when implementing, debugging, or optimizing the screen capture functionality, handling video permissions, or managing the synchronization between video source and processing canvas.

## Instructions

1.  **Lifecycle Management**: Strictly manage the initialization and cleanup of `MediaStream` tracks and `<video>` elements to prevent resource leaks or black screens.
2.  **Error Handling**: Implement robust error handling for browser permissions (e.g., user denies screen share) and stream interruptions.
3.  **Synchronization**: Ensure perfect alignment between the source video resolution, the internal video element dimensions, and the processing canvas. Handle aspect ratio preservation correctly.
4.  **Browser APIs**: Use modern Screen Capture API best practices and handle cross-browser compatibility quirks where necessary.
