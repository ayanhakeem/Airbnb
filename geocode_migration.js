require('dotenv').config({ path: './.env' }); // load from project root
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const axios = require('axios');

const dbUrl = process.env.ATLASDB_URL;

async function geocode(location, country) {
    const query = encodeURIComponent(`${location}, ${country}`);
    try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        if (response.data && response.data.length > 0) {
            const lat = parseFloat(response.data[0].lat);
            const lon = parseFloat(response.data[0].lon);
            return {
                type: 'Point',
                coordinates: [lon, lat]
            };
        }
    } catch (e) {
        console.error("Geocoding failed for:", location, e.message);
    }
    // Fallback coordinates (Delhi)
    return {
        type: 'Point',
        coordinates: [77.2090, 28.6139]
    };
}

async function main() {
    if (!dbUrl) {
        console.error("ATLASDB_URL not found in environment. Please make sure .env is loaded.");
        process.exit(1);
    }
    await mongoose.connect(dbUrl);
    console.log("Connected to DB, starting geocode migration...");
    
    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings to geocode.`);

    for (let listing of listings) {
        console.log(`Geocoding: ${listing.title} (${listing.location}, ${listing.country})...`);
        listing.geometry = await geocode(listing.location, listing.country);
        await listing.save();
        console.log(`Successfully geocoded ${listing.title} to [${listing.geometry.coordinates}]`);
        // Sleep to respect Nominatim API rate limits (1 request per second)
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log("Migration complete!");
    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
