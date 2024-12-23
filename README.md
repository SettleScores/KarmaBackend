## Release steps

Create a special release branch named `release_vN`.
Go to ui folder client.ts and replace baseUrl with an empty string

In ui folder run

>`npm install`
`npm run build`

Go back to server folder

Run 
>`npm install`
`npm run build:prod`

Commit and push

Go to server, pull the branch 
Copy production.env values
Restart the server