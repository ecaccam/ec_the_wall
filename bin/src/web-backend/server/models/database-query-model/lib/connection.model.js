import { createPool, createConnection } from "mysql";
import { DATABASE } from "../../../config/constants/app.constants";

/** 
* @class DatabaseHandler
* Handles the Database Connection. <br>
* Last Updated Date: July 26, 2022
*/
class DatabaseHandler {
    /**
    * Default constructor.
    * Triggered: This is being called by the learn.middleware, catching errors from try/catch.<br>
    * Last Updated Date: July 26, 2022
    * @async
    * @function
    * @memberOf DatabaseHandler
    * @param {boolean} is_mysql_pool=true - Connect to a mysql pool connection.<br>
    * @author Noah
    */
    constructor(is_mysql_pool = true) {
        this.database = "Main Database";

        /*  variables related to database connection */ 
		this.is_connected       = false;
		this.DatabaseConnection = false;
        this.retryCount         = 0;
        this.connect_started_at = new Date().getTime();

        if(is_mysql_pool){
            this.createPoolConnection();
        }
    }

    /**
    * DOCU: Function to get the database config
    * Triggered: This is being called by createPoolConnection, and createDatabaseConnection.<br>
    * Last Updated Date: July 26, 2022
    * @async
    * @function
    * @memberOf DatabaseHandler
    * @return {database_config} - returns database config from constants
    * @author Noah
    */
    getDatabaseConfig = () => {
        return DATABASE;
    }

    /**
    * DOCU: Function to Create / initiate database pool connection
    * Triggered: This is being called by the constructor.<br>
    * Last Updated Date: July 26, 2022
    * @async
    * @function
    * @memberOf DatabaseHandler
    * @author Noah
    */
    createPoolConnection = () => {
        let database = this.getDatabaseConfig();
        this.DatabaseConnection = createPool(Object.assign({connectionLimit: 653 }, database));
    }
}

export default DatabaseHandler;