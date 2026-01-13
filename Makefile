# Discord Copilot - Unified Makefile
# Common commands for the entire project from root directory

.PHONY: help install build start dev clean bot:dev bot:start bot:build setup

# Default target
help:
	@echo "🚀 Discord Copilot - Available Commands:"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install    - Install all dependencies (admin + bot)"
	@echo "  make setup      - Full setup (install + build)"
	@echo ""
	@echo "Development:"
	@echo "  make dev        - Start admin console in dev mode"
	@echo "  make bot:dev    - Start bot in dev mode"
	@echo "  make dev:all    - Start both admin and bot"
	@echo ""
	@echo "Production:"
	@echo "  make build      - Build admin console"
	@echo "  make bot:build  - Build bot"
	@echo "  make build:all  - Build both admin and bot"
	@echo "  make start      - Start production admin console"
	@echo "  make bot:start  - Start production bot"
	@echo "  make start:all  - Start both in production"
	@echo ""
	@echo "Maintenance:"
	@echo "  make clean      - Clean build artifacts"
	@echo "  make lint       - Run linting for both"
	@echo ""
	@echo "Quick Commands:"
	@echo "  ./build.sh     - Build everything"
	@echo "  ./start.sh     - Start everything"

# Installation
install:
	@echo "📦 Installing dependencies..."
	npm install

# Full setup
setup: install build:all
	@echo "✅ Setup complete!"

# Development
dev:
	@echo "🌟 Starting admin console in dev mode..."
	npm run dev

bot:dev:
	@echo "🤖 Starting bot in dev mode..."
	npm run dev:bot

dev:all:
	@echo "🚀 Starting both admin and bot in dev mode..."
	npm run dev:all

# Production builds
build:
	@echo "🏗️ Building admin console..."
	npm run build

bot:build:
	@echo "🤖 Building bot..."
	npm run build:bot

build:all: build bot:build
	@echo "✅ Both builds complete!"

# Production start
start:
	@echo "🌟 Starting admin console in production..."
	npm run start

bot:start:
	@echo "🤖 Starting bot in production..."
	npm run start:bot

start:all:
	@echo "🚀 Starting both in production..."
	npm run start:all

# Maintenance
clean:
	@echo "🧹 Cleaning build artifacts..."
	rm -rf .next bot/dist bot/node_modules node_modules

lint:
	@echo "🔍 Running linting..."
	npm run lint

# Quick commands
test: dev:all
deploy: build:all
	@echo "🚀 Ready for deployment!"
