const app = require("./src/app");

const port = process.env.SERVER_PORT || 8899;

app.listen(port, async () => {
   console.log(`App listening on http://localhost:${port}`);
});

process.on("SIGINT", () => {
   console.log("Server is shutting down.");
   server.close(() => {
      console.log("Server is shut down.");
   });
});
