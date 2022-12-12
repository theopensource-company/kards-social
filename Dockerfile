
FROM node:16-slim
WORKDIR /app

# Setup pnpm package manager
RUN npm install -g pnpm@7.11.0

COPY . .

RUN pnpm i
CMD cd app && NEXT_PUBLIC_SURREAL_ENDPOINT="http://localhost:12001" NEXT_PUBLIC_SURREAL_NAMESPACE="kards-deployment_local" NEXT_PUBLIC_SURREAL_DATABASE="kards-social" npm run dev