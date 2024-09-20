import { app } from "../src/app.js";
import { ConnectToDB, DisconnectDB } from "../src/db/databaseConnection.js";
const PORT = process.env.PORT || 8080;
(async () => {
  try {
    await ConnectToDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} 👋`);
    });
  } catch (error) {
    await DisconnectDB();
    console.error('Detailed error:', error);
    if (error instanceof Error) {
      console.error('Error stack:', error.stack);
    }
    process.exit(1);
  }
})();
