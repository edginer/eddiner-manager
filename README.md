# eddiner-manager

## Pre-requisites
- Install LTS Node
- Install wrangler
- Setup [eddiner](https://github.com/edginer/eddiner)

## Deploy (first)
- Run `npm ci`
- Run `npm run pages:deploy`

## Setup Auth0 and environment variables
- Create Auth0 Account
- Create Auth0 Application with Single Page Application
  - Setup Auth0 Database
    - We recommend 'Disable Sign Ups' for now
  - Add user on created DB
  - Connect the DB to the application
  - We use below constants for environment variables
    - Application -> Client ID as `AUTH0_CLIENT_ID` (should be secret)
    - Application -> Client Secret as `AUTH0_CLIENT_SECRET` (should be secret)
    - Application -> Domain as `AUTH0_DOMAIN`
- Set environment variables
  - `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_DOMAIN`
    - using values from Auth0
  - `AUTH_SECRET`
    - generate from your command line using `openssl rand -base64 32` and use it
    - should be secret
- Set your eddiner D1 database and R2 bucket
  - D1
    - you need to set response tables and info, thread DB
      - `DB_RESPONSES`, `DB_RESPONSES_2`, `DB_RESPONSES_3`
      - `DB_THREADS`
      - `DB` (for info DB containing such as caps, boards)
    - you need to create `ADMIN_DB` for account and session management
  - R2
    - you need to connect archived dat buckets via `ARCHIVE_BUCKET`
    - run up migration using this `upSQLStatements` via Cloudflare dashboard
  
## Redeploy application
- You need to redeploy application to reflect updated environment variables
  - Run `npm run pages:deploy`


## License
Same as [eddiner](https://github.com/edginer/eddiner)
