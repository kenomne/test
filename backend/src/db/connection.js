const mysql = require('mysql2/promise');

// Kreiranje connection pool za bolje performanse
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'crowbarDB',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

// Test konekcije
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL uspešno povezan!');
    
    // Test query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Test query prošao:', rows[0]);
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ MySQL konekcija neuspešna:', error.message);
    return false;
  }
};

// Helper funkcija za izvršavanje query-ja
const executeQuery = async (query, params = []) => {
  try {
    const [rows, fields] = await pool.execute(query, params);
    return { success: true, data: rows, fields };
  } catch (error) {
    console.error('Database Query Error:', error);
    return { success: false, error: error.message };
  }
};

// Helper funkcija za transakcije
const executeTransaction = async (queries) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [rows] = await connection.execute(query, params || []);
      results.push(rows);
    }
    
    await connection.commit();
    connection.release();
    
    return { success: true, data: results };
  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error('Transaction Error:', error);
    return { success: false, error: error.message };
  }
};

// Kreiranje tabela ako ne postoje
const initializeDatabase = async () => {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Čitanje schema.sql fajla
    const schemaPath = path.join(__dirname, '../../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Podela schema na pojedinačne CREATE TABLE statements
    const statements = schema
      .split(';')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.trim() + ';');
    
    console.log('🔄 Inicijalizujem bazu podataka...');
    
    for (const statement of statements) {
      if (statement.trim().startsWith('CREATE TABLE') || statement.trim().startsWith('CREATE DATABASE')) {
        const result = await executeQuery(statement);
        if (!result.success) {
          console.error('❌ Greška pri kreiranju tabele:', result.error);
        }
      }
    }
    
    console.log('✅ Baza podataka inicijalizovana!');
    return true;
  } catch (error) {
    console.error('❌ Greška pri inicijalizaciji baze:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  executeQuery,
  executeTransaction,
  initializeDatabase
};