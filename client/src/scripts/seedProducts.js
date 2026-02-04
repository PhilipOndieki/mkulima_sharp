import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Error: Firebase configuration missing!');
  console.error('Please create a .env file with your Firebase credentials.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log(' Firebase initialized successfully');
console.log(`📍 Project: ${firebaseConfig.projectId}\n`);

// Product data array - ALL INDIVIDUAL PRODUCTS (NO VARIANTS)
// Sorted by price within each category: Cheapest → Most Expensive
const products = [
  // ==========================================
  // CATEGORY 1: FEEDERS (12 products)
  // Sorted: Cheapest (WP: 60) → Most Expensive (WP: 600)
  // ==========================================
  {
    id: "baby-feeder",
    name: "Baby Feeder",
    category: "Feeders",
    description: "Small feeder ideal for day-old chicks and young birds. Lightweight and easy to clean.",
    price: 100, // Retail Price (RP)
    wholesalePrice: 60, // Wholesale Price (WP)
    imageUrl: "/products/feeders/baby-feeder.webp",
    sku: "FEED-BABY",
    inStock: true,
    stockQuantity: 300,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "Small",
      material: "Plastic",
      suitable: "Day-old to 2 weeks"
    }
  },
  {
    id: "long-feeder-small",
    name: "Long Feeder Small",
    category: "Feeders",
    description: "Compact long feeder for smaller flocks. Space-efficient design.",
    price: 100, // RP
    wholesalePrice: 80, // WP
    imageUrl: "/products/feeders/long-feeder-small.webp",
    sku: "FEED-LONG-SML",
    inStock: true,
    stockQuantity: 120,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      length: "Small",
      material: "Plastic",
      suitable: "Small to medium flocks"
    }
  },
  {
    id: "feeder-1-5kg",
    name: "1.5 Kg Feeder",
    category: "Feeders",
    description: "Compact 1.5kg capacity feeder for small poultry operations.",
    price: 180, // RP
    wholesalePrice: 150, // WP
    imageUrl: "/products/feeders/feeder-1-5kg.webp",
    sku: "FEED-1-5KG",
    inStock: true,
    stockQuantity: 250,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "1.5 Kg",
      material: "Plastic",
      suitable: "Small flocks"
    }
  },
  {
    id: "long-feeder-24-red",
    name: "Long Feeder 24 (Red)",
    category: "Feeders",
    description: "24-inch red long feeder. Durable and easy to spot in the coop.",
    price: 250, // RP
    wholesalePrice: 180, // WP
    imageUrl: "/products/feeders/long-feeder-24-red.webp",
    sku: "FEED-LONG-24",
    inStock: true,
    stockQuantity: 80,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      length: "24 inches",
      material: "Plastic",
      color: "Red"
    }
  },
  {
    id: "feeding-tray-yellow",
    name: "Feeding Tray (Yellow)",
    category: "Feeders",
    description: "Round yellow feeding tray. Perfect for group feeding of chicks.",
    price: 250, // RP
    wholesalePrice: 200, // WP
    imageUrl: "/products/feeders/feeding-tray-yellow.webp",
    sku: "FEED-TRAY-YLW",
    inStock: true,
    stockQuantity: 150,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      shape: "Round",
      material: "Plastic",
      color: "Yellow"
    }
  },
  {
    id: "feeder-3kg-small",
    name: "3 Kg Feeder (Small)",
    category: "Feeders",
    description: "3kg capacity feeder with compact design for efficient feed management.",
    price: 350, // RP
    wholesalePrice: 280, // WP
    imageUrl: "/products/feeders/feeder-3kg-small.webp",
    sku: "FEED-3KG-SML",
    inStock: true,
    stockQuantity: 200,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "3 Kg",
      size: "Small",
      material: "Plastic"
    }
  },
  {
    id: "feeder-3kg-big",
    name: "3 Kg Feeder (Big)",
    category: "Feeders",
    description: "3kg capacity feeder with larger design for better access.",
    price: 380, // RP
    wholesalePrice: 300, // WP
    imageUrl: "/products/feeders/feeder-3kg-big.webp",
    sku: "FEED-3KG-BIG",
    inStock: true,
    stockQuantity: 180,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "3 Kg",
      size: "Big",
      material: "Plastic"
    }
  },
  {
    id: "feeder-no2",
    name: "Feeder No.2",
    category: "Feeders",
    description: "Professional-grade feeder for commercial operations. Heavy-duty construction for long-lasting use.",
    price: 400, // RP
    wholesalePrice: 350, // WP
    imageUrl: "/products/feeders/feeder-no2.webp",
    sku: "FEED-NO2",
    inStock: true,
    stockQuantity: 70,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Professional",
      material: "Heavy-duty plastic"
    }
  },
  {
    id: "feeder-6kg",
    name: "6 Kg Feeder",
    category: "Feeders",
    description: "6kg capacity feeder ideal for medium-sized flocks.",
    price: 450, // RP
    wholesalePrice: 380, // WP
    imageUrl: "/products/feeders/feeder-6kg.webp",
    sku: "FEED-6KG",
    inStock: true,
    stockQuantity: 200,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "6 Kg",
      material: "Plastic",
      suitable: "Medium flocks"
    }
  },
  {
    id: "rectangular-tray",
    name: "Rectangular Feeding Tray",
    category: "Feeders",
    description: "Large rectangular tray feeder for chicks and easy cleaning. Prevents feed wastage.",
    price: 450, // RP
    wholesalePrice: 400, // WP
    imageUrl: "/products/feeders/rectangular-tray.webp",
    sku: "FEED-TRAY-RECT",
    inStock: true,
    stockQuantity: 90,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      shape: "Rectangular",
      material: "Plastic"
    }
  },
  {
    id: "feeder-10kg",
    name: "10 Kg Feeder",
    category: "Feeders",
    description: "10kg capacity feeder for larger flocks. Reduces refilling frequency.",
    price: 650, // RP
    wholesalePrice: 550, // WP
    imageUrl: "/products/feeders/feeder-10kg.webp",
    sku: "FEED-10KG",
    inStock: true,
    stockQuantity: 150,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "10 Kg",
      material: "Plastic",
      suitable: "Large flocks"
    }
  },
  {
    id: "feeder-12kg",
    name: "12 Kg Feeder",
    category: "Feeders",
    description: "12kg capacity feeder for commercial operations. Maximum feed storage capacity.",
    price: 750, // RP
    wholesalePrice: 600, // WP
    imageUrl: "/products/feeders/feeder-12kg.webp",
    sku: "FEED-12KG",
    inStock: true,
    stockQuantity: 100,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "12 Kg",
      material: "Durable plastic",
      suitable: "Commercial farms"
    }
  },

  // ==========================================
  // CATEGORY 2: DRINKERS (10 products)
  // Sorted: Cheapest (WP: 75) → Most Expensive (WP: 1300)
  // ==========================================
  {
    id: "nipple-single",
    name: "Nipple Drinker (Single)",
    category: "Drinkers",
    description: "Single nipple drinker for water-saving and hygiene. Easy to install.",
    price: 80, // RP
    wholesalePrice: 75, // WP
    imageUrl: "/products/drinkers/nipple-single.webp",
    sku: "DRINK-NIP-SGL",
    inStock: true,
    stockQuantity: 200,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Nipple system",
      configuration: "Single"
    }
  },
  {
    id: "nipple-with-cups",
    name: "Nipple Drinker with Cups",
    category: "Drinkers",
    description: "Nipple drinker with attached cups for easy drinking access.",
    price: 100, // RP
    wholesalePrice: 90, // WP
    imageUrl: "/products/drinkers/nipple-with-cups.webp",
    sku: "DRINK-NIP-CUP",
    inStock: true,
    stockQuantity: 150,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Nipple system",
      features: "With cups"
    }
  },
  {
    id: "bucket-nipple",
    name: "Bucket Nipple Drinker",
    category: "Drinkers",
    description: "Nipple system designed for bucket mounting. Perfect for small setups.",
    price: 100, // RP
    wholesalePrice: 90, // WP
    imageUrl: "/products/drinkers/bucket-nipple.webp",
    sku: "DRINK-NIP-BCK",
    inStock: true,
    stockQuantity: 120,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Nipple system",
      mounting: "Bucket-compatible"
    }
  },
  {
    id: "double-nipple-cups",
    name: "Double Nipple with Cups",
    category: "Drinkers",
    description: "Double nipple drinker system with cups. Modern water-saving technology.",
    price: 150, // RP
    wholesalePrice: 140, // WP
    imageUrl: "/products/drinkers/double-nipple-cups.webp",
    sku: "DRINK-NIP-DBL-CUP",
    inStock: true,
    stockQuantity: 100,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Nipple system",
      configuration: "Double with cups"
    }
  },
  {
    id: "drinker-no2",
    name: "Drinker No.2",
    category: "Drinkers",
    description: "Standard gravity-fed drinker. Reliable and easy to maintain.",
    price: 250, // RP
    wholesalePrice: 220, // WP
    imageUrl: "/products/drinkers/drinker-no2.webp",
    sku: "DRINK-NO2",
    inStock: true,
    stockQuantity: 100,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Gravity-fed",
      capacity: "Standard"
    }
  },
  {
    id: "drinker-3l",
    name: "3L Drinker",
    category: "Drinkers",
    description: "3-liter capacity gravity-fed drinker. Ideal for small to medium flocks.",
    price: 250, // RP
    wholesalePrice: 230, // WP
    imageUrl: "/products/drinkers/drinker-3l.webp",
    sku: "DRINK-3L",
    inStock: true,
    stockQuantity: 150,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "3 Litres",
      type: "Gravity-fed"
    }
  },
  {
    id: "drinker-no2-7l",
    name: "Drinker No.2 (7 Litres)",
    category: "Drinkers",
    description: "Large 7-litre capacity drinker for bigger flocks. Reduces refilling frequency.",
    price: 500, // RP
    wholesalePrice: 420, // WP
    imageUrl: "/products/drinkers/drinker-no2-7l.webp",
    sku: "DRINK-NO2-7L",
    inStock: true,
    stockQuantity: 80,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "7 Litres",
      type: "Gravity-fed"
    }
  },
  {
    id: "bucket-model-drinker",
    name: "Bucket Model Drinker",
    category: "Drinkers",
    description: "Professional bucket-style drinker system for commercial operations.",
    price: 1000, // RP (only RP provided)
    imageUrl: "/products/drinkers/bucket-model.webp",
    sku: "DRINK-BCK-MDL",
    inStock: true,
    stockQuantity: 50,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Bucket model",
      suitable: "Commercial farms"
    }
  },
  {
    id: "auto-drinker-small",
    name: "Auto Drinker (Small)",
    category: "Drinkers",
    description: "Automatic water dispensing system for consistent water supply. Small capacity.",
    price: 1100, // RP
    wholesalePrice: 1000, // WP
    imageUrl: "/products/drinkers/auto-small.webp",
    sku: "DRINK-AUTO-SML",
    inStock: true,
    stockQuantity: 40,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Automatic",
      size: "Small"
    }
  },
  {
    id: "auto-drinker-big",
    name: "Auto Drinker (Big)",
    category: "Drinkers",
    description: "Large automatic water system for commercial operations. Advanced water management.",
    price: 1500, // RP
    wholesalePrice: 1300, // WP
    imageUrl: "/products/drinkers/auto-big.webp",
    sku: "DRINK-AUTO-BIG",
    inStock: true,
    stockQuantity: 30,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Automatic",
      size: "Large",
      suitable: "Commercial farms"
    }
  },

  // ==========================================
  // CATEGORY 3: BROODING EQUIPMENT (8 products)
  // Sorted: Cheapest (WP: 100) → Most Expensive (WP: 2200)
  // ==========================================
  {
    id: "bulb-holder",
    name: "Bulb Holder",
    category: "Brooding Equipment",
    description: "Heavy-duty bulb holder for brooding lamps. Safe and secure mounting.",
    price: 120, // RP
    wholesalePrice: 100, // WP
    imageUrl: "/products/brooding/bulb-holder.webp",
    sku: "BROOD-HOLDER",
    inStock: true,
    stockQuantity: 200,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Electrical accessory",
      material: "Heat-resistant"
    }
  },
  {
    id: "watering-can",
    name: "Watering Can",
    category: "Brooding Equipment",
    description: "Durable watering can for manual water distribution. Easy to handle.",
    price: 350, // RP
    wholesalePrice: 320, // WP
    imageUrl: "/products/brooding/watering-can.webp",
    sku: "BROOD-WATER-CAN",
    inStock: true,
    stockQuantity: 100,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      type: "Manual",
      material: "Plastic"
    }
  },
  {
    id: "spray-pump-small",
    name: "Spray Pump (Small)",
    category: "Brooding Equipment",
    description: "Compact spray pump for disinfection and pest control in small coops.",
    price: 450, // RP
    wholesalePrice: 380, // WP
    imageUrl: "/products/brooding/spray-pump-small.webp",
    sku: "BROOD-SPRAY-SML",
    inStock: true,
    stockQuantity: 90,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "Small",
      type: "Manual pump"
    }
  },
  {
    id: "brooding-pot-small",
    name: "Brooding Pot (Small)",
    category: "Brooding Equipment",
    description: "Small capacity brooding pot for warming chicks. Energy-efficient design.",
    price: 600, // RP (CORRECTED from 400)
    wholesalePrice: 400, // WP (CORRECTED from 600)
    imageUrl: "/products/brooding/brooding-pot-small.webp",
    sku: "BROOD-POT-SML",
    inStock: true,
    stockQuantity: 60,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "Small",
      type: "Heating pot"
    }
  },
  {
    id: "brooding-bulb-250w",
    name: "Brooding Bulb 250W",
    category: "Brooding Equipment",
    description: "250W infrared brooding bulb for optimal chick warming. Long-lasting performance.",
    price: 600, // RP
    wholesalePrice: 550, // WP
    imageUrl: "/products/brooding/brooding-bulb-250w.webp",
    sku: "BROOD-BULB-250W",
    inStock: true,
    stockQuantity: 150,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      wattage: "250W",
      type: "Infrared",
      suitable: "Brooding"
    }
  },
  {
    id: "brooding-pot-big",
    name: "Brooding Pot (Big)",
    category: "Brooding Equipment",
    description: "Large capacity brooding pot for bigger chick batches. Efficient heat distribution.",
    price: 800, // RP
    wholesalePrice: 700, // WP
    imageUrl: "/products/brooding/brooding-pot-big.webp",
    sku: "BROOD-POT-BIG",
    inStock: true,
    stockQuantity: 40,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "Large",
      type: "Heating pot"
    }
  },
  {
    id: "spray-pump-20l",
    name: "20L Spray Pump",
    category: "Brooding Equipment",
    description: "Large 20-litre pressure spray pump for commercial disinfection and pest control.",
    price: 2000, // RP
    wholesalePrice: 1800, // WP
    imageUrl: "/products/brooding/spray-pump-20l.webp",
    sku: "BROOD-SPRAY-20L",
    inStock: true,
    stockQuantity: 25,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "20 Litres",
      type: "Pressure pump"
    }
  },
  {
    id: "cooler-box-4-5l",
    name: "Cooler Box 4.5L",
    category: "Brooding Equipment",
    description: "Insulated cooler box for transporting chicks and maintaining temperature during transit.",
    wholesalePrice: 2200, // WP (only WP provided)
    imageUrl: "/products/brooding/cooler-box-4-5l.webp",
    sku: "BROOD-COOL-4-5L",
    inStock: true,
    stockQuantity: 20,
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true,
    specifications: {
      capacity: "4.5 Litres",
      type: "Insulated",
      purpose: "Chick transportation"
    }
  },

  // ==========================================
  // CATEGORY 4: AUTOMATIC INCUBATORS (6 products)
  // Sorted: Cheapest (WP: 12000) → Most Expensive (WP: 76500)
  // ==========================================
  {
    id: "incubator-64-eggs",
    name: "64 Eggs Automatic Incubator",
    category: "Automatic Incubators",
    description: "Fully automatic 64-egg capacity incubator. Digital temperature and humidity control.",
    price: 12500, // RP
    wholesalePrice: 12000, // WP
    imageUrl: "/products/incubators/incubator-64-eggs.webp",
    sku: "INCUB-64",
    inStock: true,
    stockQuantity: 15,
    unit: "unit",
    minWholesaleQty: 1,
    isActive: true,
    specifications: {
      capacity: "64 Eggs",
      type: "Fully automatic",
      features: "Digital controls"
    }
  },
  {
    id: "incubator-128-eggs",
    name: "128 Eggs Automatic Incubator",
    category: "Automatic Incubators",
    description: "128-egg capacity incubator for small to medium-scale hatching operations.",
    price: 21500, // RP
    wholesalePrice: 21000, // WP
    imageUrl: "/products/incubators/incubator-128-eggs.webp",
    sku: "INCUB-128",
    inStock: true,
    stockQuantity: 12,
    unit: "unit",
    minWholesaleQty: 1,
    isActive: true,
    specifications: {
      capacity: "128 Eggs",
      type: "Fully automatic",
      features: "Digital controls"
    }
  },
  {
    id: "incubator-204-eggs",
    name: "204 Eggs Automatic Incubator",
    category: "Automatic Incubators",
    description: "204-egg capacity incubator for growing operations. Reliable and efficient hatching.",
    price: 30000, // RP
    wholesalePrice: 29500, // WP
    imageUrl: "/products/incubators/incubator-204-eggs.webp",
    sku: "INCUB-204",
    inStock: true,
    stockQuantity: 8,
    unit: "unit",
    minWholesaleQty: 1,
    isActive: true,
    specifications: {
      capacity: "204 Eggs",
      type: "Fully automatic",
      features: "Advanced controls"
    }
  },
  {
    id: "incubator-256-eggs",
    name: "256 Eggs Automatic Incubator",
    category: "Automatic Incubators",
    description: "256-egg capacity incubator for medium-scale commercial hatching.",
    price: 37000, // RP
    wholesalePrice: 36000, // WP
    imageUrl: "/products/incubators/incubator-256-eggs.webp",
    sku: "INCUB-256",
    inStock: true,
    stockQuantity: 10,
    unit: "unit",
    minWholesaleQty: 1,
    isActive: true,
    specifications: {
      capacity: "256 Eggs",
      type: "Fully automatic",
      features: "Advanced controls"
    }
  },
  {
    id: "incubator-528-eggs",
    name: "528 Eggs Automatic Incubator",
    category: "Automatic Incubators",
    description: "Large 528-egg capacity incubator for commercial hatcheries. Advanced automation.",
    price: 60000, // RP
    wholesalePrice: 58000, // WP
    imageUrl: "/products/incubators/incubator-528-eggs.webp",
    sku: "INCUB-528",
    inStock: true,
    stockQuantity: 5,
    unit: "unit",
    minWholesaleQty: 1,
    isActive: true,
    specifications: {
      capacity: "528 Eggs",
      type: "Commercial-grade",
      features: "Advanced automation"
    }
  },
  {
    id: "incubator-1056-eggs",
    name: "1056 Eggs Automatic Incubator",
    category: "Automatic Incubators",
    description: "Premium 1056-egg capacity incubator for large-scale commercial operations. Top-tier automation and monitoring.",
    price: 78000, // RP
    wholesalePrice: 76500, // WP
    imageUrl: "/products/incubators/incubator-1056-eggs.webp",
    sku: "INCUB-1056",
    inStock: true,
    stockQuantity: 3,
    unit: "unit",
    minWholesaleQty: 1,
    isActive: true,
    specifications: {
      capacity: "1056 Eggs",
      type: "Premium commercial",
      features: "Advanced monitoring"
    }
  },

  // ==========================================
  // CATEGORY 5: CAGES & MESH (2 products)
  // Sorted: Cheapest (WP: 8000) → Most Expensive (WP: 40000)
  // ==========================================
  {
    id: "plastic-mesh-roll",
    name: "Plastic Mesh Roll",
    category: "Cages & Mesh",
    description: "Durable plastic mesh roll for constructing poultry houses, partitions, and flooring.",
    price: 8500, // RP
    wholesalePrice: 8000, // WP
    imageUrl: "/products/cages-mesh/plastic-mesh-roll.webp",
    sku: "MESH-PLST",
    inStock: true,
    stockQuantity: 25,
    unit: "roll",
    minWholesaleQty: 5,
    isActive: true,
    specifications: {
      type: "Plastic mesh",
      usage: "Construction, partitions"
    }
  },
  {
    id: "4-tier-layer-cage",
    name: "4 Tier Layer Cage",
    category: "Cages & Mesh",
    description: "Complete 4-tier layer cage system for efficient space utilization. Includes feeding and water systems.",
    wholesalePrice: 40000, // WP (only WP provided)
    imageUrl: "/products/cages-mesh/4-tier-layer-cage.webp",
    sku: "CAGE-4TIER",
    inStock: true,
    stockQuantity: 8,
    unit: "unit",
    minWholesaleQty: 1,
    isActive: true,
    specifications: {
      tiers: "4 Levels",
      type: "Complete cage system",
      features: "Feeding & water systems included"
    }
  },

  // ==========================================
  // CATEGORY 6: CHICKENS (2 breeds)
  // Sorted: Cheapest starting age → Most expensive starting age
  // ==========================================
  {
    id: "improved-kienyeji",
    name: "Improved Kienyeji",
    category: "Chickens",
    description: "Improved Kienyeji chickens - hardy, disease-resistant, and excellent for dual-purpose (meat and eggs). Available from day-old to point of lay.",
    imageUrl: "/products/chickens/improved-kienyeji.webp",
    sku: "CHICK-IMP-KIEN",
    inStock: true,
    unit: "chick",
    minWholesaleQty: 50,
    isActive: true,
    priceByAge: {
      "1-3 days": 100,
      "1 week": 140,
      "2 weeks": 170,
      "3 weeks": 200,
      "4 weeks": 250,
      "2 months": 450,
      "3 months": 600,
      "Point of lay": 850
    },
    specifications: {
      breed: "Improved Kienyeji",
      purpose: "Dual-purpose (meat & eggs)",
      characteristics: "Hardy, disease-resistant"
    }
  },
  {
    id: "layers",
    name: "Layers",
    category: "Chickens",
    description: "High-production layer chickens for commercial egg farming. Excellent egg-laying capacity. Available from day-old to point of lay.",
    imageUrl: "/products/chickens/layers.webp",
    sku: "CHICK-LAYERS",
    inStock: true,
    unit: "chick",
    minWholesaleQty: 50,
    isActive: true,
    priceByAge: {
      "Day old": 155,
      "1 week": 185,
      "2 weeks": 220,
      "3 weeks": 280,
      "4 weeks": 320,
      "Point of lay": 850
    },
    specifications: {
      breed: "Layers",
      purpose: "Egg production",
      characteristics: "High egg-laying capacity"
    }
  }
];

/**
 * Seed products to Firestore using batched writes
 */
async function seedProducts() {
  try {
    console.log('🌱 Starting Mkulima Sharp product seeding...\n');
    console.log(`📦 Total products to seed: ${products.length}\n`);
    
    let batch = writeBatch(db);
    let operationCount = 0;
    let batchCount = 1;
    let totalProducts = 0;

    for (const product of products) {
      const productRef = doc(db, 'products', product.id);
      
      // Add timestamps
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      batch.set(productRef, productData);
      operationCount++;
      totalProducts++;
      
      // Log progress with pricing info
      const priceInfo = product.price && product.wholesalePrice 
        ? `RP: ${product.price} | WP: ${product.wholesalePrice}`
        : product.price 
          ? `RP: ${product.price}`
          : product.wholesalePrice 
            ? `WP: ${product.wholesalePrice}`
            : product.priceByAge 
              ? `Ages: ${Object.keys(product.priceByAge).length}`
              : 'No price';
      
      console.log(`   ✓ ${product.name} (${priceInfo})`);

      // Commit batch if we reach 500 operations (Firestore limit)
      if (operationCount === 500) {
        console.log(`\n📦 Committing batch ${batchCount}...`);
        await batch.commit();
        console.log(` Batch ${batchCount} committed successfully\n`);
        
        // Start new batch
        batch = writeBatch(db);
        operationCount = 0;
        batchCount++;
      }
    }

    // Commit any remaining operations
    if (operationCount > 0) {
      console.log(`\n📦 Committing final batch ${batchCount}...`);
      await batch.commit();
      console.log(` Final batch committed successfully\n`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(` Total products seeded: ${totalProducts}`);
    console.log(` Total batches committed: ${batchCount}`);
    
    console.log('\n📊 Products by category:');
    
    // Count products by category
    const categoryCounts = {};
    products.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} products`);
    });
    
    console.log('\n✨ Products are sorted by price within each category:');
    console.log('   📈 Cheapest (Top Left) → Most Expensive (Bottom Right)');
    
    console.log('\n✨ Next steps:');
    console.log('   1. View products in Firebase Console');
    console.log('   2. Test on /products page');
    console.log('   3. Add product images to /public/products/ folders');
    console.log('   4. Update Firestore rules for production');
    console.log('   5. Manually assign admin role to first user\n');
    
    console.log('🔒 IMPORTANT: Update Firestore rules before going live!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\nError seeding products:', error);
    console.error('\nTroubleshooting:');
    console.error('   1. Check Firebase credentials in .env file');
    console.error('   2. Verify Firestore rules allow writes');
    console.error('   3. Ensure internet connection is stable');
    console.error('   4. Check Firebase Console for error details\n');
    process.exit(1);
  }
}

// Run seeding
console.log('🚀 Initializing seed script...\n');
seedProducts();
