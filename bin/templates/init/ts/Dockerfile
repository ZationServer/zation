FROM node:8-slim

LABEL maintainer="Zation"
LABEL version="0.7"
LABEL description="Docker file for Zation-Server"

RUN mkdir -p /usr/src/
WORKDIR /usr/src/
COPY .. /usr/src/

RUN npm install .

EXPOSE 8000

CMD ["npm", "run", "start:docker"]