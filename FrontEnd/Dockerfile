# Stage 1: Install dependencies
# Stage 1: Install dependencies
FROM node:20 as dependencies
WORKDIR /
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Build the project
FROM node:20 as builder
WORKDIR /
COPY ./ .
COPY ./.env.production .env
COPY --from=dependencies /node_modules ./node_modules
RUN npm run build

# Stage 3: Run the application
FROM node:20 as runner
WORKDIR /
ENV NODE_ENV production
COPY --from=builder /next.config.js ./
COPY --from=builder /public ./public
COPY --from=builder /.next ./.next
COPY --from=builder /.env ./.env
COPY --from=builder /node_modules ./node_modules
COPY --from=builder /package.json ./package.json
EXPOSE 3000

CMD ["npm", "start", "--", "-p", "3000"]