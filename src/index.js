const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', apiRoutes);

app.listen(PORT, () => {
    console.log(`Martin's challenge is running on http://localhost:${PORT}`);
});
