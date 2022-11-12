import { safeLoad }      from "js-yaml";
import { readFileSync }  from "fs";
import * as path from "path";

let AppConstants   = {};

try {
    /*
    	if the environment is development, load the configuration files as specified in development_env.json
    	this file is set to be automatically .gitignored
    	if you dont have this file, copy development_env.example.yml and adjust the setting based on your local configuration settings
    */
   let env_file = `${process.env.NODE_ENV || "development"}.env.yml`;

   /* 
       DOCU: now load the env_file
        env_file should have all the sensitive information
        information stored in development_env should not be the same as what's stored in staging or production
   */

   let fileContents = readFileSync(path.join(__dirname, `../${env_file}`), 'utf8');
   let data         = safeLoad(fileContents); 

    for(let key in data){
        AppConstants[key] = data[key];
    }

    /* Used for MySQL profiler */
    AppConstants.IS_ENABLED_FETCHAPI    = false;
    AppConstants.IS_ENABLED_PROFILER    = true;
    AppConstants.IS_TRACK_QUERIES       = true;
    AppConstants.IS_RESET_TRACKING      = false;

    AppConstants.LOCAL_ENV               = "development";
    AppConstants.STAGING_ENVIRONMENTS    = "staging";
    AppConstants.PRODUCTION_ENVIRONMENTS = "production";

    /* Used for MySQL query parsing / formatting */
    AppConstants.DATABASE_QUERY_SETTINGS = {
        connectors: {
            and_conn: "AND",
            or_conn: "OR",
            ins_upd_conn: ","
        },
        type: {
            selq: "select",
            delq: "delete",
            insq: "insert",
            updq: "update"
        },
        format: {
            select: "SELECT <--fields--> FROM <--table--> WHERE",
            delete: "DELETE FROM <--table--> WHERE",
            insert: "INSERT INTO <--table--> SET",
            update: "UPDATE <--table--> SET"
        }
    };
}
catch (e) {
    console.log(`AppConstants: Error loading constants.`, e);
    process.exit(1);
}

module.exports = AppConstants;
    