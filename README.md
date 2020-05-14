# ChatBot: The Discord bot for Shotbow

This repository contains the Discord bot for the Shotbow Discord server.

## Docker

The bot has been set up to run with Docker. This means that you can build the bot
from source and run it on your own Discord server. In order to build the image,
simply run `docker build -t chatbot .`.

Once the docker image has been built, you can run it using 
`docker run -d --name chatbot --restart=always chatbot`.

Since the provided configuration file has been fully set up to work with Shotbow's
Discord server, you might need to manually update it. For this, you can choose from
a variety of options.

1. Update the `config/default.js` configuration file. This repository makes use of the
[config](https://www.npmjs.com/package/config) npm-package.

2. Add a `config/production.js` configuration file. The `docker build`-command sets
the `NODE_ENV` to `production`. The [config](https://www.npmjs.com/package/config) package
will automatically overwrite any values defined in `config/production.js` with those
defined in `config/default.js`.

3. If you only want to set the token, you can simply pass it on in the `docker run`
command: `docker run -e TOKEN=<YOUR_TOKEN> -d --name chatbot --restart=always chatbot`.
It will then be added to the `process.env`-variables. If defined, any value for the
token defined in the configuration files will be overwritten.

4. If you don't want to modify the source code to add configuration files, you can
also choose to mount the configuration file through the `-v` directive. It will then
be placed in the `config`-directory inside the image. To do this, use
`docker run -v /path/to/your/production.js:/usr/src/app/config/production.js -d 
--name chatbot --restart=always chatbot`. Note that it is best to use the
`production.js` configuration file here, since it will only overwrite the values that
you want to overwrite from the embedded `config/default.js` configuration file.
