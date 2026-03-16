const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));
app.get('/', (_req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Mount API routes
app.use('/', apiRoutes);

// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
module.exports = app;
