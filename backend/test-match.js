const { executeQuery } = require('./src/db/connection');

async function testMatchQuery() {
  console.log('=== Testing match query ===');
  
  // Test osnovni query bez LIMIT/OFFSET
  console.log('\n1. Testing simple count query:');
  const countResult = await executeQuery('SELECT COUNT(*) as count FROM match_history');
  console.log('Count result:', countResult);
  
  // Test query sa hard-coded LIMIT
  console.log('\n2. Testing hard-coded LIMIT query:');
  const hardCodedResult = await executeQuery('SELECT * FROM match_history LIMIT 3');
  console.log('Hard-coded LIMIT result:', hardCodedResult);
  
  // Test query sa parametrima
  console.log('\n3. Testing parameterized LIMIT query:');
  const limit = 3;
  const offset = 0;
  console.log('Parameters:', { limit, offset, limitType: typeof limit, offsetType: typeof offset });
  
  const paramResult = await executeQuery(
    'SELECT * FROM match_history ORDER BY match_date DESC LIMIT ? OFFSET ?', 
    [limit, offset]
  );
  console.log('Parameterized result:', paramResult);
  
  process.exit(0);
}

testMatchQuery().catch(console.error);