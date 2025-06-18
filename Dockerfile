FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN chmod +x entrypoint.sh

RUN npm install

CMD ["./entrypoint.sh"]

