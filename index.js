require("dotenv").config();
const express = require("express");
const webhookRouter = require("./routes/webhookRout");
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.use("/webhook", webhookRouter);
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB error:", err));