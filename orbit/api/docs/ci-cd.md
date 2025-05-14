# CI/CD

The whole pipeline is managed by two github actions.

## [ci.yml](../.github/workflows/ci.yml)

Triggered by pushs and interactions to pull requests to main branch.

-   Check if dependencies don't crash when installed in production mode;
-   Check build process
-   Run tests
-   Check lint

## [release-please.yml](../.github/workflows/release-please.yml)

Triggered by push to main branch.

-   Create release PR
-   Deploy to Heroku
