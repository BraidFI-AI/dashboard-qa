# Project Overview

This project uses the [Next.js](https://nextjs.org/) framework, created with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## How to Start Locally

To run the development server locally, use one of the following commands:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

After running the command, open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## How to Build Docker Image

To ensure everything is working correctly before pushing changes, build the Docker image with the following command:

```sh
docker build -f .aws/code_build/Dockerfile -t braid_web_dashboard:latest . 2>&1 | tee build.log
```

Once the build is successful, run the Docker image to verify the site is functioning as expected:

```sh
docker run -it -p 8081:3000 \
-e AWS_PROJECT_REGION="us-east-1" \
-e AWS_COGNITO_REGION="us-east-1" \
-e AWS_USER_POOLS_ID="us-east-1_dk3Mva3rd" \
-e AWS_USER_POOLS_WEB_CLIENT_ID="3t7snj79liboijrt6qa4v00l3h" \
-e API_URL="https://api.development.braid.zone" \
braid_web_dashboard:latest
```

This will start the application on port 8081, allowing you to test the environment locally.