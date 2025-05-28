const app = require('./app');
const { seedDatabase } = require('./utils/seeder');

const PORT = process.env.PORT || 3000;

// Seed the database when starting the server
seedDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});