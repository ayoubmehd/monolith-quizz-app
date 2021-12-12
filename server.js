const app = require("./app");
require('dotenv').config();

const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`App is runing on http://localhost:${port}`);
});