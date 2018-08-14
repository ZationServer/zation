FROM node:8.9-alpine

RUN apk add --update \libc6-compat

LABEL appName="{{appNameLC}}"
LABEL version="{{version}}"
LABEL description="{{description}}"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN npm install .

EXPOSE {{port}}

CMD ["npm", "run", "start:docker"]