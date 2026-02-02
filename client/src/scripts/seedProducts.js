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
  console.error('❌ Error: Firebase configuration missing!');
  console.error('Please create a .env file with your Firebase credentials.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('✅ Firebase initialized successfully');
console.log(`📍 Project: ${firebaseConfig.projectId}\n`);

// Placeholder images by category
const placeholderImages = {
  "Feeders": "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&h=600&fit=crop",
  "Drinkers": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
  "Brooding Equipment": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop",
  "Automatic Incubators": "https://images.unsplash.com/photo-1545082829-e0ba042e5a99?w=800&h=600&fit=crop",
  "Cages & Mesh": "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800&h=600&fit=crop"
};

// Product data array with all products from PDF
const products = [
  // ==================== FEEDERS ====================
  {
    id: "standard-feeders",
    name: "Standard Poultry Feeders",
    category: "Feeders",
    description: "Durable plastic feeders for poultry farming, available in large to medium capacities. Ideal for commercial and backyard farms.",
    imageUrl: placeholderImages["Feeders"],
    hasVariants: true,
    variants: [
      {
        id: "12kg",
        name: "12 KG",
        sku: "FEED-STD-12KG",
        wholesalePrice: 600,
        retailPrice: 750,
        inStock: true,
        stockQuantity: 100
      },
      {
        id: "10kg",
        name: "10 KG",
        sku: "FEED-STD-10KG",
        wholesalePrice: 550,
        retailPrice: 650,
        inStock: true,
        stockQuantity: 150
      },
      {
        id: "6kg",
        name: "6 KG",
        sku: "FEED-STD-6KG",
        wholesalePrice: 380,
        retailPrice: 450,
        inStock: true,
        stockQuantity: 200
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "compact-feeders",
    name: "Compact Poultry Feeders",
    category: "Feeders",
    description: "Small capacity feeders perfect for chicks and small flocks. Available in multiple sizes for different growth stages.",
    imageUrl: placeholderImages["Feeders"],
    hasVariants: true,
    variants: [
      {
        id: "3kg-big",
        name: "3 KG Big",
        sku: "FEED-CMP-3KG-BIG",
        wholesalePrice: 300,
        retailPrice: 380,
        inStock: true,
        stockQuantity: 180
      },
      {
        id: "3kg-small",
        name: "3 KG Small",
        sku: "FEED-CMP-3KG-SML",
        wholesalePrice: 280,
        retailPrice: 350,
        inStock: true,
        stockQuantity: 200
      },
      {
        id: "1.5kg",
        name: "1.5 KG",
        sku: "FEED-CMP-1.5KG",
        wholesalePrice: 150,
        retailPrice: 180,
        inStock: true,
        stockQuantity: 250
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "long-feeders",
    name: "Long Feeders",
    category: "Feeders",
    description: "Linear feeding systems for maximizing space efficiency. Ideal for larger flocks and commercial operations.",
    imageUrl: placeholderImages["Feeders"],
    hasVariants: true,
    variants: [
      {
        id: "long-24",
        name: "Long Feeder 24",
        sku: "FEED-LONG-24",
        wholesalePrice: 180,
        retailPrice: 250,
        inStock: true,
        stockQuantity: 80
      },
      {
        id: "long-small",
        name: "Long Feeder Small",
        sku: "FEED-LONG-SML",
        wholesalePrice: 80,
        retailPrice: 100,
        inStock: true,
        stockQuantity: 120
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "feeding-trays",
    name: "Feeding Trays",
    category: "Feeders",
    description: "Flat tray feeders for chicks and easy cleaning. Prevents feed wastage and promotes uniform feeding.",
    imageUrl: placeholderImages["Feeders"],
    hasVariants: true,
    variants: [
      {
        id: "rectangular",
        name: "Rectangular Tray",
        sku: "FEED-TRAY-RECT",
        wholesalePrice: 400,
        retailPrice: 450,
        inStock: true,
        stockQuantity: 90
      },
      {
        id: "round",
        name: "Feeding Tray",
        sku: "FEED-TRAY-RND",
        wholesalePrice: 200,
        retailPrice: 250,
        inStock: true,
        stockQuantity: 150
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "baby-feeders",
    name: "Baby Feeders",
    category: "Feeders",
    description: "Specially designed feeders for day-old chicks and young birds. Low height for easy access.",
    imageUrl: placeholderImages["Feeders"],
    hasVariants: true,
    variants: [
      {
        id: "baby-standard",
        name: "Baby Feeder",
        sku: "FEED-BABY-STD",
        wholesalePrice: 60,
        retailPrice: 100,
        inStock: true,
        stockQuantity: 300
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "feeder-no2",
    name: "Feeder No.2",
    category: "Feeders",
    description: "Professional-grade feeder for commercial operations. Heavy-duty construction for long-lasting use.",
    imageUrl: placeholderImages["Feeders"],
    hasVariants: true,
    variants: [
      {
        id: "standard",
        name: "Feeder No.2",
        sku: "FEED-NO2-STD",
        wholesalePrice: 350,
        retailPrice: 400,
        inStock: true,
        stockQuantity: 70
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },

  // ==================== DRINKERS ====================
  {
    id: "nipple-systems",
    name: "Nipple Drinker Systems",
    category: "Drinkers",
    description: "Modern water-saving nipple drinking systems. Reduces water wastage and maintains hygiene.",
    imageUrl: placeholderImages["Drinkers"],
    hasVariants: true,
    variants: [
      {
        id: "double-cups",
        name: "Double Nipple with Cups",
        sku: "DRINK-NIP-DBL-CUP",
        wholesalePrice: 140,
        retailPrice: 150,
        inStock: true,
        stockQuantity: 100
      },
      {
        id: "single",
        name: "Nipple",
        sku: "DRINK-NIP-SGL",
        wholesalePrice: 75,
        retailPrice: 80,
        inStock: true,
        stockQuantity: 200
      },
      {
        id: "with-cups",
        name: "Nipple with Cups",
        sku: "DRINK-NIP-CUP",
        wholesalePrice: 90,
        retailPrice: 100,
        inStock: true,
        stockQuantity: 150
      },
      {
        id: "bucket",
        name: "Bucket Nipple",
        sku: "DRINK-NIP-BCK",
        wholesalePrice: 90,
        retailPrice: 100,
        inStock: true,
        stockQuantity: 120
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "standard-drinkers",
    name: "Standard Drinkers",
    category: "Drinkers",
    description: "Traditional gravity-fed drinkers in various capacities. Easy to clean and maintain.",
    imageUrl: placeholderImages["Drinkers"],
    hasVariants: true,
    variants: [
      {
        id: "3l",
        name: "3L Drinker",
        sku: "DRINK-STD-3L",
        wholesalePrice: 230,
        retailPrice: 250,
        inStock: true,
        stockQuantity: 130
      },
      {
        id: "no2-small",
        name: "Drinker No.2 Small",
        sku: "DRINK-NO2-SML",
        wholesalePrice: 220,
        retailPrice: 250,
        inStock: true,
        stockQuantity: 140
      },
      {
        id: "no2-large",
        name: "Drinker No.2 Large",
        sku: "DRINK-NO2-LRG",
        wholesalePrice: 420,
        retailPrice: 500,
        inStock: true,
        stockQuantity: 80
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "automatic-drinkers",
    name: "Automatic Drinkers",
    category: "Drinkers",
    description: "Automatic refilling drinkers for continuous water supply. Perfect for commercial farms.",
    imageUrl: placeholderImages["Drinkers"],
    hasVariants: true,
    variants: [
      {
        id: "small",
        name: "Auto Small",
        sku: "DRINK-AUTO-SML",
        wholesalePrice: 1000,
        retailPrice: 1100,
        inStock: true,
        stockQuantity: 40
      },
      {
        id: "big",
        name: "Auto Big",
        sku: "DRINK-AUTO-BIG",
        wholesalePrice: 1300,
        retailPrice: 1500,
        inStock: true,
        stockQuantity: 30
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "bucket-drinkers",
    name: "Bucket Model Drinkers",
    category: "Drinkers",
    description: "Large capacity bucket-style drinkers with multiple drinking points. Ideal for large flocks.",
    imageUrl: placeholderImages["Drinkers"],
    hasVariants: true,
    variants: [
      {
        id: "standard",
        name: "Bucket Model",
        sku: "DRINK-BCK-STD",
        wholesalePrice: 1000,
        retailPrice: 1000,
        inStock: true,
        stockQuantity: 50
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },

  // ==================== BROODING EQUIPMENT ====================
  {
    id: "brooding-pots",
    name: "Traditional Brooding Pots",
    category: "Brooding Equipment",
    description: "Clay brooding pots for natural heat retention. Traditional method preferred by many farmers.",
    imageUrl: placeholderImages["Brooding Equipment"],
    hasVariants: true,
    variants: [
      {
        id: "big",
        name: "Brooding Pot Big",
        sku: "BROOD-POT-BIG",
        wholesalePrice: 700,
        retailPrice: 800,
        inStock: true,
        stockQuantity: 30
      },
      {
        id: "small",
        name: "Brooding Pot Small",
        sku: "BROOD-POT-SML",
        wholesalePrice: 600,
        retailPrice: 400,
        inStock: true,
        stockQuantity: 45
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "brooding-bulbs",
    name: "Brooding Bulbs",
    category: "Brooding Equipment",
    description: "Infrared heat bulbs for brooding. 250W capacity for optimal warmth.",
    imageUrl: placeholderImages["Brooding Equipment"],
    hasVariants: true,
    variants: [
      {
        id: "250w",
        name: "Brooding Bulb 250W",
        sku: "BROOD-BULB-250W",
        wholesalePrice: 550,
        retailPrice: 600,
        inStock: true,
        stockQuantity: 80
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "brooding-accessories",
    name: "Brooding Accessories",
    category: "Brooding Equipment",
    description: "Essential accessories for brooding setup including bulb holders and watering cans.",
    imageUrl: placeholderImages["Brooding Equipment"],
    hasVariants: true,
    variants: [
      {
        id: "bulb-holder",
        name: "Bulb Holder",
        sku: "BROOD-ACC-HOLD",
        wholesalePrice: 100,
        retailPrice: 120,
        inStock: true,
        stockQuantity: 150
      },
      {
        id: "watering-can",
        name: "Watering Can",
        sku: "BROOD-ACC-CAN",
        wholesalePrice: 320,
        retailPrice: 350,
        inStock: true,
        stockQuantity: 60
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "spray-pumps",
    name: "Spray Pumps",
    category: "Brooding Equipment",
    description: "Manual and pressure spray pumps for disinfection and pest control.",
    imageUrl: placeholderImages["Brooding Equipment"],
    hasVariants: true,
    variants: [
      {
        id: "small",
        name: "Spray Pump Small",
        sku: "BROOD-SPRAY-SML",
        wholesalePrice: 380,
        retailPrice: 450,
        inStock: true,
        stockQuantity: 90
      },
      {
        id: "20l",
        name: "20L Spray Pump",
        sku: "BROOD-SPRAY-20L",
        wholesalePrice: 1800,
        retailPrice: 2000,
        inStock: true,
        stockQuantity: 25
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "cooler-box",
    name: "Cooler Box",
    category: "Brooding Equipment",
    description: "Insulated cooler box for transporting chicks and maintaining temperature.",
    imageUrl: placeholderImages["Brooding Equipment"],
    hasVariants: true,
    variants: [
      {
        id: "4.5l",
        name: "Cooler Box 4.5L",
        sku: "BROOD-COOL-4.5L",
        wholesalePrice: 2200,
        retailPrice: 2200,
        inStock: true,
        stockQuantity: 20
      }
    ],
    unit: "piece",
    minWholesaleQty: 10,
    isActive: true
  },

  // ==================== AUTOMATIC INCUBATORS ====================
  {
    id: "small-incubators",
    name: "Small Capacity Incubators",
    category: "Automatic Incubators",
    description: "Fully automatic egg incubators for small-scale hatching. Digital temperature and humidity control.",
    imageUrl: placeholderImages["Automatic Incubators"],
    hasVariants: true,
    variants: [
      {
        id: "64-eggs",
        name: "64 Eggs",
        sku: "INCUB-SML-64",
        wholesalePrice: 12000,
        retailPrice: 12500,
        inStock: true,
        stockQuantity: 15
      },
      {
        id: "128-eggs",
        name: "128 Eggs",
        sku: "INCUB-SML-128",
        wholesalePrice: 21000,
        retailPrice: 21500,
        inStock: true,
        stockQuantity: 12
      }
    ],
    unit: "unit",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "medium-incubators",
    name: "Medium Capacity Incubators",
    category: "Automatic Incubators",
    description: "Mid-range automatic incubators for growing operations. Reliable and efficient.",
    imageUrl: placeholderImages["Automatic Incubators"],
    hasVariants: true,
    variants: [
      {
        id: "204-eggs",
        name: "204 Eggs",
        sku: "INCUB-MED-204",
        wholesalePrice: 29500,
        retailPrice: 30000,
        inStock: true,
        stockQuantity: 8
      },
      {
        id: "256-eggs",
        name: "256 Eggs",
        sku: "INCUB-MED-256",
        wholesalePrice: 36000,
        retailPrice: 37000,
        inStock: true,
        stockQuantity: 10
      }
    ],
    unit: "unit",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "large-incubators",
    name: "Large Capacity Incubators",
    category: "Automatic Incubators",
    description: "Commercial-grade incubators for large-scale hatcheries. Advanced automation and monitoring.",
    imageUrl: placeholderImages["Automatic Incubators"],
    hasVariants: true,
    variants: [
      {
        id: "528-eggs",
        name: "528 Eggs",
        sku: "INCUB-LRG-528",
        wholesalePrice: 58000,
        retailPrice: 60000,
        inStock: true,
        stockQuantity: 5
      },
      {
        id: "1056-eggs",
        name: "1056 Eggs",
        sku: "INCUB-LRG-1056",
        wholesalePrice: 76500,
        retailPrice: 78000,
        inStock: true,
        stockQuantity: 3
      }
    ],
    unit: "unit",
    minWholesaleQty: 10,
    isActive: true
  },

  // ==================== CAGES & MESH ====================
  {
    id: "poultry-cages",
    name: "Poultry Cages",
    category: "Cages & Mesh",
    description: "Multi-tier layer cages for efficient space utilization. Complete with feeding and water systems.",
    imageUrl: placeholderImages["Cages & Mesh"],
    hasVariants: true,
    variants: [
      {
        id: "4-tier",
        name: "4 Tier Layer Cage",
        sku: "CAGE-4TIER",
        wholesalePrice: 40000,
        retailPrice: 40000,
        inStock: true,
        stockQuantity: 8
      }
    ],
    unit: "unit",
    minWholesaleQty: 10,
    isActive: true
  },
  {
    id: "plastic-mesh",
    name: "Plastic Mesh Roll",
    category: "Cages & Mesh",
    description: "Durable plastic mesh for constructing poultry houses, partitions, and flooring.",
    imageUrl: placeholderImages["Cages & Mesh"],
    hasVariants: true,
    variants: [
      {
        id: "standard",
        name: "Plastic Mesh Roll",
        sku: "MESH-PLST-STD",
        wholesalePrice: 8000,
        retailPrice: 8500,
        inStock: true,
        stockQuantity: 25
      }
    ],
    unit: "roll",
    minWholesaleQty: 10,
    isActive: true
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
    let totalVariants = 0;

    for (const product of products) {
      const productRef = doc(db, 'products', product.id);
      
      // Count variants
      totalVariants += product.variants.length;
      
      // Add timestamps
      const productData = {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      batch.set(productRef, productData);
      operationCount++;
      totalProducts++;
      
      // Log progress
      console.log(`   ✓ ${product.name} (${product.variants.length} variants)`);

      // Commit batch if we reach 500 operations (Firestore limit)
      if (operationCount === 500) {
        console.log(`\n📦 Committing batch ${batchCount}...`);
        await batch.commit();
        console.log(`✅ Batch ${batchCount} committed successfully\n`);
        
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
      console.log(`✅ Final batch committed successfully\n`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 SEEDING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`✅ Total products seeded: ${totalProducts}`);
    console.log(`✅ Total variants: ${totalVariants}`);
    console.log(`✅ Total batches committed: ${batchCount}`);
    
    console.log('\n📊 Products by category:');
    
    // Count products by category
    const categoryCounts = {};
    products.forEach(product => {
      categoryCounts[product.category] = (categoryCounts[product.category] || 0) + 1;
    });
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} products`);
    });
    
    console.log('\n✨ Next steps:');
    console.log('   1. View products in Firebase Console');
    console.log('   2. Test on /products page');
    console.log('   3. Update Firestore rules for production');
    console.log('   4. Manually assign admin role to first user\n');
    
    console.log('🔒 IMPORTANT: Update Firestore rules before going live!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding products:', error);
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