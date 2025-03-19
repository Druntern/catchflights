TODO
- Integrate open ai to generate itinerary day 1
- 

Comparable Systems
Layla.ai

#To deploy backend in EC2:

# Launch EC2 Instance with Amazon Linux
# Allow inbound traffic for port 3000 (security group)
Type	Protocol	Port Range	Source	Description
HTTP	TCP	80	0.0.0.0/0	Allow HTTP traffic
HTTPS	TCP	443	0.0.0.0/0	Allow HTTPS traffic
Custom TCP	TCP	3000	0.0.0.0/0	Allow access to Node.js
SSH	TCP	22	Your IP only	Secure SSH access

# Connect to EC2 Instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node Dependencies
sudo amazon-linux-extras enable nodejs18
sudo yum install -y nodejs
sudo yum install -y git

# Clone repo
git clone https://github.com/your-repo.git
cd your-repo
npm install

# Setup env variables (if needed)

# Run server
node server.js

# Run as background process using PM2
npm install -g pm2
pm2 start server.js
pm2 startup
pm2 save