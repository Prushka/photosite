FROM node:lts AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN yarn install


FROM node:lts AS builder
WORKDIR /app
COPY ./ .
COPY --from=dependencies /app/node_modules ./node_modules
RUN yarn run build
FROM node:lts AS runner
WORKDIR /app
ENV NODE_ENV="production"
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
ENV HOSTNAME="0.0.0.0"
EXPOSE 3000

CMD ["yarn", "start", "-p" , "3000"]
