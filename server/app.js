const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

app.use("/api/post", postRoutes);
app.use("/api/upload", uploadRoutes);
