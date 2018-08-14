FROM node:8.9-alpine

RUN apk add --update \libc6-compat

LABEL maintainer="Zation"
LABEL version="{{zationVersion}}"
LABEL description="Docker file for {{appNameLC}}"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY .. /usr/src/

RUN npm install .

EXPOSE {{port}}

CMD ["npm", "run", "start:docker"]