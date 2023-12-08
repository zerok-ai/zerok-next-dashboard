# Makefile for Next.js Application

# Default target (runs when you just type "make" without specifying a target)
.PHONY: default
default: yarn-install-and-build

# Install dependencies and build the Next.js application
.PHONY: yarn-install-and-build
yarn-install-and-build:
	touch .env
	echo "NEXT_PUBLIC_FLAGSMITH_ID=${FLAGSMITH_ID}" >> .env
	echo "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${CLERK_PUBLISHABLE_KEY}" >> .env
	echo "CLERK_SECRET_KEY=${CLERK_SECRET_KEY}" >> .env
	yarn install
	yarn build