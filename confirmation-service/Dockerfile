FROM node:alpine
USER node
WORKDIR /home/node

# Copy the package.json to the working directory
COPY --chown=node:node ./package.json ./package.json
COPY --chown=node:node ./package-lock.json ./package-lock.json
RUN npm install
COPY --chown=node:node . .
CMD ["node", "index.js"]