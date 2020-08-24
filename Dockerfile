FROM node:12.18.2-alpine AS BUILD_IMAGE

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install production-only dependencies
RUN npm install --production

# Bundle app source
COPY . .

FROM node:12.18.2-alpine

WORKDIR /usr/src/app

COPY package*.json ./

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

ENV NODE_ENV=production
CMD [ "npm", "start" ]
