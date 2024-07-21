# eddiner-manager

## Pre-requisites
- Install LTS Node
- Install wrangler
- Setup [eddiner](https://github.com/edginer/eddiner)

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
- Set environment variables and settings into wrangler.toml
  - Rename wrangler.toml.sample to wrangler.toml
  - Set `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_DOMAIN` as `[vars]`
    - using values from Auth0
  - Set `AUTH_SECRET` as `[vars]`
    - generate from your command line using `openssl rand -base64 32` and use it
    - should be secret
- Set your eddiner D1 database and R2 bucket
  - D1
    - you need to set response tables and info, thread DB
      - `DB_RESPONSES`, `DB_RESPONSES_2`, `DB_RESPONSES_3`
      - `DB_THREADS`
      - `DB` (for info DB containing such as caps, boards)
    - you need to create `ADMIN_DB` for account and session management
  - run up migration using this `upSQLStatements` via Cloudflare dashboard of D1
  - R2
    - you need to connect archived dat buckets via `ARCHIVE_BUCKET`
  - Finally, you can get database_name and database_id for D1 databases and bucket_name for R2 bucket
    - Add D1 bindings
      ```
      [[d1_databases]]
      binding = "DB_RESPONSES_3"
      database_name = "<your database name>"
      database_id = "<your database id>"
      ```
    - Append migration dir only for `ADMIN_DB`
      ```
      migrations_dir = "admin-migrations"
      ```
    - Add R2 binding
      ```
      [[r2_buckets]]
      binding = 'ARCHIVE_BUCKET'
      bucket_name = '<your bucket name>'
      ```
  - Run migration for `ADMIN_DB`
    ```
    pnpm dlx wrangler d1 migrations apply <your ADMIN_DB name>
    ```
  
## Deploy application
- Run `pnpm i`
- Run `pnpm pages:deploy`


## License
Same as [eddiner](https://github.com/edginer/eddiner)
