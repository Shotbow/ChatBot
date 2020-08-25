FROM node:12.18.3-alpine AS BUILD_IMAGE

# Create app directory
WORKDIR /usr/src/app

RUN apk update && apk add git

COPY config/default.js ./config/default.js

COPY package*.json ./

# Install production-only dependencies
RUN npm install --production

COPY .git ./.git

# Add Git revision to Config during build
RUN sed -i "s/token: 'KEEP_YOUR_TOKEN_SECRET'/ref: '$(git rev-parse HEAD)'/" config/default.js

FROM node:12.18.3-alpine

WORKDIR /usr/src/app

COPY . .
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/config/default.js ./config/default.js
RUN rm -rf .git

ENV NODE_ENV=production
CMD [ "npm", "start" ]
