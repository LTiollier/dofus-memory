---
name: react_core_architect
description: Architects high-performance React applications, managing complex state and rendering optimization.
---

# React Core Architect

Ensures the React application is structured for maximum performance, which is critical for real-time video processing apps.

## When to Use This Skill

Use this skill for decisions regarding project structure, state management libraries, custom hooks implementation, and performance tuning of React components.

## Instructions

1.  **Performance Optimization**: Aggressively optimize rendering using `React.memo`, `useCallback`, and `useMemo` to prevent UI lag during video processing.
2.  **State Management**: Design a robust state architecture to handle high-frequency updates (e.g., grid coordinates, detected symbols) without causing unnecessary re-renders of the entire tree.
3.  **Custom Hooks**: Encapsulate complex logic (like video binding or image processing loops) into reusable Custom Hooks to keep UI components clean.
4.  **Component Lifecycle**: Manage side effects carefully to work harmoniously with the non-React parts of the app (like the Canvas API loop).
