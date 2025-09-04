require("dotenv").config();
const express = require("express");
const connetionRouter = require("./routes/routes")
const webhookRouter = require('./routes/webhookRout')
const app = express();
const PORT = 3000;
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected")
    app.use("/" , connetionRouter)
    app.use("/webhook",webhookRouter)
  app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

  })
  .catch((err) => console.error("MongoDB error:", err));



