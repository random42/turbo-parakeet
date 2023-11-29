FROM node:20

WORKDIR /app
RUN npm i -g npm@10
COPY package*.json .
RUN NODE_ENV="" npm i --ignore-scripts
COPY . .
EXPOSE 4000 9229
CMD ["npm", "run", "dev"]
