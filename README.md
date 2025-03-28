# PressPortal

![Node.js](https://img.shields.io/badge/Node.js-v14+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-blue)

## Project Overview

PressPortal is an online news management platform where administrators can create journalist accounts. Journalists can publish and edit articles with formatted text using Markdown. Each article includes a title, subtitle, publication date, body text, and tags. The homepage displays the 10 most recent articles with pagination for older content. Users can view full articles by clicking titles or filter content by tags.

## Technologies Used

This project is built using:

- **JavaScript** - Core programming language
- **Node.js** - Server-side runtime environment
- **Tailwind CSS** - Utility-first CSS framework for styling
- **PostgreSQL** - Relational database for data persistence

The application intentionally avoids modern frameworks like Angular or React, focusing instead on vanilla JavaScript to demonstrate fundamental web development principles.

## Key Dependencies

- **Express** - Fast, unopinionated web framework for Node.js
- **Sequelize** - Promise-based ORM for PostgreSQL interaction
- **Bcrypt** - Library for secure password hashing
- **JSONWebToken** - Implementation of JSON Web Tokens for authentication
- **Axios** - Promise-based HTTP client for API requests
- **Marked** - Markdown parser and compiler for formatting article content

## Project Context

PRESSPORTAL was developed as part of the Web Technologies (TecWeb) course project at the University of Naples Federico II (UNINA) for the academic year 2023/24. The project implements a comprehensive web application following specific requirements provided by the course instructors.

This project demonstrates practical application of web development principles, including:
- Full-stack JavaScript development
- Database design and management
- Authentication and authorization
- Content management systems
- Responsive web design

The implementation focuses on fundamentals of web development without relying on modern frameworks, allowing for a deeper understanding of core web technologies.

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/bbwark/TecWeb2024.git
   cd TecWeb2024
   ```

2. Create PostgreSQL database:
   ```
   psql -U postgres
   CREATE DATABASE PressPortal;
   \q
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the application:
   ```
   cd backend
   node server.js
   ```

5. Access the application in your browser at `http://localhost:3000`

## Features

- Role-based authentication (Admin/Journalist)
- Article creation and management
- Markdown support for rich text formatting
- Tag-based article filtering
- Responsive design

## Mock Data Generator

The project includes a mock data generator that creates sample content for testing and development purposes. This utility creates a SQL file with realistic test data to populate your database with administrators, journalists, articles, and tags.

### Using the Mock Data Generator

1. Install the required Python dependencies:
   ```
   pip install faker
   ```

2. Run the generator script:
   ```
   python generate_mock_data.py
   ```

3. The script will create a `mock_data.sql` file containing INSERT statements for:
   - Admin users
   - Multiple journalist accounts (with password being " ", a whitespace) **IMPORTANT!**
   - Sample articles with various publication dates
   - A diverse collection of tags

4. Import the generated SQL into your PostgreSQL database:
   ```
   psql -U postgres -d PressPortal -f mock_data.sql
   ```

This allows you to quickly populate your database with realistic content for testing all features without having to manually create users and articles. The mock data includes a variety of article lengths, publication dates, and tag combinations to simulate a real-world news portal environment.



## Troubleshooting

- **Database Connection Issues**: Ensure PostgreSQL is running and credentials are correct in databaseconn.js
- **Port Already in Use**: If port 3000 is already in use, modify the port in server.js
