const axios = require("axios");
const Listing = require("../models/listing.js");

module.exports.chatResponse = async (req, res) => {
    try {
        const { message, history, currentListing } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const apiKey = process.env.GROK_API_KEY;

        // 1. Fetch relevant listings from the database to supply as context
        const keywords = message.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
            .split(/\s+/)
            .filter(w => w.length > 2 && !["the", "and", "for", "you", "that", "this", "with", "have", "are", "what", "how", "show", "find", "recommend", "place", "stay", "book", "need", "some", "good", "nice", "best", "trip"].includes(w));

        let dbListings = [];
        if (keywords.length > 0) {
            const regexQuery = keywords.map(kw => new RegExp(kw, "i"));
            dbListings = await Listing.find({
                $or: [
                    { title: { $in: regexQuery } },
                    { description: { $in: regexQuery } },
                    { location: { $in: regexQuery } },
                    { country: { $in: regexQuery } }
                ]
            }).limit(5);
        }

        if (dbListings.length === 0) {
            // Get popular/recent listings as default context
            dbListings = await Listing.find({}).limit(5);
        }

        if (!apiKey) {
            console.warn("GROK_API_KEY is not set. Running chatbot in simulation mode.");
            return generateSimulationResponse(message, dbListings, currentListing, res);
        }

        // Convert listings list into a text context for the model
        const listingsContext = dbListings.map(l => 
            `- Listing ID: ${l._id}\n  Title: ${l.title}\n  Price: ₹${l.price}/night\n  Location: ${l.location}, ${l.country}\n  Description: ${l.description ? l.description.substring(0, 100) : ""}`
        ).join("\n\n");

        // 2. Prepare messages for Groq OpenAI-compatible API
        let activeListingPrompt = "";
        if (currentListing) {
            activeListingPrompt = `
User is currently viewing listing:
- Title: ${currentListing.title}
- ID: ${currentListing.id}
- Price: ₹${currentListing.price}/night
- Host: ${currentListing.owner}

If the user attempts to bargain, negotiate, or ask for a discount for this listing, you should act as the host of the listing. Simulate a friendly negotiation. If they are polite or make a convincing case (e.g. booking for multiple days, special occasion), you can award them a special promo code: WANDER10 (10% off) or WANDER15 (15% off). Do not offer more than 15%.
Whenever you grant a promo code, you MUST format it exactly as: [PROMO_CODE: <code>] at the end of your message. Example: "Here is your code: [PROMO_CODE: WANDER15]".`;
        }

        const messages = [
            {
                role: "system",
                content: `You are 'WanderBot', the friendly AI travel assistant for Wanderlust (an Airbnb-like booking platform). Keep your answers concise, engaging, and clear. Help users with booking questions, travel advice, or exploring listings.

Available Listings Context:
${listingsContext}
${activeListingPrompt}

When recommending any of the listings above, you MUST mention them using their ID in this specific format: [RECOMMENDED_LISTING_ID: <listing_id>]. DO NOT make up listing IDs. For example: "I recommend checking out [RECOMMENDED_LISTING_ID: 60c72b2f9b1d8b2bad689a71] for its gorgeous views!"

If the user asks you to plan a trip, generate a detailed day-by-day plan. At the very end of your response, output a structured JSON itinerary wrapped in a script tag like this:
<script type="application/json" class="itinerary-data">
{
  "destination": "Goa",
  "daysCount": 3,
  "days": [
    {
      "day": 1,
      "theme": "Beach Vibes & Sunsets",
      "activities": [
        { "time": "Morning", "desc": "Arrive in Goa, check in to resort" },
        { "time": "Afternoon", "desc": "Visit Calangute beach" },
        { "time": "Evening", "desc": "Sunset at Anjuna beach" }
      ]
    }
  ]
}
</script>

Always stay polite and welcoming. If no listings match what the user is asking, suggest they browse our listings manually.`
            }
        ];

        // Add history
        if (history && Array.isArray(history)) {
            history.forEach(msg => {
                messages.push({
                    role: msg.role === "assistant" ? "assistant" : "user",
                    content: msg.content
                });
            });
        }

        // Add current message
        messages.push({
            role: "user",
            content: message
        });

        // Call Groq API
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: messages,
                temperature: 0.7
            },
            {
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const responseText = response.data.choices[0].message.content;

        // 3. Extract recommended listing IDs from response
        const regex = /\[RECOMMENDED_LISTING_ID:\s*([a-f\d]{24})\]/gi;
        let match;
        const listingIds = [];
        while ((match = regex.exec(responseText)) !== null) {
            listingIds.push(match[1]);
        }

        const uniqueIds = [...new Set(listingIds)];
        let recommendedListings = [];
        if (uniqueIds.length > 0) {
            recommendedListings = await Listing.find({ _id: { $in: uniqueIds } })
                .select("title image price location country");
        }

        return res.json({ 
            reply: responseText, 
            listings: recommendedListings 
        });

    } catch (err) {
        console.error("Error in WanderBot controller using Groq:", err.response ? err.response.data : err.message);
        return res.status(500).json({ 
            reply: "Oops! WanderBot is having a slight connection issue right now. Please try again in a moment!" 
        });
    }
};

async function generateSimulationResponse(message, dbListings, currentListing, res) {
    const msgLower = message.toLowerCase();
    let reply = "";
    let recommendedListings = [];

    if (currentListing && (msgLower.includes("discount") || msgLower.includes("price") || msgLower.includes("bargain") || msgLower.includes("cheap") || msgLower.includes("coupon") || msgLower.includes("negotiate"))) {
        reply = `Hey there! As the host of **${currentListing.title}**, I'd be happy to offer you a special deal. Since you asked so nicely, I can give you a 15% discount for your stay! Use coupon code **WANDER15** at checkout. Have a wonderful trip! [PROMO_CODE: WANDER15]`;
    } else if (msgLower.includes("hello") || msgLower.includes("hi") || msgLower.includes("hey")) {
        reply = "Hello there! 🌟 I'm **WanderBot**, your Wanderlust travel companion. (Note: Running in Demo/Simulation Mode). How can I help you plan your next getaway today?";
    } else if (msgLower.includes("book") || msgLower.includes("how to book")) {
        reply = "Booking is super easy! Simply click on any listing you like, scroll down to the booking section, select your dates, and click **Book Now**! Let me know if you need recommendations on where to stay!";
    } else if (msgLower.includes("refund") || msgLower.includes("cancel")) {
        reply = "Cancellation policies vary by host. You can check the specific terms on the listing details page before booking. If you need support with an active booking, please visit your bookings dashboard!";
    } else if (msgLower.includes("recommend") || msgLower.includes("place") || msgLower.includes("stay") || msgLower.includes("beach") || msgLower.includes("villa") || msgLower.includes("cabin")) {
        reply = "Here are some wonderful listings matching your interest that you can book right now! Let me know if you need any more details:";
        // Recommend first 3 from our context
        recommendedListings = dbListings.slice(0, 3);
    } else if (msgLower.includes("plan") || msgLower.includes("itinerary") || msgLower.includes("trip")) {
        reply = "I've crafted a fantastic 3-day itinerary for your trip! Check out the interactive schedule below to see all the recommended spots and activities:\n\n<script type=\"application/json\" class=\"itinerary-data\">\n{\n  \"destination\": \"Manali\",\n  \"daysCount\": 3,\n  \"days\": [\n    {\n      \"day\": 1,\n      \"theme\": \"Mountain Arrival & Local Sights\",\n      \"activities\": [\n        { \"time\": \"Morning\", \"desc\": \"Arrive in scenic Manali, check in to your cozy cabin, and enjoy hot tea with mountain views.\" },\n        { \"time\": \"Afternoon\", \"desc\": \"Take a stroll through Old Manali, visiting the historic Hadimba Temple surrounded by pine forests.\" },\n        { \"time\": \"Evening\", \"desc\": \"Explore Mall Road for local shopping and dine at a traditional Himachali restaurant.\" }\n      ]\n    },\n    {\n      \"day\": 2,\n      \"theme\": \"Adventure in Solang Valley\",\n      \"activities\": [\n        { \"time\": \"Morning\", \"desc\": \"Head to Solang Valley for paragliding or cable car rides amidst snow-capped peaks.\" },\n        { \"time\": \"Afternoon\", \"desc\": \"Enjoy zorbing or go on a short hike to Jogini Waterfalls for a scenic picnic.\" },\n        { \"time\": \"Evening\", \"desc\": \"Relax by a bonfire at your stay and stargaze in the clear mountain air.\" }\n      ]\n    },\n    {\n      \"day\": 3,\n      \"theme\": \"Rohtang Pass & Departure\",\n      \"activities\": [\n        { \"time\": \"Morning\", \"desc\": \"Wake up early and drive to Rohtang Pass to play in the year-round snow.\" },\n        { \"time\": \"Afternoon\", \"desc\": \"Head back down, grabbing a hot bowl of mountain Maggi and taking pictures of the valleys.\" },\n        { \"time\": \"Evening\", \"desc\": \"Pack your bags and prepare for departure with unforgettable memories!\" }\n      ]\n    }\n  ]\n}\n</script>";
    } else {
        reply = `Thanks for asking! I'm currently running in **Demo Mode** because no \`GROK_API_KEY\` was found. Try asking me to **'plan a trip'** or **'recommend a stay'** to see my new interactive features! 🚀\n\nYour message was: *"${message}"*`;
    }

    return res.json({ reply, listings: recommendedListings });
}
