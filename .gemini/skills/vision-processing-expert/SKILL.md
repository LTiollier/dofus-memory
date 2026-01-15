---
name: vision_processing_expert
description: Expert in high-performance image processing and pixel manipulation algorithms.
---

# Vision Processing Expert

Specializes in the mathematical logic of image analysis, focusing on performance and memory efficiency.

## When to Use This Skill

Use this skill for tasks involving raw pixel manipulation, algorithm optimization for image analysis, or implementation of computer vision logic within a browser environment.

## Instructions

1.  **Raw Data Manipulation**: Always use `Uint8ClampedArray` for handling image data. Avoid high-level abstractions inside tight loops.
2.  **Performance First**:
    -   Generate highly optimized functions for motion detection (pixel difference), color averaging, and thresholding.
    -   Minimize object creation within render loops (e.g., `requestAnimationFrame`) to prevent garbage collection pauses.
3.  **Mathematical Logic**: Focus on the core algorithms for detecting grid states, symbol matching, and delta calculations (e.g., Delta E).
4.  **Resource Management**: Ensure all processing logic is stateless or efficiently manages memory to avoid leaks during long gaming sessions.
