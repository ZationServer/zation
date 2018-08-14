FROM node:8.9

LABEL appName="{{appNameLC}}"
LABEL version="{{version}}"
LABEL description="{{description}}"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN npm install

EXPOSE {{port}}

CMD ["npm", "run", "start:docker"]