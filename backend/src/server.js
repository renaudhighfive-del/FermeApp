import app from "./app.js";
import { connectDbApi } from "./db/connect.js";

const PORT = process.env.PORT || 8000;  
await connectDbApi();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});