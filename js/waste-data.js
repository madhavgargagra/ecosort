/* ============================================================
   EcoSort — Waste Database (50+ items, 8 categories)
   waste-data.js
   ============================================================ */

'use strict';

const WASTE_CATEGORIES = {
  recyclable: {
    id: 'recyclable',
    label: 'Recyclable',
    icon: '♻️',
    color: '#00B4D8',
    bin: 'Blue Bin',
    description: 'Items that can be processed and turned into new materials.',
  },
  compostable: {
    id: 'compostable',
    label: 'Compostable',
    icon: '🌱',
    color: '#52B788',
    bin: 'Green Bin',
    description: 'Organic matter that breaks down into nutrient-rich compost.',
  },
  landfill: {
    id: 'landfill',
    label: 'General Waste',
    icon: '🗑️',
    color: '#8D99AE',
    bin: 'Black Bin',
    description: 'Items that cannot be recycled or composted and go to landfill.',
  },
  hazardous: {
    id: 'hazardous',
    label: 'Hazardous',
    icon: '⚠️',
    color: '#FFB703',
    bin: 'Special Collection',
    description: 'Dangerous materials requiring special handling and disposal.',
  },
  ewaste: {
    id: 'ewaste',
    label: 'E-Waste',
    icon: '💻',
    color: '#9B5DE5',
    bin: 'E-Waste Drop-off',
    description: 'Electronic devices and components that need specialist recycling.',
  },
  textiles: {
    id: 'textiles',
    label: 'Textiles',
    icon: '👕',
    color: '#F4845F',
    bin: 'Textile Bank',
    description: 'Clothing, fabric and soft furnishings — donate or recycle.',
  },
  bulky: {
    id: 'bulky',
    label: 'Bulky / Construction',
    icon: '🏗️',
    color: '#6A994E',
    bin: 'Bulky Waste Collection',
    description: 'Large or heavy items that need special pickup or drop-off.',
  },
  medical: {
    id: 'medical',
    label: 'Medical / Pharmaceutical',
    icon: '💊',
    color: '#EF233C',
    bin: 'Pharmacy / Medical Disposal',
    description: 'Medicines, sharps, and medical waste — never in regular bins.',
  },
};

/* ──────────────────────────────────────────────────────────
   WASTE ITEMS DATABASE
   Each entry:
   - name            (string)   Display name
   - aliases         (string[]) Alternative search terms
   - category        (string)   Key into WASTE_CATEGORIES
   - canRecycle      (boolean)  Quick flag
   - tips            (string)   Correct sorting instructions
   - commonMistakes  (string)   What people do wrong
   - funFact         (string)   Engaging educational fact
   - decompositionTime (string) Time in landfill
   - decompositionYears (number) For timeline positioning
   - co2Saved        (number)   kg CO₂ saved by correct disposal
   - waterSaved      (number)   Litres water saved
   - energySaved     (number)   Wh energy saved
   ────────────────────────────────────────────────────────── */

const WASTE_ITEMS = [

  // ─── RECYCLABLE ───────────────────────────────────────────
  {
    name: 'Plastic Bottle',
    aliases: ['water bottle', 'soda bottle', 'pet bottle', 'cold drink bottle'],
    category: 'recyclable',
    canRecycle: true,
    tips: 'Rinse clean, remove the cap and put cap in separately. Flatten to save space.',
    commonMistakes: "Don't crush — recycling machines sort by shape. Don't leave liquid inside.",
    funFact: 'Recycling one plastic bottle saves enough energy to power a laptop for 25 minutes! 🖥️',
    decompositionTime: '450 years',
    decompositionYears: 450,
    co2Saved: 0.08, waterSaved: 3.8, energySaved: 60,
  },
  {
    name: 'Aluminium Can',
    aliases: ['soda can', 'beer can', 'tin can', 'cola can', 'soft drink can'],
    category: 'recyclable',
    canRecycle: true,
    tips: 'Rinse empty cans. You can crush them to save space. No need to remove labels.',
    commonMistakes: "Don't put cans with food still inside. Aerosol cans go in separately.",
    funFact: 'Recycling aluminium uses 95% less energy than producing it from scratch. An aluminium can is back on the shelf within 60 days! ♻️',
    decompositionTime: '80–200 years',
    decompositionYears: 80,
    co2Saved: 0.16, waterSaved: 8.0, energySaved: 170,
  },
  {
    name: 'Cardboard Box',
    aliases: ['carton', 'corrugated box', 'shipping box', 'packaging box', 'amazon box'],
    category: 'recyclable',
    canRecycle: true,
    tips: 'Flatten boxes to save space. Remove tape and staples if possible. Keep dry.',
    commonMistakes: "Pizza boxes with grease stains go in compost, not recycling. Wax-coated cardboard is NOT recyclable.",
    funFact: 'Recycling one tonne of cardboard saves 17 trees and 26,000 litres of water! 🌳',
    decompositionTime: '2 months',
    decompositionYears: 0.17,
    co2Saved: 0.12, waterSaved: 10.0, energySaved: 80,
  },
  {
    name: 'Newspaper',
    aliases: ['paper', 'newsprint', 'magazine', 'journal', 'flyer', 'junk mail'],
    category: 'recyclable',
    canRecycle: true,
    tips: 'Keep paper dry. Remove plastic wrapping. Shredded paper may not be accepted — check locally.',
    commonMistakes: "Wet or food-stained paper cannot be recycled. Tissues and paper towels go to landfill.",
    funFact: 'The average person uses about 100 kg of paper per year. Recycling paper uses 70% less energy than making it new! 📰',
    decompositionTime: '2–6 weeks',
    decompositionYears: 0.08,
    co2Saved: 0.04, waterSaved: 2.0, energySaved: 40,
  },
  {
    name: 'Glass Bottle',
    aliases: ['glass jar', 'wine bottle', 'beer bottle', 'jam jar', 'glass container'],
    category: 'recyclable',
    canRecycle: true,
    tips: 'Rinse clean. Remove metal lids (recycle separately). Colour-sort if required locally.',
    commonMistakes: "Broken glass, window glass, and Pyrex are NOT recyclable in regular bins — too dangerous.",
    funFact: 'Glass can be recycled endlessly without any loss of quality. A glass bottle can be back on store shelves in just 30 days! 🍾',
    decompositionTime: '1 million years',
    decompositionYears: 1000000,
    co2Saved: 0.31, waterSaved: 4.5, energySaved: 130,
  },
  {
    name: 'Steel/Tin Can',
    aliases: ['food can', 'baked beans can', 'soup can', 'tomato tin', 'metal can'],
    category: 'recyclable',
    canRecycle: true,
    tips: 'Rinse clean. No need to remove labels. Lids can be left attached or put inside the can.',
    commonMistakes: "Don't put aerosol cans that still contain product. Paint tins go to hazardous waste.",
    funFact: 'Steel is the most recycled material in the world. Recycling one steel can saves enough energy to power a TV for 3 hours! 📺',
    decompositionTime: '50–100 years',
    decompositionYears: 50,
    co2Saved: 0.11, waterSaved: 5.2, energySaved: 90,
  },
  {
    name: 'Milk Carton',
    aliases: ['juice carton', 'tetrapack', 'tetra pak', 'dairy carton', 'oat milk carton'],
    category: 'recyclable',
    canRecycle: true,
    tips: 'Rinse empty, open flat. Many councils now accept these — check locally. Remove straws.',
    commonMistakes: "Wax-coated cartons may need special recycling. Check if your area accepts them.",
    funFact: 'Milk cartons (Tetra Paks) are made of 75% paper and are fully recyclable at specialist facilities.',
    decompositionTime: '5 years',
    decompositionYears: 5,
    co2Saved: 0.05, waterSaved: 2.0, energySaved: 45,
  },
  {
    name: 'Plastic Bag',
    aliases: ['carrier bag', 'polythene bag', 'shopping bag', 'grocery bag', 'bin liner'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Most councils do NOT accept plastic bags in recycling bins. Return to supermarket collection points.',
    commonMistakes: "NEVER put plastic bags in your recycling bin — they jam sorting machines and contaminate entire loads.",
    funFact: 'A single plastic bag can take 1,000 years to decompose. Reusable bags are the best solution — one replaces ~150 disposable bags per year! 🛍️',
    decompositionTime: '1,000 years',
    decompositionYears: 1000,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },

  // ─── COMPOSTABLE ──────────────────────────────────────────
  {
    name: 'Banana Peel',
    aliases: ['banana skin', 'fruit peel', 'fruit skin', 'fruit scraps'],
    category: 'compostable',
    canRecycle: false,
    tips: 'Goes in food waste / green bin. Great for home composting — adds potassium to soil.',
    commonMistakes: "Don't put stickers from fruit in compost — remove them first.",
    funFact: 'Banana peels are rich in potassium and phosphorus — burying them near rose bushes makes them bloom better! 🌹',
    decompositionTime: '2–5 weeks',
    decompositionYears: 0.06,
    co2Saved: 0.02, waterSaved: 0.5, energySaved: 5,
  },
  {
    name: 'Food Scraps',
    aliases: ['vegetable peels', 'kitchen waste', 'food leftovers', 'vegetable scraps', 'fruit leftovers', 'onion skin', 'eggshell'],
    category: 'compostable',
    canRecycle: false,
    tips: 'Most fruit and vegetable scraps can be composted. Use a sealed food caddy to avoid odours.',
    commonMistakes: "Meat, fish, and dairy should not go in home compost bins — they attract pests. Use food waste collection instead.",
    funFact: 'Composting food scraps can divert up to 30% of household waste from landfill and creates rich fertiliser for gardens! 🌿',
    decompositionTime: '2–4 weeks',
    decompositionYears: 0.05,
    co2Saved: 0.03, waterSaved: 1.0, energySaved: 10,
  },
  {
    name: 'Coffee Grounds',
    aliases: ['coffee filter', 'tea bags', 'tea leaves', 'coffee waste'],
    category: 'compostable',
    canRecycle: false,
    tips: 'Excellent compost ingredient. Coffee grounds also deter garden pests and improve soil drainage.',
    commonMistakes: "Some tea bags contain plastic mesh — check if yours are biodegradable before composting.",
    funFact: 'Coffee grounds are great for worm farms! They speed up decomposition and worms love the nitrogen boost. ☕',
    decompositionTime: '2–4 months',
    decompositionYears: 0.25,
    co2Saved: 0.02, waterSaved: 0.5, energySaved: 5,
  },
  {
    name: 'Pizza Box (greasy)',
    aliases: ['greasy cardboard', 'oily box', 'takeaway box with grease'],
    category: 'compostable',
    canRecycle: false,
    tips: 'Greasy pizza boxes CANNOT be recycled — the grease contaminates paper. Tear off and recycle the clean top half; compost the greasy bottom.',
    commonMistakes: "Putting greasy pizza boxes in recycling ruins entire batches of paper pulp.",
    funFact: 'Grease and oil are the #1 contaminant of paper recycling. One greasy box can ruin a whole tonne of recyclable paper! 🍕',
    decompositionTime: '2 months',
    decompositionYears: 0.17,
    co2Saved: 0.02, waterSaved: 0.5, energySaved: 8,
  },
  {
    name: 'Yard Waste',
    aliases: ['grass clippings', 'leaves', 'garden waste', 'branches', 'hedge clippings', 'plant trimmings'],
    category: 'compostable',
    canRecycle: false,
    tips: 'Use a garden/green bin or home compost. Mix "browns" (dry leaves) with "greens" for best results.',
    commonMistakes: "Don't compost diseased plants — the disease can spread.",
    funFact: 'Composting yard waste creates humus, which improves soil structure, water retention and supports a thriving microbiome. 🌻',
    decompositionTime: '1–6 months',
    decompositionYears: 0.25,
    co2Saved: 0.04, waterSaved: 1.5, energySaved: 15,
  },
  {
    name: 'Egg Shells',
    aliases: ['eggshells', 'egg shell', 'broken eggs'],
    category: 'compostable',
    canRecycle: false,
    tips: 'Crush before composting to speed decomposition. Excellent source of calcium for soil.',
    commonMistakes: "Egg shells take longer to break down whole — always crush them.",
    funFact: 'Crushed eggshells placed around plant bases deter slugs and snails — a natural pesticide! 🐌',
    decompositionTime: '3 years',
    decompositionYears: 3,
    co2Saved: 0.01, waterSaved: 0.3, energySaved: 3,
  },

  // ─── LANDFILL / GENERAL WASTE ─────────────────────────────
  {
    name: 'Styrofoam / Polystyrene',
    aliases: ['foam packaging', 'expanded polystyrene', 'EPS', 'foam cup', 'foam tray'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Styrofoam is NOT accepted in kerbside recycling. Some specialist drop-off points exist — check locally.',
    commonMistakes: "Putting polystyrene in recycling contaminates loads. It cannot be melted down with regular plastics.",
    funFact: 'Polystyrene takes around 500 years to decompose. It breaks into tiny beads that harm marine life. 🌊',
    decompositionTime: '500 years',
    decompositionYears: 500,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },
  {
    name: 'Crisp Packet',
    aliases: ['chip bag', 'snack packet', 'foil packet', 'biscuit wrapper'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Multi-layer foil/plastic crisp packets cannot be recycled kerbside. Some supermarkets have collection schemes.',
    commonMistakes: "These look foil-coated but the plastic/aluminium layers are fused and cannot be separated.",
    funFact: 'Crisp packets are made of at least 3 bonded layers, making them nearly impossible to recycle. They last hundreds of years in landfill. 🥔',
    decompositionTime: '80–100 years',
    decompositionYears: 80,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },
  {
    name: 'Nappy / Diaper',
    aliases: ['diaper', 'disposable nappy', 'sanitary pad', 'panty liner'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Wrap securely and place in general waste only. Never flush or put in recycling.',
    commonMistakes: "These are a major recycling contamination source. They contain human waste which is a biohazard.",
    funFact: 'One baby uses around 5,000 nappies before potty training, creating about 500 kg of waste. Reusable cloth nappies save 40% more CO₂. 👶',
    decompositionTime: '500 years',
    decompositionYears: 500,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },
  {
    name: 'Broken Ceramic / Pottery',
    aliases: ['broken mug', 'broken plate', 'crockery', 'broken cup', 'china', 'porcelain'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Wrap in newspaper before disposal for safety. Cannot be recycled with glass.',
    commonMistakes: "Ceramics melt at higher temperatures than glass and will ruin a batch of recycled glass.",
    funFact: 'Ceramics are among the most durable materials ever created — ancient pottery shards survive thousands of years underground! ⚱️',
    decompositionTime: '1 million years',
    decompositionYears: 1000000,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },
  {
    name: 'Plastic Straw',
    aliases: ['drinking straw', 'plastic straw'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Too small for recycling machinery — goes in general waste. Switch to paper or reusable metal straws.',
    commonMistakes: "Never put straws in recycling — they fall through sorting screens and contaminate the process.",
    funFact: 'Billions of plastic straws are used every day worldwide. They are consistently found in the stomachs of seabirds and sea turtles. 🐢',
    decompositionTime: '200 years',
    decompositionYears: 200,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },
  {
    name: 'Rubber Gloves',
    aliases: ['latex gloves', 'disposable gloves', 'kitchen gloves', 'rubber'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Dispose in general waste. Reusable rubber gloves can sometimes be donated.',
    commonMistakes: "Latex gloves are not recyclable and must not go in compost — they are a choking hazard for wildlife.",
    funFact: 'Natural rubber (latex) can take up to 50 years to decompose in a landfill despite being plant-based.',
    decompositionTime: '50 years',
    decompositionYears: 50,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },
  {
    name: 'Plastic Wrap / Cling Film',
    aliases: ['cling wrap', 'food wrap', 'saran wrap', 'plastic film'],
    category: 'landfill',
    canRecycle: false,
    tips: 'Not accepted in kerbside recycling. Minimise use — switch to beeswax wraps or reusable containers.',
    commonMistakes: "Plastic film clogs sorting machines — a major recycling contaminant.",
    funFact: 'About 1.2 billion metres of cling film is used in the UK alone each year — enough to wrap around the Earth 30 times! 🌍',
    decompositionTime: '450 years',
    decompositionYears: 450,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },

  // ─── HAZARDOUS ────────────────────────────────────────────
  {
    name: 'Battery',
    aliases: ['AA battery', 'AAA battery', 'cell battery', 'button cell', 'torch battery', 'remote battery'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Never put batteries in regular bins — they can cause fires. Drop off at supermarkets, DIY stores, or council hazardous waste points.',
    commonMistakes: "Batteries in bins cause fires in refuse trucks and at sorting facilities. This is a serious safety hazard.",
    funFact: 'One improperly disposed battery can contaminate 400 litres of soil and 6,000 litres of water with toxic heavy metals! ⚡',
    decompositionTime: '100 years',
    decompositionYears: 100,
    co2Saved: 0.15, waterSaved: 20.0, energySaved: 200,
  },
  {
    name: 'Paint Tin',
    aliases: ['house paint', 'spray paint', 'paint can', 'leftover paint'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Take to your local household hazardous waste facility. Dried latex paint (lid off, dried solid) may go in general waste — check locally.',
    commonMistakes: "Never pour paint down the drain — it pollutes waterways and water treatment systems.",
    funFact: 'Community paint reuse schemes collect leftover paint and remix it for community projects, saving money and reducing waste. 🎨',
    decompositionTime: 'Non-biodegradable',
    decompositionYears: 5000,
    co2Saved: 0.2, waterSaved: 15.0, energySaved: 150,
  },
  {
    name: 'Motor Oil',
    aliases: ['engine oil', 'car oil', 'lubricant', 'used oil'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Take to a garage, auto parts store, or recycling centre. Can be re-refined into new oil.',
    commonMistakes: "One litre of used motor oil can contaminate one million litres of drinking water!",
    funFact: 'Used motor oil never truly wears out — it just gets dirty. Re-refining used oil takes 65% less energy than refining crude oil. 🛢️',
    decompositionTime: 'Non-biodegradable',
    decompositionYears: 5000,
    co2Saved: 0.5, waterSaved: 50.0, energySaved: 500,
  },
  {
    name: 'Fluorescent Light Bulb',
    aliases: ['CFL bulb', 'energy saving bulb', 'fluorescent tube', 'mercury lamp'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Contains mercury — take to dedicated electrical waste collection or council drop-off. Handle carefully if broken.',
    commonMistakes: "Never put CFLs in regular bins. Breakage releases mercury vapour — ventilate the room and clean up carefully.",
    funFact: 'The mercury in one fluorescent bulb is enough to contaminate 30,000 litres of water — but it can be safely recovered through proper recycling! 💡',
    decompositionTime: '1,000+ years',
    decompositionYears: 1000,
    co2Saved: 0.2, waterSaved: 10.0, energySaved: 100,
  },
  {
    name: 'Pesticide / Weedkiller',
    aliases: ['insecticide', 'herbicide', 'garden chemicals', 'rat poison', 'weed killer'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Never pour down drains. Take to hazardous waste facility in original containers with labels intact.',
    commonMistakes: "Old pesticides poured down sinks pass through water treatment plants and contaminate rivers.",
    funFact: 'Many garden pesticides kill beneficial insects including bees and butterflies — natural alternatives like neem oil are much safer. 🐝',
    decompositionTime: 'Varies (years to decades)',
    decompositionYears: 20,
    co2Saved: 0.1, waterSaved: 30.0, energySaved: 50,
  },
  {
    name: 'Cleaning Chemicals',
    aliases: ['bleach', 'drain cleaner', 'oven cleaner', 'toilet cleaner', 'chemical cleaner'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Use completely or take to hazardous waste facility. Never mix chemicals. Empty bottles can be recycled.',
    commonMistakes: "Mixing bleach with ammonia-based cleaners produces toxic chloramine gas — never do this.",
    funFact: 'Natural cleaning alternatives like vinegar and baking soda clean just as effectively as most chemicals — safer for you and the planet! 🧴',
    decompositionTime: 'Non-biodegradable',
    decompositionYears: 1000,
    co2Saved: 0.1, waterSaved: 5.0, energySaved: 30,
  },

  // ─── E-WASTE ──────────────────────────────────────────────
  {
    name: 'Old Phone',
    aliases: ['mobile phone', 'smartphone', 'cell phone', 'broken phone', 'old mobile'],
    category: 'ewaste',
    canRecycle: false,
    tips: 'Wipe data first. Take to phone recycling at electronics or mobile stores. Many charities accept working phones.',
    commonMistakes: "Phone batteries are hazardous — never put phones in regular bins. They cause fires at waste facilities.",
    funFact: 'There is more gold in one tonne of old smartphones than in one tonne of gold ore! Recycling phones recovers precious metals. 📱',
    decompositionTime: '1,000 years',
    decompositionYears: 1000,
    co2Saved: 0.5, waterSaved: 50.0, energySaved: 300,
  },
  {
    name: 'Laptop / Computer',
    aliases: ['laptop', 'notebook', 'old computer', 'PC', 'desktop computer', 'monitor'],
    category: 'ewaste',
    canRecycle: false,
    tips: 'Wipe your hard drive first. Take to council recycling centre, electronics store, or donate if working.',
    commonMistakes: "Laptops contain lead, mercury and cadmium — these leach into soil and groundwater in landfills.",
    funFact: 'Manufacturing a single laptop requires 1,200 kg of raw materials. Recycling recovers 85% of these materials! 💻',
    decompositionTime: '1,000+ years',
    decompositionYears: 1000,
    co2Saved: 1.2, waterSaved: 100.0, energySaved: 800,
  },
  {
    name: 'Charger / Cable',
    aliases: ['USB cable', 'phone charger', 'laptop charger', 'power cable', 'extension cord'],
    category: 'ewaste',
    canRecycle: false,
    tips: 'Take to electronics recycling. Many councils have small WEEE boxes for cables and chargers.',
    commonMistakes: "Cables in regular bins tangle sorting machinery. The copper inside is valuable and fully recoverable.",
    funFact: 'Old cables are treasure troves of copper — 99% of the copper in cables can be recovered and reused infinitely! 🔌',
    decompositionTime: 'Hundreds of years',
    decompositionYears: 200,
    co2Saved: 0.2, waterSaved: 15.0, energySaved: 100,
  },
  {
    name: 'Television',
    aliases: ['TV', 'flat screen TV', 'old TV', 'CRT TV', 'monitor'],
    category: 'ewaste',
    canRecycle: false,
    tips: 'Book a bulky waste collection or take to WEEE recycling centre. Many retailers offer take-back when you buy a new TV.',
    commonMistakes: "Old CRT TVs contain 2–8 kg of lead. Flat screens contain mercury backlight tubes. Never put in regular waste.",
    funFact: 'Over 50 million tonnes of e-waste is generated globally each year — the equivalent of throwing away 1,000 laptops every second! 📺',
    decompositionTime: 'Non-biodegradable',
    decompositionYears: 5000,
    co2Saved: 1.5, waterSaved: 200.0, energySaved: 1200,
  },
  {
    name: 'Batteries (Rechargeable/Li-ion)',
    aliases: ['lithium battery', 'rechargeable battery', 'laptop battery', 'power bank', 'li-ion'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Take to battery collection points at supermarkets or electronics stores. NEVER place in general waste or recycle bins — severe fire risk.',
    commonMistakes: "Damaged or punctured Li-ion batteries can catch fire. Store safely and take to specialist collection.",
    funFact: 'Lithium-ion batteries that are thrown in bins cause thousands of bin lorry fires every year globally. They are the #1 cause of waste-industry fires! 🔥',
    decompositionTime: '100 years',
    decompositionYears: 100,
    co2Saved: 0.3, waterSaved: 25.0, energySaved: 250,
  },

  // ─── TEXTILES ─────────────────────────────────────────────
  {
    name: 'Old T-Shirt',
    aliases: ['t-shirt', 'old clothes', 'worn clothing', 'clothing', 'shirt', 'jumper', 'sweater'],
    category: 'textiles',
    canRecycle: false,
    tips: 'If wearable — donate to charity shops or clothes banks. If worn out — take to textile recycling banks at supermarkets.',
    commonMistakes: "Don't put clothes in recycling bins. Even worn-out clothes can be recycled into rags, insulation or stuffing.",
    funFact: 'The fashion industry produces more CO₂ than all aviation and shipping combined! Donating just one piece of clothing saves 3 kg CO₂. 👕',
    decompositionTime: '20–200 years',
    decompositionYears: 20,
    co2Saved: 3.0, waterSaved: 2700.0, energySaved: 400,
  },
  {
    name: 'Shoes',
    aliases: ['trainers', 'sneakers', 'boots', 'old shoes', 'heels', 'sandals'],
    category: 'textiles',
    canRecycle: false,
    tips: 'Donate if wearable. Many shoe brands have take-back schemes. Nike, Adidas and others grind old shoes into sports surfaces.',
    commonMistakes: "Shoes in landfill release toxic chemicals as the rubber and adhesives break down.",
    funFact: 'Nike\'s "Reuse-A-Shoe" programme has recycled over 30 million pairs of shoes into running tracks and playgrounds! 👟',
    decompositionTime: '25–40 years',
    decompositionYears: 30,
    co2Saved: 1.5, waterSaved: 500.0, energySaved: 300,
  },
  {
    name: 'Bedsheets / Towels',
    aliases: ['bed sheet', 'duvet', 'pillow', 'pillow case', 'towel', 'linen', 'blanket'],
    category: 'textiles',
    canRecycle: false,
    tips: 'Donate to charity if clean and usable. Animal shelters often accept old towels and blankets.',
    commonMistakes: "Dumping duvets in general waste — most can be donated or recycled into industrial rags.",
    funFact: 'Animal shelters are always looking for old towels and blankets for animal bedding — a wonderful second life for old linen! 🐾',
    decompositionTime: '5–40 years',
    decompositionYears: 20,
    co2Saved: 2.0, waterSaved: 1000.0, energySaved: 300,
  },

  // ─── BULKY / CONSTRUCTION ─────────────────────────────────
  {
    name: 'Old Furniture',
    aliases: ['sofa', 'chair', 'table', 'wardrobe', 'bed frame', 'bookshelf', 'desk'],
    category: 'bulky',
    canRecycle: false,
    tips: 'Book a bulky waste collection. Consider donating via freecycle, Gumtree or local charities. Many councils offer free pickup.',
    commonMistakes: "Fly-tipping furniture is illegal and harms the environment. Always book proper collection.",
    funFact: 'Furniture made from solid wood can be repaired, upcycled and lasts decades — far better than flat-pack alternatives. 🪑',
    decompositionTime: '10–100 years',
    decompositionYears: 50,
    co2Saved: 5.0, waterSaved: 100.0, energySaved: 1000,
  },
  {
    name: 'Batteries (Car)',
    aliases: ['car battery', 'lead acid battery', 'vehicle battery'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Take to a garage, auto parts store or scrap metal dealer — most accept old car batteries. 98% of lead acid batteries are recyclable.',
    commonMistakes: "Never put a car battery in household waste — the sulphuric acid and lead are extremely hazardous.",
    funFact: 'Lead-acid car batteries are the world\'s most recycled product, with over 99% recycling rate in developed countries! 🚗',
    decompositionTime: 'Non-biodegradable',
    decompositionYears: 5000,
    co2Saved: 0.8, waterSaved: 80.0, energySaved: 600,
  },

  // ─── MEDICAL ──────────────────────────────────────────────
  {
    name: 'Expired Medicine',
    aliases: ['old medicine', 'expired pills', 'unused medication', 'tablets', 'capsules', 'drugs'],
    category: 'medical',
    canRecycle: false,
    tips: 'Return to any pharmacy — they will dispose safely. Never flush or bin medicines.',
    commonMistakes: "Medicines flushed down toilets pass through water treatment and enter rivers, harming aquatic ecosystems.",
    funFact: 'Pharmaceuticals found in rivers are affecting fish behaviour and reproduction worldwide — take-back programmes are critical! 💊',
    decompositionTime: 'Varies',
    decompositionYears: 5,
    co2Saved: 0.0, waterSaved: 100.0, energySaved: 0,
  },
  {
    name: 'Syringes / Sharps',
    aliases: ['needle', 'syringe', 'insulin pen', 'lancet', 'sharps'],
    category: 'medical',
    canRecycle: false,
    tips: 'Use a sharps container. Return filled container to your pharmacy or GP surgery for safe disposal.',
    commonMistakes: "NEVER put syringes in regular bins — injury risk to waste workers. Always use a sharps bin.",
    funFact: 'NHS Sharps Bins can be requested for free from your GP if you use injectable medication at home. 🩹',
    decompositionTime: 'Hundreds of years',
    decompositionYears: 200,
    co2Saved: 0.0, waterSaved: 0.0, energySaved: 0,
  },
  {
    name: 'Thermometer (Mercury)',
    aliases: ['mercury thermometer', 'glass thermometer', 'old thermometer'],
    category: 'hazardous',
    canRecycle: false,
    tips: 'Take to household hazardous waste facility. Switch to digital — mercury thermometers are banned in many countries.',
    commonMistakes: "A broken mercury thermometer requires careful cleanup and must not go in regular bins.",
    funFact: 'Mercury from a single thermometer can contaminate a 20-acre lake for a year. Digital thermometers are just as accurate and completely safe! 🌡️',
    decompositionTime: 'Non-biodegradable',
    decompositionYears: 5000,
    co2Saved: 0.1, waterSaved: 50.0, energySaved: 20,
  },
];

/* ──────────────────────────────────────────────────────────
   SEARCH UTILITIES
   ────────────────────────────────────────────────────────── */

/**
 * Find a waste item by name or alias (case-insensitive, fuzzy).
 * @param {string} query
 * @returns {object|null}
 */
function findWasteItem(query) {
  if (!query) return null;
  const q = query.trim().toLowerCase();

  // Exact name match first
  let match = WASTE_ITEMS.find(item => item.name.toLowerCase() === q);
  if (match) return match;

  // Alias exact match
  match = WASTE_ITEMS.find(item =>
    item.aliases && item.aliases.some(a => a.toLowerCase() === q)
  );
  if (match) return match;

  // Partial name/alias match
  match = WASTE_ITEMS.find(item =>
    item.name.toLowerCase().includes(q) ||
    (item.aliases && item.aliases.some(a => a.toLowerCase().includes(q)))
  );
  if (match) return match;

  // Partial query in name/alias (query contains a word that matches)
  const words = q.split(/\s+/);
  match = WASTE_ITEMS.find(item =>
    words.some(word => item.name.toLowerCase().includes(word)) ||
    (item.aliases && item.aliases.some(a =>
      words.some(word => a.toLowerCase().includes(word))
    ))
  );
  return match || null;
}

/**
 * Get autocomplete suggestions for a search query.
 * @param {string} query
 * @param {number} limit
 * @returns {object[]}
 */
function getSearchSuggestions(query, limit = 6) {
  if (!query || query.length < 1) return [];
  const q = query.trim().toLowerCase();
  const seen = new Set();
  const results = [];

  for (const item of WASTE_ITEMS) {
    if (results.length >= limit) break;
    if (seen.has(item.name)) continue;
    const nameMatch = item.name.toLowerCase().includes(q);
    const aliasMatch = item.aliases && item.aliases.some(a => a.toLowerCase().includes(q));
    if (nameMatch || aliasMatch) {
      seen.add(item.name);
      results.push(item);
    }
  }
  return results;
}

/**
 * Map a MobileNet/TF.js class label to a waste item.
 * MobileNet returns ImageNet class names — map common ones to our database.
 * @param {string} className - ImageNet class name
 * @returns {object|null}
 */
function mapMLClassToWasteItem(className) {
  const label = className.toLowerCase();

  // Mapping table: ImageNet label fragments → our item names
  const mappings = [
    // Bottles
    { keywords: ['water bottle', 'plastic bottle', 'pop bottle', 'soda bottle'], name: 'Plastic Bottle' },
    { keywords: ['wine bottle', 'beer bottle', 'glass bottle'], name: 'Glass Bottle' },
    { keywords: ['milk can', 'carton'], name: 'Milk Carton' },
    // Cans
    { keywords: ['can opener', 'pop can', 'can'], name: 'Aluminium Can' },
    // Paper / Cardboard
    { keywords: ['newspaper', 'paper towel', 'book jacket', 'envelope', 'paper'], name: 'Newspaper' },
    { keywords: ['cardboard', 'box', 'carton'], name: 'Cardboard Box' },
    // Electronics
    { keywords: ['mobile phone', 'cell phone', 'smartphone', 'iphone'], name: 'Old Phone' },
    { keywords: ['laptop', 'notebook'], name: 'Laptop / Computer' },
    { keywords: ['television', 'monitor'], name: 'Television' },
    { keywords: ['power plug', 'electric fan', 'cable'], name: 'Charger / Cable' },
    // Food waste
    { keywords: ['banana', 'peel'], name: 'Banana Peel' },
    { keywords: ['orange', 'lemon', 'apple', 'pear', 'grape', 'fruit'], name: 'Food Scraps' },
    { keywords: ['coffee', 'espresso'], name: 'Coffee Grounds' },
    { keywords: ['egg', 'eggnog'], name: 'Egg Shells' },
    // Clothing
    { keywords: ['t-shirt', 'jersey', 'sweatshirt', 'shirt', 'sweater'], name: 'Old T-Shirt' },
    { keywords: ['shoe', 'sneaker', 'boot', 'sandal', 'running shoe'], name: 'Shoes' },
    // Hazardous
    { keywords: ['battery'], name: 'Battery' },
    { keywords: ['bulb', 'lamp', 'light'], name: 'Fluorescent Light Bulb' },
    // Other
    { keywords: ['bag', 'shopping bag', 'plastic bag'], name: 'Plastic Bag' },
    { keywords: ['cup', 'coffee cup', 'paper cup'], name: 'Styrofoam / Polystyrene' },
    { keywords: ['pizza'], name: 'Pizza Box (greasy)' },
  ];

  for (const m of mappings) {
    if (m.keywords.some(k => label.includes(k))) {
      return WASTE_ITEMS.find(i => i.name === m.name) || null;
    }
  }
  return null;
}

// Export for other modules
window.WASTE_CATEGORIES = WASTE_CATEGORIES;
window.WASTE_ITEMS = WASTE_ITEMS;
window.findWasteItem = findWasteItem;
window.getSearchSuggestions = getSearchSuggestions;
window.mapMLClassToWasteItem = mapMLClassToWasteItem;
