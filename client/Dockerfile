# pull official base image
FROM node:13.12.0-alpine

# set working directory
RUN mkdir /frontend
WORKDIR /frontend

# add `/frontend/node_modules/.bin` to $PATH
ENV PATH /frontend/node_modules/.bin:$PATH

# install frontend dependencies
COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add frontend
COPY . ./

# start frontend
CMD ["npm", "start"]
