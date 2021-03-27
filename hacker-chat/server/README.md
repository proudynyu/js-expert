# Terminal Chat - Server

## Basic install

This is the server for the terminal chat.
To use it

`npm i`

`npm start` or `npm run dev`

---

## Heroku Deploy

To deploy this server to heroku

`heroku login`

After inserting your account

`heroku apps:create {app name}`

Check if you have the remote URL

`git remote -v`

Then push the code to heroku

`git push heroku master`

To see the logs

`heroku logs -t`

## Heroku unpublish

To delete the app from you Heroku apps

`heroku apps:delete`

Then insert the `{ app name }`