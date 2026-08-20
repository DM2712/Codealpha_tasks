import { productService } from '../services/productService.js';

async function runProductTests() {
  console.log('🧪 Starting ShopSphere Product API Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    // Test 1: Fetch Catalog & Pagination
    console.log('1️⃣ Testing Catalog Retrieval & Normalization:');
    const catalogRes = await productService.getProducts({ limit: 5, skip: 0 });
    assert(catalogRes && Array.isArray(catalogRes.products), 'Catalog returns products array');
    assert(catalogRes.products.length > 0, `Returned ${catalogRes.products.length} products`);
    assert(catalogRes.total > 0, `Total products reported: ${catalogRes.total}`);

    const firstProduct = catalogRes.products[0];
    assert(firstProduct && firstProduct.id, 'Product has valid string ID', `ID: ${firstProduct?.id}`);
    assert(firstProduct.title && typeof firstProduct.title === 'string', 'Product has normalized title/name', `Title: ${firstProduct?.title}`);
    assert(typeof firstProduct.price === 'number' && firstProduct.price > 0, 'Product has numerical price in dollars', `Price: $${firstProduct?.price}`);
    assert(firstProduct.thumbnail && typeof firstProduct.thumbnail === 'string', 'Product has valid thumbnail image URL', `Thumb: ${firstProduct?.thumbnail}`);
    assert(typeof firstProduct.rating === 'number', 'Product has numerical rating', `Rating: ${firstProduct?.rating}`);
    console.log(`   Sample Product: [ID: ${firstProduct.id}] "${firstProduct.title}" - $${firstProduct.price} (${firstProduct.category})\n`);

    // Test 2: Fetch Categories
    console.log('2️⃣ Testing Category Derivation:');
    const categories = await productService.getCategories();
    assert(Array.isArray(categories) && categories.length > 0, `Derived ${categories.length} unique categories`);
    const sampleCategory = categories[0];
    assert(sampleCategory && sampleCategory.slug && sampleCategory.name, 'Category has slug and display name', JSON.stringify(sampleCategory));
    console.log(`   Sample Categories: ${categories.slice(0, 4).map(c => c.name).join(', ')}...\n`);

    // Test 3: Category Filtering
    console.log('3️⃣ Testing Category Filter:');
    const filteredRes = await productService.getProducts({ category: sampleCategory.slug, limit: 10 });
    assert(filteredRes && Array.isArray(filteredRes.products), `Filtered by category "${sampleCategory.slug}"`);
    assert(filteredRes.products.length > 0, `Found ${filteredRes.products.length} items in "${sampleCategory.name}"`);
    console.log();

    // Test 4: Search Filter
    console.log('4️⃣ Testing Search Query Filter:');
    const searchTerm = firstProduct.title.split(' ')[0] || 'Kit';
    const searchRes = await productService.getProducts({ search: searchTerm, limit: 10 });
    assert(searchRes && Array.isArray(searchRes.products), `Search for "${searchTerm}" executed`);
    assert(searchRes.products.length > 0, `Found ${searchRes.products.length} matching products`);
    console.log();

    // Test 5: Single Product Lookup by ID
    console.log('5️⃣ Testing Single Product Details Lookup:');
    const singleProduct = await productService.getProductById(firstProduct.id);
    assert(singleProduct && String(singleProduct.id) === String(firstProduct.id), `Successfully retrieved product #${firstProduct.id}`);
    assert(singleProduct.title === firstProduct.title, 'Retrieved product title matches');
    assert(Array.isArray(singleProduct.images), 'Retrieved product has images gallery array');
    console.log();

    // Test 6: Price Sorting
    console.log('6️⃣ Testing Price Sorting (Low to High vs High to Low):');
    const ascRes = await productService.getProducts({ sortBy: 'price', order: 'asc', limit: 3 });
    const descRes = await productService.getProducts({ sortBy: 'price', order: 'desc', limit: 3 });
    const isAscValid = ascRes.products[0].price <= ascRes.products[1].price;
    const isDescValid = descRes.products[0].price >= descRes.products[1].price;
    assert(isAscValid, 'Price Low-to-High sort order valid');
    assert(isDescValid, 'Price High-to-Low sort order valid');
    console.log();

  } catch (error) {
    console.error('💥 Test suite crashed with error:', error);
    failed++;
  }

  console.log('====================================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('====================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runProductTests();
