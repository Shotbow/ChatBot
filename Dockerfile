FROM node:12.18.2-alpine AS BUILD_IMAGE

# Create app directory
WORKDIR /usr/src/app

RUN apk update && apk add git

# Bundle app source
COPY . .

# Install production-only dependencies
RUN npm install --production

# Add Git revision to Config during build
RUN sed -i "s/token: 'KEEP_YOUR_TOKEN_SECRET'/ref: '$(git rev-parse HEAD)'/" config/default.js

FROM node:12.18.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/config/default.js ./config/default.js
RUN rm -rf .git

ENV NODE_ENV=production
CMD [ "npm", "start" ]
