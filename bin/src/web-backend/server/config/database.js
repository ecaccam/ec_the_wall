import DatabaseHandler from "../models/database-query-model/lib/connection.model.js";

class Connections {
    constructor(is_pool_connection = false) {
        this.talentbook      = new DatabaseHandler(is_pool_connection).DatabaseConnection;
    }

    disconnectAll = () => {
        let connections = this;

        return new Promise((resolve, reject) => {
            connections.learnv3.end(() => {
                resolve(talentbook);
            });
        });
    }
}


export default Connections