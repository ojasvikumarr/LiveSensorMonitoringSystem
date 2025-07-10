#!/bin/bash

# LiveSensorMonitoring Deployment Script
# Date: July 10, 2025

# Configuration
VM_IP="144.24.97.79"
VM_USER="opc"
SSH_KEY_PATH="$HOME/PlacementTime/LIVESENSORMONITORING2/SSH/ssh-key-2025-07-10.key"
LOCAL_PROJECT_PATH="$HOME/PlacementTime/LIVESENSORMONITORING2/LiveSensorMonitoring"
REMOTE_PROJECT_PATH="/home/opc/LiveSensorMonitoring"

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display steps
print_step() {
    echo -e "\n${BOLD}${GREEN}[STEP $1]${NC} $2"
}

# Function to display info
print_info() {
    echo -e "${YELLOW}[INFO]${NC} $1"
}

# Function to display errors
print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Function to run remote commands
run_remote_cmd() {
    ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no "$VM_USER@$VM_IP" "$1"
    if [ $? -ne 0 ]; then
        print_error "Failed to execute remote command: $1"
    fi
}

# Check SSH key exists
if [ ! -f "$SSH_KEY_PATH" ]; then
    print_error "SSH key not found at $SSH_KEY_PATH"
fi

# Check if we can connect to the VM
print_step "1" "Testing SSH connection to Oracle VM"
ssh -i "$SSH_KEY_PATH" -o StrictHostKeyChecking=no -o ConnectTimeout=5 "$VM_USER@$VM_IP" "echo Connection successful" || print_error "Failed to connect to VM at $VM_IP"
print_info "SSH connection successful"

# Setup VM with required packages
print_step "2" "Setting up Oracle VM with required packages"
run_remote_cmd "sudo yum update -y && \
                sudo yum install -y yum-utils device-mapper-persistent-data lvm2 git"

# Install Docker if not installed
print_info "Installing Docker if not already installed"
run_remote_cmd "if ! command -v docker &> /dev/null; then \
                    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo && \
                    sudo yum install -y docker-ce docker-ce-cli containerd.io && \
                    sudo systemctl start docker && \
                    sudo systemctl enable docker && \
                    sudo usermod -aG docker $VM_USER; \
                fi"

# Make sure the user is in the docker group
print_info "Ensuring user has Docker permissions"
run_remote_cmd "sudo usermod -aG docker $VM_USER"

# Install Docker Compose if not installed
print_info "Installing Docker Compose if not already installed"
run_remote_cmd "if ! command -v docker compose &> /dev/null; then \
                    sudo curl -L \"https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)\" -o /usr/local/bin/docker-compose && \
                    sudo chmod +x /usr/local/bin/docker-compose && \
                    sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose; \
                fi"

# Create project directory on VM
print_step "3" "Creating project directory on VM"
run_remote_cmd "mkdir -p $REMOTE_PROJECT_PATH"

# Sync project files to VM
print_step "4" "Syncing project files to VM using rsync"
print_info "This may take a while depending on your connection speed..."

rsync -avz --progress -e "ssh -i $SSH_KEY_PATH" \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '*.log' \
    --exclude 'target/' \
    --exclude '.next/' \
    "$LOCAL_PROJECT_PATH/" "$VM_USER@$VM_IP:$REMOTE_PROJECT_PATH/"

if [ $? -ne 0 ]; then
    print_error "Failed to sync files to VM"
fi

print_info "Files synced successfully"

# Set correct permissions on the VM
print_step "5" "Setting correct permissions on the VM"
run_remote_cmd "chmod -R 755 $REMOTE_PROJECT_PATH"

# Stop any running containers
print_step "6" "Stopping any existing Docker containers"
run_remote_cmd "cd $REMOTE_PROJECT_PATH && sudo docker compose -f docker-compose.prod.yml down || true"

# Build and start containers
print_step "7" "Building and starting Docker containers"
print_info "This may take several minutes for the first deployment..."
run_remote_cmd "cd $REMOTE_PROJECT_PATH && sudo docker compose -f docker-compose.prod.yml up -d --build"

# Check if services are running
print_step "8" "Verifying services are running"
run_remote_cmd "sudo docker ps"

# Print access information
print_step "9" "Deployment complete!"
echo -e "${BOLD}Your LiveSensorMonitoring application is now deployed:${NC}"
echo -e "  • ${BOLD}Frontend:${NC} http://$VM_IP:3000"
echo -e "  • ${BOLD}API Service:${NC} http://$VM_IP:8083"
echo -e "  • ${BOLD}Producer Service:${NC} http://$VM_IP:8081"
echo -e "  • ${BOLD}Consumer Service:${NC} http://$VM_IP:8082"

# Print additional commands
echo -e "\n${BOLD}Useful commands:${NC}"
echo -e "  • ${BOLD}View logs:${NC} ssh -i $SSH_KEY_PATH $VM_USER@$VM_IP \"cd $REMOTE_PROJECT_PATH && sudo docker compose -f docker-compose.prod.yml logs -f\""
echo -e "  • ${BOLD}Stop services:${NC} ssh -i $SSH_KEY_PATH $VM_USER@$VM_IP \"cd $REMOTE_PROJECT_PATH && sudo docker compose -f docker-compose.prod.yml down\""
echo -e "  • ${BOLD}Restart services:${NC} ssh -i $SSH_KEY_PATH $VM_USER@$VM_IP \"cd $REMOTE_PROJECT_PATH && sudo docker compose -f docker-compose.prod.yml restart\""
echo -e "  • ${BOLD}Update deployment:${NC} Run this script again"

echo -e "\n${BOLD}${GREEN}Deployment completed successfully!${NC}"
