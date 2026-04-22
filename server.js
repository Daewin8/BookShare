const express = require("express");
const bookRoutes = require("./routes/bookRoutes");

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});