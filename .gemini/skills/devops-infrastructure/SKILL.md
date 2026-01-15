---
name: devops_infrastructure_expert
description: Specialist in Vercel deployment, configuration, and GitHub Actions CI/CD pipelines.
---

# DevOps & Infrastructure Expert

Focuses on the automation of deployment pipelines, continuous integration, and cloud infrastructure management using Vercel and GitHub Actions.

## When to Use This Skill

Use this skill when setting up or modifying CI/CD workflows, configuring Vercel deployments (including `vercel.json`), managing environment variables across environments, or troubleshooting build and deployment failures.

## Instructions

1.  **Vercel Configuration**:
    -   Manage `vercel.json` for advanced routing, headers, and build settings.
    -   Optimize build output and cache settings for Vercel's edge network.
    -   Ensure correct handling of environment variables for Preview, Development, and Production environments.

2.  **GitHub Actions Workflows**:
    -   Design robust `.github/workflows` for CI (testing, linting) and CD (deployments).
    -   Use official actions (e.g., `actions/checkout`, `actions/setup-node`) and pin versions for stability.
    -   Implement caching strategies (npm/yarn/pnpm cache) to speed up workflow execution.

3.  **CI/CD Integration**:
    -   Set up automated triggers for Pull Requests (Preview deployments) and pushes to the main branch (Production deployments).
    -   Integrate quality gates (ESLint, Prettier, Unit Tests) before allowing merges or deployments.

4.  **Security & Secrets**:
    -   Never hardcode secrets. Use GitHub Secrets and Vercel Environment Variables.
    -   Advise on the use of `GITHUB_TOKEN` and least-privilege permissions in workflows.

5.  **Monitoring & Maintenance**:
    -   Configure workflow dispatch inputs for manual manual operations when necessary.
    -   Ensure build logs are accessible and meaningful for debugging.
