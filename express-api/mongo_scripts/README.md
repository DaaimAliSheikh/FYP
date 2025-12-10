# MongoDB Migration Scripts

This folder contains database migration and seeding scripts.

## Prerequisites

- Node.js installed
- MongoDB connection string in `express-api/.env` file
- Mongoose package (install with `npm install mongoose` in this directory if needed)

## Available Scripts

### 1. Create Venue Seed (`create_venue_seed.js`)

Creates a sample venue for user ID `6939e2931420e4481ea02064` with mock data.

**Usage:**
```bash
cd mongo_scripts
node create_venue_seed.js
```

**What it does:**
- Connects to MongoDB using the DATABASE_URL from `.env`
- Creates "Royal Gardens Wedding Venue" with complete details
- Includes placeholder image URLs (localhost:8000)
- Sets up amenities, packages, special features
- Checks for existing venue to prevent duplicates

**Data included:**
- Venue name, address, capacity (800 guests)
- Bio and description
- 7 gallery images + profile image
- Contact info (phone, email)
- Indoor (300) and outdoor (500) capacity breakdown
- Operating hours (weekdays and weekends)
- 7 amenities
- 8 special features
- 3 pricing packages (Premium, Standard, Basic)

## Running Scripts

From the project root:
```bash
cd mongo_scripts
node create_venue_seed.js
```

Or from the mongo_scripts directory:
```bash
node create_venue_seed.js
```

## Note

Make sure your `.env` file in `express-api/` contains:
```
DATABASE_URL=mongodb://localhost:27017/your_database_name
```
