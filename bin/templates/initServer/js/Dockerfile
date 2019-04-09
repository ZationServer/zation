FROM node:11.7.0

LABEL appName="{{appNameLC}}"
LABEL version="{{version}}"
LABEL description="{{description}}"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY . /usr/src/

RUN npm install

RUN npm install pm2 -g

EXPOSE {{port}}

CMD ["npm", "run", "start:docker"]