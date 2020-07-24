FROM node:12.18.3

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

ENV NODE_ENV=production
CMD [ "npm", "start" ]
