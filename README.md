## Release steps

Create a special release branch named `release_vN`.
Go to `ui/src/api/client.ts` and replace `baseUrl` with `https://161.35.3.11:8081/`

In ui folder run

>`npm install`
`npm run build`

Go back to server folder

Run 
>`npm install`
`npm run build:prod`

Update gitignores to include both dist folders

delete dist/index.js
rename dist/indexprod.js to dist/index.js

Commit and push

Go to server, pull the branch 
Copy production.env values
Restart the server