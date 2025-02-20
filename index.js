import server from "./server.js";

import {PORT} from "./server/utils/contants.js";

server.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`)
})