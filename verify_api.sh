#!/bin/bash

# Register
echo "Registering user..."
curl -v -X POST http://localhost:8080/api/register -d '{"username":"testuser", "password":"password123"}'
echo -e "\n"

# Login and save cookies
echo "Logging in..."
curl -v -X POST http://localhost:8080/api/login -d '{"username":"testuser", "password":"password123"}' -c cookies.txt
echo -e "\n"

# Get Profile with cookies
echo "Getting Profile..."
curl -v -X GET http://localhost:8080/api/profile -b cookies.txt
echo -e "\n"

# Logout
echo "Logging out..."
curl -v -X POST http://localhost:8080/api/logout -b cookies.txt
echo -e "\n"

# Get Profile without cookies (should fail/403)
echo "Getting Profile (should fail)..."
curl -v -X GET http://localhost:8080/api/profile
echo -e "\n"
