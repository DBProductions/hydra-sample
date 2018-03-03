FROM alpine:3.4

RUN apk add --update nodejs

ADD . /code
WORKDIR /code

RUN npm install
EXPOSE 3000

CMD ["node", "index.js"]
