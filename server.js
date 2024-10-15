const app = require("./src/app");
require("dotenv").config();

const port = process.env.SERVER_PORT || 443;
const host = process.env.SERVER_HOST || "cdn-cv.vanphudev.id.vn";

app.listen(port, async () => {
   console.log(`App listening on http://localhost:${port}`);
});
