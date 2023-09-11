# Makefile for Next.js Application

# Default target (runs when you just type "make" without specifying a target)
.PHONY: default
default: yarn build

# Run 'yarn' to install dependencies and 'yarn build' to build the Next.js application
.PHONY: yarn build
yarn build:
	yarn install
	yarn build