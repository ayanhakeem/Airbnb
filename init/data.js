const sampleListings = [
  {
    title: "Taj Lake Palace Luxury Suite",
    description: "Experience royal living in the middle of Lake Pichola. Heritage palace offering stunning floating views and legendary hospitality.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    },
    price: 32000,
    location: "Udaipur, Rajasthan",
    country: "India"
  },
  {
    title: "The Oberoi Udaivilas Resort",
    description: "Luxury resort featuring grand Mewar-inspired architecture, private pools, and lush landscaped gardens overlooking Lake Pichola.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
    },
    price: 35000,
    location: "Udaipur, Rajasthan",
    country: "India"
  },
  {
    title: "Wildflower Hall Himalayan Sanctuary",
    description: "Perched 8,250 feet in the Himalayas, this former Lord Kitchener residence offers breathtaking mountain vistas and forest trails.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"
    },
    price: 28000,
    location: "Shimla, Himachal Pradesh",
    country: "India"
  },
  {
    title: "Kumarakom Lake Resort Villa",
    description: "Traditional luxury villas set along the serene backwaters of Kerala, featuring open-roof bathrooms and private plunge pools.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80"
    },
    price: 18000,
    location: "Kumarakom, Kerala",
    country: "India"
  },
  {
    title: "Evolve Back Kabini Safari Lodge",
    description: "Bordered by the Kabini River, this lodge offers a wildlife safari experience inspired by local Kadu Kuruba architecture.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
    },
    price: 24000,
    location: "Kabini, Karnataka",
    country: "India"
  },
  {
    title: "The Khyber Himalayan Resort",
    description: "Luxe ski-in/ski-out resort in the heart of Gulmarg pine forests, boasting views of the snow-clad Affarwat peaks.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&w=800&q=80"
    },
    price: 22000,
    location: "Gulmarg, Jammu & Kashmir",
    country: "India"
  },
  {
    title: "Rambagh Palace Heritage Suite",
    description: "Stay in the former residence of the Maharaja of Jaipur. Elaborate gardens, marble corridors, and historic luxury await.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80"
    },
    price: 45000,
    location: "Jaipur, Rajasthan",
    country: "India"
  },
  {
    title: "Taj Falaknuma Palace Hotel",
    description: "A palace in the clouds, 2,000 feet above Hyderabad. Ride a horse-drawn carriage to this historic Nizam residence.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    },
    price: 38000,
    location: "Hyderabad, Telangana",
    country: "India"
  },
  {
    title: "Brunton Boatyard Colonial Stay",
    description: "Historic hotel built on the remains of a Victorian shipyard in Fort Kochi. Views of dolphin pods and historic ships.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
    },
    price: 12000,
    location: "Kochi, Kerala",
    country: "India"
  },
  {
    title: "Ri Kynjai Lake Resort",
    description: "Khasi heritage cottages overlooking the tranquil waters of Umiam Lake, surrounded by pine forests.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=800&q=80"
    },
    price: 15000,
    location: "Shillong, Meghalaya",
    country: "India"
  },
  {
    title: "Glenburn Tea Estate Bungalow",
    description: "A heavenly tea estate retreat started by a Scottish tea company. Views of Mount Kanchenjunga from your private verandah.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    },
    price: 30000,
    location: "Darjeeling, West Bengal",
    country: "India"
  },
  {
    title: "Banasura Hill Eco Resort",
    description: "Built entirely of rammed earth, this eco-resort lies in the Western Ghats with panoramic nature trails.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80"
    },
    price: 9500,
    location: "Wayanad, Kerala",
    country: "India"
  },
  {
    title: "Ahilya Fort Heritage Fort Stay",
    description: "Stunning 18th-century fort perched high above the sacred Narmada River. Enjoy organic meals and peaceful boat rides.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
    },
    price: 26000,
    location: "Maheshwar, Madhya Pradesh",
    country: "India"
  },
  {
    title: "Barefoot at Havelock Island",
    description: "Eco-friendly cottages situated right next to the world-famous Radhanagar Beach. Walk straight into turquoise waters.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
    },
    price: 16500,
    location: "Havelock Island, Andamans",
    country: "India"
  },
  {
    title: "Spice Village Eco Retreat",
    description: "A tribute to the tribal villages of the highlands. Eco-resort with spice garden tours near Periyar Tiger Reserve.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
    },
    price: 11000,
    location: "Thekkady, Kerala",
    country: "India"
  },
  {
    title: "The Machan Forest Treehouse",
    description: "Unique eco-resort rising 30 to 45 feet above the forest canopy. Perfect secluded escape in the Western Ghats.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    },
    price: 14000,
    location: "Lonavala, Maharashtra",
    country: "India"
  },
  {
    title: "Tree House Resort Nature Stay",
    description: "Luxury treehouses built on real trees. Includes woodsy trails, nature viewing decks, and peaceful bird-watching.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
    },
    price: 13500,
    location: "Jaipur, Rajasthan",
    country: "India"
  },
  {
    title: "Butt's Clermont Heritage Houseboat",
    description: "Stay in a beautifully carved cedar houseboat docked at the edge of Dal Lake with private Mughal garden views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80"
    },
    price: 10500,
    location: "Srinagar, Jammu & Kashmir",
    country: "India"
  },
  {
    title: "The Tamara Coorg Mountain Resort",
    description: "Villas suspended over steep valleys in a private coffee plantation, with spectacular waterfall sounds below.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80"
    },
    price: 19500,
    location: "Coorg, Karnataka",
    country: "India"
  },
  {
    title: "Marari Beach Resort Eco-Villa",
    description: "Quiet seaside village resort in Kerala. Relax under coconut groves and explore local organic farming.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80"
    },
    price: 15500,
    location: "Mararikulam, Kerala",
    country: "India"
  },
  {
    title: "Vythiri Jungle Treehouse",
    description: "High-elevation treehouse surrounded by pristine tropical rainforests, offering panoramic valley views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=800&q=80"
    },
    price: 17000,
    location: "Wayanad, Kerala",
    country: "India"
  },
  {
    title: "Orange County Chardham Retreat",
    description: "Beautifully styled luxury cabins set inside lush coffee plantations with private swimming pools.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80"
    },
    price: 25000,
    location: "Coorg, Karnataka",
    country: "India"
  },
  {
    title: "Alila Diwa Luxury Resort",
    description: "Surrounded by lush green paddy fields, this premium Goan resort offers breathtaking infinity pool views.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=800&q=80"
    },
    price: 14500,
    location: "Majorda, Goa",
    country: "India"
  },
  {
    title: "The Lalit Resort & Spa Bekal",
    description: "Secluded resort bordered by a white sand beach and backwaters, featuring luxury wellness and therapy spas.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80"
    },
    price: 21000,
    location: "Bekal, Kerala",
    country: "India"
  },
  {
    title: "Taj Exotica Resort & Spa",
    description: "Mediterranean-style resort set in 56 acres of lush gardens along Benaulim Beach. Ultimate ocean luxury.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
    },
    price: 29000,
    location: "Benaulim, Goa",
    country: "India"
  },
  {
    title: "Neeralaya Heritage Timber Home",
    description: "Rustic yet luxurious timber houses situated on the banks of the Beas River, surrounded by apple orchards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&w=800&q=80"
    },
    price: 12500,
    location: "Kullu Valley, Himachal Pradesh",
    country: "India"
  },
  {
    title: "The Zuri Kumarakom Wellness Resort",
    description: "Set on the banks of Vembanad Lake, this resort offers luxury lagoon villas and world-class Ayurvedic healing.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80"
    },
    price: 16000,
    location: "Kumarakom, Kerala",
    country: "India"
  },
  {
    title: "Taj Madikeri Resort & Spa",
    description: "Perched on a hillside in the middle of a 180-acre rainforest, with sweeping views of Coorg valley.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&w=800&q=80"
    },
    price: 27000,
    location: "Coorg, Karnataka",
    country: "India"
  },
  {
    title: "Sterling Ooty Fern Hill Resort",
    description: "Fern Hill overlooks terraced valleys. Stay in cozy rooms with fireplace heaters and hill station vibes.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    },
    price: 7500,
    location: "Ooty, Tamil Nadu",
    country: "India"
  },
  {
    title: "Kurumba Village Hill Cottages",
    description: "Cottages hidden amidst spice havens, offering views of massive Nilgiri peaks and wild valley streams.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    },
    price: 11500,
    location: "Coonoor, Tamil Nadu",
    country: "India"
  },
  {
    title: "Windflower Vythiri Hill Resort",
    description: "A sanctuary set in a tea estate, offering Ayurvedic massage paths, organic dining, and misty mornings.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?auto=format&fit=crop&w=800&q=80"
    },
    price: 10500,
    location: "Wayanad, Kerala",
    country: "India"
  },
  {
    title: "Radisson Blu Resort Temple Bay",
    description: "Vast beach resort with a meandering pool and views of the ancient Shore Temple on the Bay of Bengal.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    },
    price: 13000,
    location: "Mahabalipuram, Tamil Nadu",
    country: "India"
  },
  {
    title: "Fisherman's Cove Taj Resort",
    description: "Built on the ramparts of an old Dutch fort, offering private beach cottages and dining over the sea.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
    },
    price: 20000,
    location: "Covelong, Chennai",
    country: "India"
  },
  {
    title: "Chhatra Sagar Luxury Tents",
    description: "Stay in beautifully designed canvas tents pitched on a historic dam reservoir. Incredible birdwatching.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
    },
    price: 24500,
    location: "Pali, Rajasthan",
    country: "India"
  },
  {
    title: "Mihir Garh Desert Castle",
    description: "An architectural marvel rising out of the Thar Desert, featuring private plunge pools and royal safaris.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
    },
    price: 36000,
    location: "Jodhpur, Rajasthan",
    country: "India"
  },
  {
    title: "Raas Devigarh Heritage Palace",
    description: "18th-century palace hotel in the Aravalli hills, offering a modern minimalist interior inside a historic fort.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
    },
    price: 23000,
    location: "Udaipur, Rajasthan",
    country: "India"
  },
  {
    title: "Samode Palace Royal Suite",
    description: "Exclusive regal stay exhibiting traditional Rajasthani frescoes, mirror work, and central courtyards.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    },
    price: 17500,
    location: "Samode, Jaipur",
    country: "India"
  },
  {
    title: "Umaid Bhawan Palace Luxury",
    description: "Live like a king in the world's sixth-largest private residence. Yellow sandstone architecture and museum tours.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    },
    price: 52000,
    location: "Jodhpur, Rajasthan",
    country: "India"
  },
  {
    title: "Jai Mahal Palace Jaipur",
    description: "Heritage palace dating back to 1745. Set amidst 18 acres of Mughal gardens in the center of the Pink City.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
    },
    price: 21500,
    location: "Jaipur, Rajasthan",
    country: "India"
  },
  {
    title: "Savoy Hotel Heritage Stay",
    description: "Charming English-style cottage rooms, grand fireplaces, and sprawling green lawns operating since 1829.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?auto=format&fit=crop&w=800&q=80"
    },
    price: 9000,
    location: "Ooty, Tamil Nadu",
    country: "India"
  },
  {
    title: "Fortune Resort Grace Mussoorie",
    description: "Perched on a quiet pine slope, offering panoramic views of the Doon Valley and Mall Road accessibility.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
    },
    price: 8500,
    location: "Mussoorie, Uttarakhand",
    country: "India"
  },
  {
    title: "JW Marriott Mussoorie Resort",
    description: "Luxurious resort featuring terrace dining with valley views, farm-to-table meals, and mountain trekking.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
    },
    price: 26500,
    location: "Mussoorie, Uttarakhand",
    country: "India"
  },
  {
    title: "The Pavilion Nainital",
    description: "Historic hotel built during the British era, located next to the Naina Devi temple and Naini Lake.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566908829550-e6551b00979b?auto=format&fit=crop&w=800&q=80"
    },
    price: 6800,
    location: "Nainital, Uttarakhand",
    country: "India"
  },
  {
    title: "Manu Allaya Mountain Spa Resort",
    description: "Tudor-style hotel offering hot spa facilities, gardens, and valley view suites in the quiet lanes of Manali.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=800&q=80"
    },
    price: 11000,
    location: "Manali, Himachal Pradesh",
    country: "India"
  },
  {
    title: "Solang Valley Snow Resort",
    description: "Ski resort situated directly inside Solang Valley, offering paragliding, snow ski paths, and campfire music.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80"
    },
    price: 9800,
    location: "Manali, Himachal Pradesh",
    country: "India"
  },
  {
    title: "Span Resort & Spa Riverfront",
    description: "Charming riverside wooden cottages set in the woods, with direct stone paths down to the Beas River.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
    },
    price: 16500,
    location: "Manali, Himachal Pradesh",
    country: "India"
  },
  {
    title: "The Grand Dragon Ladakh Hotel",
    description: "Eco-friendly hotel featuring solar-heated rooms and stunning window views of the cold desert mountains.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80"
    },
    price: 12000,
    location: "Leh, Ladakh",
    country: "India"
  },
  {
    title: "Taj Rishikesh Resort & Spa",
    description: "Luxe eco-resort perched on the banks of the Ganges River, offering private beach access and daily yoga.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80"
    },
    price: 31000,
    location: "Rishikesh, Uttarakhand",
    country: "India"
  },
  {
    title: "Spice Coast Houseboats Alappuzha",
    description: "Traditional kettuvallam houseboats constructed of coir and wood, gliding quietly through Kerala backwaters.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80"
    },
    price: 14500,
    location: "Alappuzha, Kerala",
    country: "India"
  },
  {
    title: "The Windflower Resort & Spa Coorg",
    description: "Sleek wooden villas surrounded by a private lake and giant bamboo groves. Unparalleled hillside peace.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80"
    },
    price: 18000,
    location: "Coorg, Karnataka",
    country: "India"
  }
];

module.exports = { data: sampleListings };