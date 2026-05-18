# slim base image
FROM node:22-bookworm-slim
WORKDIR /usr/src/app

# get packages
COPY package*.json ./
# npm ci is cleaner
RUN npm ci

# copy code
COPY . .

# set production mode
ENV NODE_ENV=production

EXPOSE 3001

# start it up (tsx handles ts at runtime)
CMD ["npm", "start"]
