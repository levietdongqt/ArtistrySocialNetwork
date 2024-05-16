FROM node:20 as builder

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20 as runner
COPY --from=builder /package.json .
COPY --from=builder /package-lock.json .
COPY --from=builder /next.config.js ./
COPY --from=builder /public ./public
COPY --from=builder /.next/standalone ./
COPY --from=builder /.next/static ./.next/static
EXPOSE 3000
ENTRYPOINT ["npm", "start"]
