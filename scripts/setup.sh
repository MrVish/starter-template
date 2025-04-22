#!/bin/bash

# Setup script for local development environment

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up development environment...${NC}"

# Check for required tools
echo -e "${BLUE}Checking prerequisites...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}Docker is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}Docker Compose is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}Python 3 is required but not installed. Aborting.${NC}" >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js is required but not installed. Aborting.${NC}" >&2; exit 1; }

# Create environment files if they don't exist
echo -e "${BLUE}Setting up environment files...${NC}"

if [ ! -f "./backend/.env" ]; then
    echo -e "${GREEN}Creating backend .env file from example...${NC}"
    cp ./backend/.env.example ./backend/.env
fi

if [ ! -f "./frontend/.env.local" ]; then
    echo -e "${GREEN}Creating frontend .env.local file from example...${NC}"
    cp ./frontend/.env.local.example ./frontend/.env.local
fi

# Setup backend
echo -e "${BLUE}Setting up backend...${NC}"
cd backend || { echo -e "${RED}Backend directory not found. Aborting.${NC}" >&2; exit 1; }
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Setup frontend
echo -e "${BLUE}Setting up frontend...${NC}"
cd frontend || { echo -e "${RED}Frontend directory not found. Aborting.${NC}" >&2; exit 1; }
npm install
cd ..

echo -e "${GREEN}Setup complete! You can now start the development environment:${NC}"
echo -e "  ${BLUE}Option 1:${NC} Run with Docker Compose:"
echo -e "    ${GREEN}docker-compose up${NC}"
echo -e ""
echo -e "  ${BLUE}Option 2:${NC} Run services individually:"
echo -e "    ${GREEN}# Terminal 1 - Backend${NC}"
echo -e "    cd backend"
echo -e "    source venv/bin/activate"
echo -e "    flask run"
echo -e ""
echo -e "    ${GREEN}# Terminal 2 - Frontend${NC}"
echo -e "    cd frontend"
echo -e "    npm run dev" 