FROM node

WORKDIR /src

RUN npm install -g gulp

EXPOSE 9091
EXPOSE 35729
