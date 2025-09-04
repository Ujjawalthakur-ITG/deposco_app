require("dotenv").config();
const express = require("express");
const connetionRouter = require("./routes/routes");
const webhookRouter = require("./routes/webhookRout");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");

// ✅ Add body parsers
app.use(express.json()); // JSON ke liye
app.use(express.urlencoded({ extended: true })); // Form-data ke liye

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.use("/", connetionRouter);
    app.use("/webhook", webhookRouter);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB error:", err));
