# Terminal Chat - Server

## Basic install

This is the server for the terminal chat.
To use it

`npm i`

## How to Use

You can use this client as:
- Global Command in your terminal
- Executing `npm run {script}`

To user Global Command, open the `/` and execute:

`npm link`

To unlink the Global command:

`npm unlink -g @igorbecker/hacker-chat-client`

Now you can access this client typing `hacker-chat`

---


This app client requires some argvs:
- `--username {username}` for you username
- `--room {roomName}` the room that you wanna join

```
  node index.js \
    --username igorbecker \
    --room sala01
```

To use the `localhost` server, run the following command:

`npm run user01` || `npm run user02`

If you have a server in production, you need to set the `PRODUCTION_URL` in `src/cliConfig` to the URL of your app.
Then you can run the following command:

`npm run user03` || `npm run user04`



