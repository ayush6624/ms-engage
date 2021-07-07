FROM node:lts-alpine3.9
WORKDIR /app
ADD . /app
RUN yarn
RUN yarn tsc
EXPOSE 3000
CMD [ "yarn","prod" ]