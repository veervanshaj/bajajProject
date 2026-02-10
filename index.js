require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/', apiRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
