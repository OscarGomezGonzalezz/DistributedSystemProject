// Import the mysql2 package
const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'mysql-service',     //When we directly deploy the mysql container with docker, we are host(localhost),
                             //but when we deploy it with docker-compose, mysql-container takes the rol of host
  user: 'node',   
  database: 'database1', 
  password: '1234',
  waitForConnections: true
  //port:3306
});

// Export the pool for use in other parts of the application
module.exports = pool.promise();