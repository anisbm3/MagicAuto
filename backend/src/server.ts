import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();

app
  .listen(env.PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${env.PORT} is in use, trying to close it...`);
    } else {
      console.error("SERVER ERROR:", err);
    }
  });
