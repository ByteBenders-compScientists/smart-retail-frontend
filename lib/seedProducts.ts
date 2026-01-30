// scripts/seedProducts.ts
// Run this with: npx tsx seedProducts.ts
// Make sure to add your AUTH_TOKEN before running

import { createProduct } from '@/services/adminProductService';
import type { CreateProductRequest } from '@/types/product';

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njk4NDA0NDgsInJvbGUiOiJhZG1pbiIsInVzZXJfaWQiOiI1YzZlZDhhNC04Y2E2LTRiNzMtOGYyYS0yMTFiMzMxYmFjZDYifQ.LaL1TuXPU4m9a5zMt_2k_TgrSwbtW-jLIF1cBBJNJ00';

const products: CreateProductRequest[] = [
  // Coca-Cola Products
  {
    name: 'Coca-Cola Original 500ml',
    brand: 'Coke',
    description: 'Classic Coca-Cola refreshing taste in a 500ml bottle',
    price: 60,
    originalPrice: 70,
    image: 'https://postimg.cc/gLdYDSkf',
    rating: 4.8,
    reviews: 523,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Bestseller', 'Classic', 'Popular'],
  },
  {
    name: 'Coca-Cola Original 1L',
    brand: 'Coke',
    description: 'Classic Coca-Cola in a larger 1 liter bottle, perfect for sharing',
    price: 100,
    originalPrice: 120,
    image: 'https://res.cloudinary.com/dyc0ieeyu/image/upload/c_fit,f_auto,h_500,w_500/v1/products/coca-cola-1litre.jpg',
    rating: 4.8,
    reviews: 412,
    category: 'Carbonated Drinks',
    volume: '1L',
    unit: 'single',
    tags: ['Bestseller', 'Classic', 'Family Size'],
  },
  {
    name: 'Coca-Cola Zero 500ml',
    brand: 'Coke',
    description: 'Zero sugar, same great Coca-Cola taste',
    price: 65,
    originalPrice: 75,
    image: 'https://www.vintageliquorkenya.com/wp-content/uploads/2022/04/Coke-Zero-500ml-600x600-1.jpg',
    rating: 4.6,
    reviews: 287,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Zero Sugar', 'Diet', 'Sugar Free'],
  },
  {
    name: 'Diet Coke 500ml',
    brand: 'Coke',
    description: 'Light and refreshing diet cola with zero calories',
    price: 65,
    originalPrice: 75,
    image: 'https://postimg.cc/gX09kCJC',
    rating: 4.5,
    reviews: 198,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Diet', 'Zero Calories', 'Light'],
  },
  {
    name: 'Coca-Cola Vanilla 500ml',
    brand: 'Coke',
    description: 'Classic Coca-Cola with a smooth vanilla flavor',
    price: 70,
    originalPrice: 80,
    image: 'https://postimg.cc/WFyyptxX',
    rating: 4.7,
    reviews: 156,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Special Flavor', 'Limited Edition', 'Vanilla'],
  },
  {
    name: 'Coca-Cola Crate (24 x 300ml)',
    brand: 'Coke',
    description: 'Crate of 24 Coca-Cola glass bottles, perfect for events',
    price: 1200,
    originalPrice: 1400,
    image: 'https://postimg.cc/LhfDgy1r',
    rating: 4.9,
    reviews: 89,
    category: 'Carbonated Drinks',
    volume: '24 x 300ml',
    unit: 'crate',
    tags: ['Bestseller', 'Bulk', 'Events'],
  },

  // Fanta Products
  {
    name: 'Fanta Orange 500ml',
    brand: 'Fanta',
    description: 'Bright, bubbly, and instantly refreshing orange soda',
    price: 60,
    originalPrice: 70,
    image: 'https://postimg.cc/sGcZ9ZyM',
    rating: 4.7,
    reviews: 445,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Bestseller', 'Fruity', 'Orange'],
  },
  {
    name: 'Fanta Orange 1L',
    brand: 'Fanta',
    description: 'Larger bottle of refreshing orange Fanta',
    price: 100,
    originalPrice: 120,
    image: 'https://www.vintageliquorkenya.com/wp-content/uploads/2021/12/Fanta-Orange-1.25-Litre.jpg',
    rating: 4.7,
    reviews: 334,
    category: 'Carbonated Drinks',
    volume: '1L',
    unit: 'single',
    tags: ['Bestseller', 'Fruity', 'Family Size'],
  },
  {
    name: 'Fanta Grape 500ml',
    brand: 'Fanta',
    description: 'Deliciously fruity grape flavor soda',
    price: 65,
    originalPrice: 75,
    image: 'https://postimg.cc/fkBc96bj',
    rating: 4.6,
    reviews: 267,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Fruity', 'Grape', 'Popular'],
  },
  {
    name: 'Fanta Pineapple 500ml',
    brand: 'Fanta',
    description: 'Tropical pineapple burst in every sip',
    price: 65,
    originalPrice: 75,
    image: 'https://postimg.cc/xJ9mkRVT',
    rating: 4.8,
    reviews: 312,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Fruity', 'Tropical', 'Pineapple'],
  },
  {
    name: 'Fanta Passion 500ml',
    brand: 'Fanta',
    description: 'Exotic passion fruit flavor from the tropics',
    price: 65,
    originalPrice: 75,
    image: 'https://cdn.mafrservices.com/sys-master-root/h15/h17/17290167549982/24174_main.jpg',
    rating: 4.7,
    reviews: 289,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Fruity', 'Tropical', 'Passion Fruit'],
  },
  {
    name: 'Fanta Blackcurrant 500ml',
    brand: 'Fanta',
    description: 'Rich blackcurrant flavor with a sweet finish',
    price: 65,
    originalPrice: 75,
    image: 'https://cdn.mafrservices.com/sys-master-root/h6e/h9a/17290164043806/24171_main.jpg',
    rating: 4.5,
    reviews: 178,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Fruity', 'Blackcurrant', 'Special Flavor'],
  },
  {
    name: 'Fanta Orange Crate (24 x 300ml)',
    brand: 'Fanta',
    description: 'Crate of 24 Fanta Orange bottles for parties',
    price: 1200,
    originalPrice: 1400,
    image: 'https://www.shoprite.co.za/medias/10711290PK4-checkers515Wx515H?context=bWFzdGVyfGltYWdlc3wxODI3NTZ8aW1hZ2UvcG5nfGltYWdlcy9oMzIvaDc2LzEwMjA3ODI0NTQzNzc0LnBuZ3xiOWI3MWU3ZWRiOWI1NTY5ZThmZDAwYjkzZjAzZWY1YTczMTlkYmM5NDA0N2YxNWZmNTE2ZjFhNDhkZmY3ZDRm',
    rating: 4.8,
    reviews: 67,
    category: 'Carbonated Drinks',
    volume: '24 x 300ml',
    unit: 'crate',
    tags: ['Bulk', 'Events', 'Orange'],
  },

  // Sprite Products
  {
    name: 'Sprite Original 500ml',
    brand: 'Sprite',
    description: 'Crisp, clean lemon-lime taste that cuts through',
    price: 60,
    originalPrice: 70,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7D4ohEnD65Uqh-2YxXhk-7rtyORxEtLQOlw&s',
    rating: 4.7,
    reviews: 398,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Bestseller', 'Lemon-Lime', 'Refreshing'],
  },
  {
    name: 'Sprite Original 1L',
    brand: 'Sprite',
    description: 'Larger bottle of crisp, refreshing Sprite',
    price: 100,
    originalPrice: 120,
    image: 'https://www.vintageliquorkenya.com/wp-content/uploads/2021/12/Sprite-1.25-Litre.jpg',
    rating: 4.7,
    reviews: 321,
    category: 'Carbonated Drinks',
    volume: '1L',
    unit: 'single',
    tags: ['Bestseller', 'Family Size', 'Refreshing'],
  },
  {
    name: 'Sprite Zero 500ml',
    brand: 'Sprite',
    description: 'All the crisp Sprite taste with zero sugar',
    price: 65,
    originalPrice: 75,
    image: 'https://s3-eu-west-1.amazonaws.com/glencrest/i/pmi/sprite_zero.jpg?_t=2591153952',
    rating: 4.6,
    reviews: 245,
    category: 'Carbonated Drinks',
    volume: '500ml',
    unit: 'single',
    tags: ['Zero Sugar', 'Diet', 'Sugar Free'],
  },
  {
    name: 'Sprite Crate (24 x 300ml)',
    brand: 'Sprite',
    description: 'Crate of 24 Sprite bottles, great for gatherings',
    price: 1200,
    originalPrice: 1400,
    image: 'https://www.shoprite.co.za/medias/checkers515Wx515H-medias-10631548PK1-en-shopriteGlobalProductCatalog-picker-20241125114833.png?context=bWFzdGVyfGltYWdlc3wxODk5MjF8aW1hZ2UvcG5nfGltYWdlcy9oMzYvaGI2LzExNDQwNzEwODExNjc4LnBuZ3xjMzlmM2ViY2ZmNjlkZTgxMzA2OWVkYWUwYTRmMzg1NTk5OWFjZTg5ZjdiMWI4YmE4MTQ4MzA3NDM2ZWY2Nzc0',
    rating: 4.8,
    reviews: 72,
    category: 'Carbonated Drinks',
    volume: '24 x 300ml',
    unit: 'crate',
    tags: ['Bulk', 'Events', 'Refreshing'],
  },

  // Stoney
  {
    name: 'Stoney Tangawizi 300ml',
    brand: 'Stoney',
    description: 'Iconic ginger beer with a powerful kick',
    price: 50,
    originalPrice: 60,
    image: 'https://mybigorder.com/public/uploads/products/photos/fOQWH6MZUmknBS9bfprN9kv7ShDa8qeAX04KbdiK.jpeg',
    rating: 4.9,
    reviews: 612,
    category: 'Ginger Beer',
    volume: '300ml',
    unit: 'single',
    tags: ['Bestseller', 'Ginger', 'Local Favorite'],
  },
  {
    name: 'Stoney Tangawizi Crate (24 x 300ml)',
    brand: 'Stoney',
    description: 'Full crate of Kenya\'s favorite ginger beer',
    price: 1000,
    originalPrice: 1200,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTONtVpqAx_jQU3xmQcO32qTtOMzl9qZP3HSg&s',
    rating: 4.9,
    reviews: 145,
    category: 'Ginger Beer',
    volume: '24 x 300ml',
    unit: 'crate',
    tags: ['Bestseller', 'Bulk', 'Local Favorite'],
  },

  // Krest
  {
    name: 'Krest Bitter Lemon 300ml',
    brand: 'Krest',
    description: 'Refreshing bitter lemon tonic water',
    price: 55,
    originalPrice: 65,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7awjV4v25lJZlOu48c_Shtj9fnApW2BO0zA&s',
    rating: 4.5,
    reviews: 234,
    category: 'Tonic Water',
    volume: '300ml',
    unit: 'single',
    tags: ['Mixer', 'Tonic', 'Bitter Lemon'],
  },
  {
    name: 'Krest Tonic Water 300ml',
    brand: 'Krest',
    description: 'Classic tonic water, perfect for mixers',
    price: 55,
    originalPrice: 65,
    image: 'https://tuma250.com/wp-content/uploads/2021/07/Krest-Tonic.webp',
    rating: 4.4,
    reviews: 189,
    category: 'Tonic Water',
    volume: '300ml',
    unit: 'single',
    tags: ['Mixer', 'Tonic', 'Classic'],
  },

  // Schweppes
  {
    name: 'Schweppes Ginger Ale 300ml',
    brand: 'Schweppes',
    description: 'Premium ginger ale with a sophisticated taste',
    price: 70,
    originalPrice: 80,
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400',
    rating: 4.6,
    reviews: 167,
    category: 'Ginger Ale',
    volume: '300ml',
    unit: 'single',
    tags: ['Premium', 'Ginger Ale', 'Mixer'],
  },

  // Alvaro
  {
    name: 'Alvaro Pineapple 300ml',
    brand: 'Alvaro',
    description: 'Tropical pineapple soda with authentic fruit taste',
    price: 45,
    originalPrice: 55,
    image: 'https://thev.bar/wp-content/uploads/2023/09/imageedit_102_7275420327-800x800.png',
    rating: 4.5,
    reviews: 201,
    category: 'Fruit Soda',
    volume: '300ml',
    unit: 'single',
    tags: ['Local', 'Pineapple', 'Tropical'],
  },

  // Novida
  {
    name: 'Novida Orange 300ml',
    brand: 'Novida',
    description: 'Local favorite orange soda with real fruit flavor',
    price: 45,
    originalPrice: 55,
    image: 'https://afrovibesltd.com/cdn/shop/products/Untitleddesign_18_530x@2x.png?v=1619108817',
    rating: 4.6,
    reviews: 278,
    category: 'Fruit Soda',
    volume: '300ml',
    unit: 'single',
    tags: ['Local', 'Orange', 'Popular'],
  },
];

async function seedProducts() {
  console.log('🌱 Starting product seeding...\n');
  
  let successCount = 0;
  let errorCount = 0;

  for (const product of products) {
    try {
      await createProduct(product, AUTH_TOKEN);
      console.log(`✅ Created: ${product.name}`);
      successCount++;
      
      // Add small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`❌ Failed to create ${product.name}:`, error instanceof Error ? error.message : 'Unknown error');
      errorCount++;
    }
  }

  console.log('\n📊 Seeding Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${products.length}`);
}

// Run the seeding
seedProducts()
  .then(() => {
    console.log('\n✨ Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });