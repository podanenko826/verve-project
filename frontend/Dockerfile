FROM node:26-alpine3.23

RUN addgroup app && adduser -S -G app app
USER app

WORKDIR /app
COPY --chown=app:app package*.json ./
RUN npm install --legacy-peer-deps
COPY --chown=app:app . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]