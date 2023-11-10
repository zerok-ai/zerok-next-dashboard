# Makefile for Next.js Application

# Default target (runs when you just type "make" without specifying a target)
.PHONY: default
default: yarn-install-and-build

# Define environment variables for clusters
loadcloud01_flag_env := PmRM6jgToFoj7FZPvfqJQp
sandbox_flag_env := kmsMJCggsCntiP926zJa5X

# Determine the FLAGSMITH_ENV based on CLUSTERNAME
CLUSTERNAME := $(CLUSTERNAME)  # Make sure CLUSTERNAME is set

ifeq ($(CLUSTERNAME),loadcloud01)
	FLAGSMITH_ENV := $(loadcloud01_flag_env)
else ifeq ($(CLUSTERNAME),sandbox)
	FLAGSMITH_ENV := $(sandbox_flag_env)
else
	FLAGSMITH_ENV := default_value # Default value if CLUSTERNAME is unknown
endif

# Install dependencies and build the Next.js application
.PHONY: yarn-install-and-build
yarn-install-and-build:
	@echo "Selected Cluster Environment Variable: $(CLUSTERNAME)"
	@echo "Using environment variable: $(FLAGSMITH_ENV)"
	echo "FLAGSMITH_ENV=$(FLAGSMITH_ENV)" > .env
	yarn install
	yarn build
