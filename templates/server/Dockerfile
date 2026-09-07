FROM node:20 AS build
WORKDIR /usr/app/
COPY . .
RUN npm ci
RUN npm run build


FROM node:20-slim

LABEL appName="{{name}/kc}"
LABEL version="0.0.1"
LABEL description="{{description}}"

WORKDIR /usr/app

ENV MODE=p

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /usr/app/dist ./dist

HEALTHCHECK --interval=15s --timeout=15s --start-period=10s \
   CMD node node_modules/ziron-server/dist/healthcheck.js d-{{port}}

EXPOSE {{port}}

CMD ["node", "dist/index.js"]