import { supabase, isSupabaseConfigured } from '../config/supabase.js';

async function testSupabaseDatabase() {
  console.log('🧪 Testing Supabase Database Connection & Tables...\n');

  if (!isSupabaseConfigured || !supabase) {
    console.error('❌ Supabase is not configured. Check SUPABASE_URL and SUPABASE_ANON_KEY in .env');
    process.exit(1);
  }

  let hasErrors = false;

  // 1. Test user_profiles Table
  console.log('1️⃣ Checking table: "user_profiles"...');
  try {
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
    if (error) {
      console.warn(`  ⚠️ Table "user_profiles" error: ${error.message} (Code: ${error.code})`);
      hasErrors = true;
    } else {
      console.log('  ✅ Table "user_profiles" exists and is queryable.');
    }
  } catch (err) {
    console.error('  ❌ "user_profiles" query failed:', err.message);
    hasErrors = true;
  }

  // 2. Test orders Table
  console.log('\n2️⃣ Checking table: "orders"...');
  try {
    const { data, error } = await supabase.from('orders').select('id').limit(1);
    if (error) {
      console.warn(`  ⚠️ Table "orders" error: ${error.message} (Code: ${error.code})`);
      hasErrors = true;
    } else {
      console.log('  ✅ Table "orders" exists and is queryable.');
    }
  } catch (err) {
    console.error('  ❌ "orders" query failed:', err.message);
    hasErrors = true;
  }

  // 3. Test order_items Table
  console.log('\n3️⃣ Checking table: "order_items"...');
  try {
    const { data, error } = await supabase.from('order_items').select('id').limit(1);
    if (error) {
      console.warn(`  ⚠️ Table "order_items" error: ${error.message} (Code: ${error.code})`);
      hasErrors = true;
    } else {
      console.log('  ✅ Table "order_items" exists and is queryable.');
    }
  } catch (err) {
    console.error('  ❌ "order_items" query failed:', err.message);
    hasErrors = true;
  }

  console.log('\n====================================================');
  if (hasErrors) {
    console.log('⚠️ Some tables may not exist yet in Supabase.');
    console.log('👉 Please run the SQL schema in your Supabase SQL Editor:');
    console.log('   File location: supabase/schema.sql');
  } else {
    console.log('🎉 All Supabase tables are active and connected successfully!');
  }
  console.log('====================================================\n');
}

testSupabaseDatabase();
