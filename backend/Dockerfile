FROM node:26-alpine3.23

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app
COPY --chown=app:app package*.json ./
RUN npm install
COPY --chown=app:app . .
RUN npx prisma generate

EXPOSE 8080

CMD ["npm", "run", "dev"]