// import server from "./server.js";

import {PORT} from "./server/utils/contants.js";
import {mongoose} from "./server/db/mongoDb/index.js";

(await import("dotenv")).configDotenv();

mongoose.mongooseConnect();

(await import('./server.js')).default.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})