# Makefile for Next.js Application

# Default target (runs when you just type "make" without specifying a target)
.PHONY: default
default: yarn-install-and-build

# Install dependencies and build the Next.js application
.PHONY: yarn-install-and-build
yarn-install-and-build:
	yarn install
	yarn build