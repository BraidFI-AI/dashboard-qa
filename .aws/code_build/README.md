# AWS CodeBuild Configuration Guide

**🚨 WARNING**: This guide is for Cloud Engineers. Only make changes if you are knowledgeable in this area, as errors can break the build pipeline.

This folder contains all the necessary resources to build the project using AWS CodeBuild.

## Overview

This guide covers two main sections:
1. Debugging AWS CodeBuild locally using `buildspec.yml`.
2. Building and running Docker images locally.

## 1. Debugging `buildspec.yml` Locally

**Note**: These steps should be performed in the root directory of the project.

To debug `buildspec.yml` locally, follow these steps:

### Step 1: Download the AWS Script

Download the script provided by AWS and place it in the root directory of the project:

```sh
curl -O https://raw.githubusercontent.com/aws/aws-codebuild-docker-images/master/local_builds/codebuild_build.sh
```

### Step 2: Make the Script Executable

Make the script executable:

```sh
chmod +x codebuild_build.sh
```

### Step 3: Run the Script

Run the script from the root directory:

```sh
./codebuild_build.sh -i public.ecr.aws/codebuild/amazonlinux2-x86_64-standard:4.0 -a .aws/tmp_build_output
```

This command will run `buildspec.yml` locally, allowing you to debug the configuration faster than waiting for the AWS pipeline.

For more details, refer to the [AWS CodeBuild documentation](https://docs.aws.amazon.com/codebuild/latest/userguide/use-codebuild-agent.html).

## 2. Building and Running Docker Images Locally

To build and run Docker images locally, follow these steps:

### Step 1: Build the Docker Image

Navigate to the root directory of the project and run the following commands:

#### Build the Docker Image

```sh
docker build -f .aws/code_build/Dockerfile -t braid_web_dashboard:latest . 2>&1 | tee build.log
```

### Step 2: Run the Docker Container

After building the Docker image, run the container to debug the software:

```sh
docker run -it -p 8081:3000 \
-e AWS_PROJECT_REGION="us-east-1" \
-e AWS_COGNITO_REGION="us-east-1" \
-e AWS_USER_POOLS_ID="us-east-1_dk3Mva3rd" \
-e AWS_USER_POOLS_WEB_CLIENT_ID="3t7snj79liboijrt6qa4v00l3h" \
-e API_URL="https://api.development.braid.zone" \
braid_web_dashboard:latest
```

## 3. Health Check Status

### Local Health Check

To verify the health check mechanism locally, run this command:

```sh
curl -i localhost:8081/ping
```

This will check the status of the locally running Docker container.

### AWS Health Check

To verify the health check mechanism on AWS, run this command:

```sh
curl -i http://api.internal.link:443/ping
```

**Note**: This step can only be done within an EC2 instance running on a public network within the same VPC where the app is running, as it uses an internal DNS that is not publicly available.

# Docker debugging

## Delete the whole docker env

This allow you to whipe the whole local Docker enviroment so you can be confident that you are starting from scratch.

```sh
docker system prune -a --volumes -f
```