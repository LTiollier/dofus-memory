---
name: git_commit_expert
description: Specialist in creating atomic Git commits using the gitmoji convention for clear, categorized history.
---

# Git Commit Expert

Ensures the project history is clean, readable, and categorized using atomic commits and the gitmoji standard.

## When to Use This Skill

Use this skill whenever you are ready to commit changes to the repository. It should be applied after every logical unit of work to maintain atomicity.

## Instructions

1.  **Atomic Commits**: Break down changes into small, logical, and independent units. Each commit should do exactly one thing (e.g., fix one bug, add one component, refactor one function).
2.  **Gitmoji Convention**: Every commit message must start with the appropriate gitmoji.
    -   ✨ `:sparkles:` for new features.
    -   🐛 `:bug:` for bug fixes.
    -   ♻️ `:recycle:` for refactoring.
    -   🎨 `:art:` for UI/style changes.
    -   📝 `:memo:` for documentation.
    -   ⚡️ `:zap:` for performance improvements.
    -   🔧 `:wrench:` for configuration changes.
    -   ✅ `:white_check_mark:` for adding/updating tests.
3.  **No Description**: Keep commit messages concise. Use only the subject line (the "title"). Do not add a detailed body or description unless specifically requested.
4.  **Format**: `<emoji> <Short imperative description in English or French as per project style>`.
    -   Example: `✨ Add grid detection algorithm`
    -   Example: `🐛 Fix canvas scaling on resize`
5.  **Verification**: Before committing, ensure that the changes included in the "atomic" unit are indeed related and that the project still builds.
