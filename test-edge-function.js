import { createClient } from '@supabase/supabase-js';

// Real Supabase configuration
const supabaseUrl = 'https://ojlfhkrobyqmifqbgcyw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbGZoa3JvYnlxbWlmcWJnY3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNTQ2NzksImV4cCI6MjA1MTgzMDY3OX0.nLBdYJBsN6vy_cjEJkD98iFGxMJMLB9wVnxwwL8UhqY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testEdgeFunction() {
  try {
    console.log('Testing edge function...');
    
    const { data, error } = await supabase.functions.invoke('generate-insights', {
      body: {
        metrics: [
          { name: 'Digital Adoption', value: 75, target: 80 },
          { name: 'Process Efficiency', value: 82, target: 85 },
          { name: 'Employee Satisfaction', value: 68, target: 75 }
        ]
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      return false;
    }

    console.log('✅ Edge function response:', data);
    return true;
  } catch (error) {
    console.error('❌ Edge function test failed:', error.message);
    return false;
  }
}

async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('test')
      .select('*')
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is OK
      console.error('Connection error:', error);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('=== Edge Function & Supabase Test ===\n');
  
  const connectionTest = await testSupabaseConnection();
  const edgeFunctionTest = await testEdgeFunction();
  
  console.log('\n=== Test Summary ===');
  console.log('Supabase Connection:', connectionTest ? '✅ Working' : '❌ Failed');
  console.log('Edge Function:', edgeFunctionTest ? '✅ Working' : '❌ Failed');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testEdgeFunction, testSupabaseConnection };
