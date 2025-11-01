require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  // Home Decor Category
  {
    name: 'Handcrafted Pottery',
    description: 'Beautiful handmade pottery from rural artisans. Each piece is unique and crafted with traditional techniques passed down through generations.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1565193298357-c5b64a816c38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Home Decor',
    countInStock: 15
  },
  {
    name: 'Brass Decor Items',
    description: 'Traditional brass items for home decoration. These pieces showcase the rich heritage of Indian metalwork and craftsmanship.',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Home Decor',
    countInStock: 8
  },
  {
    name: 'Embroidered Cushion Cover',
    description: 'Hand-embroidered cushion covers with traditional designs. Each piece is carefully crafted by skilled artisans.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2532&q=80',
    category: 'Home Decor',
    countInStock: 12
  },
  {
    name: 'Wooden Spice Box',
    description: 'Traditional wooden spice box with multiple compartments. Perfect for organizing your kitchen spices in style.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Home Decor',
    countInStock: 18
  },
  {
    name: 'Handwoven Wall Hanging',
    description: 'Intricate wall hanging made with traditional weaving techniques. Adds a touch of Indian culture to any room.',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Home Decor',
    countInStock: 6
  },
  {
    name: 'Terracotta Planters',
    description: 'Eco-friendly terracotta planters perfect for indoor and outdoor plants. Made from natural clay.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Home Decor',
    countInStock: 25
  },

  // Food Category
  {
    name: 'Organic Tea Collection',
    description: 'Premium organic tea sourced from the hills of Darjeeling. This collection includes a variety of flavors and aromas that will delight your senses.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Food',
    countInStock: 25
  },
  {
    name: 'Spice Collection Set',
    description: 'Premium collection of Indian spices including turmeric, cumin, coriander, and garam masala. Perfect for authentic Indian cooking.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Food',
    countInStock: 30
  },
  {
    name: 'Organic Honey',
    description: 'Pure organic honey collected from wildflowers. Rich in flavor and natural goodness.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Food',
    countInStock: 20
  },
  {
    name: 'Traditional Pickles',
    description: 'Homemade pickles made with traditional recipes. Available in mango, lime, and mixed vegetable varieties.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Food',
    countInStock: 40
  },
  {
    name: 'Basmati Rice',
    description: 'Premium long-grain basmati rice from the foothills of the Himalayas. Known for its aromatic fragrance.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Food',
    countInStock: 50
  },

  // Fashion Category
  {
    name: 'Handwoven Scarf',
    description: 'Elegant handwoven scarf made from sustainable materials. These scarves are crafted by skilled artisans using traditional looms and techniques.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2680&q=80',
    category: 'Fashion',
    countInStock: 10
  },
  {
    name: 'Cotton Kurti',
    description: 'Comfortable cotton kurti with traditional embroidery. Perfect for casual wear and special occasions.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Fashion',
    countInStock: 14
  },
  {
    name: 'Silk Saree',
    description: 'Elegant silk saree with intricate zari work. Perfect for weddings and special occasions.',
    price: 8999,
    image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Fashion',
    countInStock: 5
  },
  {
    name: 'Handcrafted Jewelry Set',
    description: 'Beautiful jewelry set made with traditional techniques. Includes earrings, necklace, and bangles.',
    price: 2499,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Fashion',
    countInStock: 8
  },
  {
    name: 'Leather Sandals',
    description: 'Comfortable leather sandals handcrafted by skilled artisans. Perfect for everyday wear.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Fashion',
    countInStock: 20
  },

  // Beauty Category
  {
    name: 'Handmade Soap Set',
    description: 'Natural handmade soaps with essential oils. These soaps are made using traditional methods and natural ingredients.',
    price: 499,
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    category: 'Beauty',
    countInStock: 20
  },
  {
    name: 'Ayurvedic Face Cream',
    description: 'Natural face cream made with Ayurvedic herbs. Nourishes and protects your skin naturally.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Beauty',
    countInStock: 15
  },
  {
    name: 'Hair Oil with Herbs',
    description: 'Traditional hair oil infused with natural herbs. Promotes healthy hair growth and reduces hair fall.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Beauty',
    countInStock: 25
  },
  {
    name: 'Clay Face Mask',
    description: 'Natural clay face mask that deep cleanses and purifies your skin. Made with multani mitti.',
    price: 299,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Beauty',
    countInStock: 30
  },

  // Art & Craft Category
  {
    name: 'Handmade Paper Products',
    description: 'Eco-friendly handmade paper products including notebooks, greeting cards, and gift boxes.',
    price: 199,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Art & Craft',
    countInStock: 50
  },
  {
    name: 'Bamboo Craft Items',
    description: 'Beautiful bamboo craft items including baskets, coasters, and decorative pieces.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Art & Craft',
    countInStock: 35
  },
  {
    name: 'Hand-painted Ceramics',
    description: 'Beautiful hand-painted ceramic items including mugs, plates, and bowls with traditional motifs.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Art & Craft',
    countInStock: 20
  },

  // Wellness Category
  {
    name: 'Aromatherapy Candles',
    description: 'Hand-poured aromatherapy candles with natural essential oils. Perfect for relaxation and meditation.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    category: 'Wellness',
    countInStock: 25
  },
  {
    name: 'Meditation Cushion',
    description: 'Comfortable meditation cushion filled with natural buckwheat hulls. Perfect for yoga and meditation practice.',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1607006344380-b6775a0824ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
    category: 'Wellness',
    countInStock: 12
  },
  {
    name: 'Herbal Tea Blends',
    description: 'Special herbal tea blends for wellness including chamomile, lavender, and tulsi varieties.',
    price: 399,
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    category: 'Wellness',
    countInStock: 30
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cherish-india', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} sample products`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seed function
seedDatabase();
