const app = require("./src/app");
require("dotenv").config();

const port = process.env.SERVER_PORT || 3000;
const host = process.env.SERVER_HOST || "vanphudev.id.vn";

app.listen(port, async () => {
   console.log(`App listening on http://localhost:${port}`);
});
