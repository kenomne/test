const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root_pass',
      database: 'crowbarDB'
    });

    console.log('✅ Connected to database');

    // Check if users table exists and has data
    const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Total users in database: ${users[0].count}`);

    // Get all users
    const [allUsers] = await connection.execute('SELECT id, username, email, is_active FROM users LIMIT 10');
    console.log('👥 Users in database:');
    allUsers.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}, Email: ${user.email}, Active: ${user.is_active}`);
    });

    // Test the problematic query
    console.log('\n🔍 Testing problematic query...');
    const [result] = await connection.execute(
      'SELECT id, username, email, avatar, rating, games_played, games_won, games_lost, created_at FROM users WHERE is_active = TRUE ORDER BY rating DESC LIMIT ? OFFSET ?',
      [10, 0]
    );
    console.log(`✅ Query successful, returned ${result.length} users`);

    await connection.end();
  } catch (error) {
    console.error('❌ Database error:', error);
  }
}

testDatabase();