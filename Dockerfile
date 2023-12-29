#-------------------------------------------#
#           Downloads dependencies          #
#-------------------------------------------#
FROM node:${NODE_IMAGE_VER:-19.4.0-alpine} AS builder

WORKDIR /app/backend

#ENV NODE_ENV development
ARG NODE_ENV

COPY --chown=node:node ./package.json ./

RUN if [ "$NODE_ENV" = "development" ] ; \
        then npm i ; \
        else npm i --omit=dev ; \
        fi
        
#-------------------------------------------#
#            Creates the image              #
#-------------------------------------------#
FROM node:${NODE_IMAGE_VER:-19.4.0-alpine}

WORKDIR /app/backend

COPY --chown=node:node --from=builder /app/backend/node_modules ./node_modules

COPY --chown=node:node . .

ENTRYPOINT ["npm","start"]
