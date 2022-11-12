import { format as mysqlFormat }    from "mysql";
import Connections 					from "../../../config/database.js";

import { DATABASE_QUERY_SETTINGS } from "../../../config/constants/app.constants";

/* HACK: fix for babel issue with async functions */
import regeneratorRuntime from "regenerator-runtime";

/* setup / initialize database connections */
const DBConnections = new Connections(true);

/**
* @class DatabaseModel
* Handles the Database Queries. <br>
* Last Updated Date: March 8, 2022
*/
class DatabaseModel{
    /**
    * Default constructor.
    * Triggered: This is being called by all the models.<br>
    * Last Updated Date: March 8, 2022
    * @async
    * @function
    * @memberOf DatabaseModel
    * @author Noah
    */
	constructor(transaction_connection=null){
		this.DBConnection = DBConnections.talentbook;
		this.activeTransaction = transaction_connection;
	}

	/**
	* Set Active Transaction
    * Triggered by All models
    * Last updated at: March 9, 2022 
    * @param {DatabaseConnection} transaction_connection - transaction connection to be used
    * @author Noah
	*/
	setActiveTransaction = (transaction_connection) => {
		/* check if transaction_connection is defined before setting up the activeTransaction */
		if(transaction_connection){
			this.activeTransaction = transaction_connection;
		}
	}

	/**
    * DOCU: get specified data from the given object
    * Triggered: This is being called by all the models.<br>
    * Last Updated Date: June 7, 2022
    * @function
    * @memberOf DatabaseModel
    * @param {object} params_object - object parameter to be sanitized.<br>
    * @param {array=} required_params=[] - parameter to be selected only, default will get all the parameter from params_object.<br>
    * @param {array=} query_params=[] - existing query to be passed to the query.<br>
    * @param {array=} query_strings=[] - existing query strings to be passed to the query.<br>
    * @param {string=} query_connector="AND" - query condition/connector to be used.<br>
	* @returns {object} promise object, { status: false, result: {query_string, query_params}, error: null }.<br>
    * @author Noah
    */
	getQueryAndParams = (object_params, required_params = [], query_params = [], query_strings = [], query_connector = "AND", __strict = true) => {
		let response_data = { status: false, result: {}, error: null };

		try{
			if(object_params.constructor === Object){
				for(const [key, value] of Object.entries(object_params)){
					/*	check for selected columns only */ 
					if(!required_params.length || required_params.includes(key)){				
						/*	sanitized query parameter */ 
						if(value){				
							/*	check if value is an array to generate query param to IN clauses */ 
							if(value.constructor === Array){
								query_strings.push(`${key} IN (?)`);
								query_params.push(value);
							} 
							/*	check if value is an object custom for NOT IN to generate query param to NOT IN clauses */ 
							else if(value.constructor === Object && value.hasOwnProperty("not_in")){
								query_strings.push(`${key} NOT IN (?)`);
								query_params.push(value.not_in);
							}
							/*	check if value is an object custom for OR to generate query param to OR clauses */ 
							else if(value.constructor === Object && value.hasOwnProperty("or")){
								query_strings.push(`(${value.or.join(" OR ")})`);								
							}  
							/*	check if value is an object custom for raw queries */ 
							else if(value.constructor === Object && value.hasOwnProperty("raw")){
								query_strings.push(`${key} = ${value.raw}`);
							}  
							/*	default to generate normal query param */ 
							else {
								query_strings.push(`${key} = ?`);
								query_params.push(value);
							}
						}
					}
				}
			
				/* return true if there is an existing query strings */
				response_data.status  = (query_strings.length) ? true : false;

				if(query_strings.length){
					response_data.result.query_string = `${query_strings.join(` ${query_connector} `)}`;
					response_data.result.query_params = query_params;
				}
				else{
					response_data.error = "Parameters should generate a query string.";
				}
			}
			else{
				response_data.error = "Parameters should be an object, not array";
			}
		}
		catch(error){
			response_data.error = error;
		}

		/* returns empty data if not strict */
		if(!__strict && !response_data.status){
			response_data.status = true;
			response_data.result.query_string = "";
			response_data.result.query_params = [];
		}
		
		return response_data;
	}

	/**
    * DOCU: generate raw query based from the given paramets
    * Triggered: This is being called by all the models.<br>
    * Last Updated Date: March 22, 2022
    * @function
    * @memberOf DatabaseModel
    * @param {object} query_data - query data needed {connector, fields, table, query_type}. Param fields is optional.<br>
    * @param {object} params - object parameter to be sanitized.<br>
    * @param {array=} required_fields=[] - parameter to be selected only, default will get all the parameter from params_object.<br>
    * @param {array=} query_value_params=[] - existing query to be passed to the query.<br>
	* @returns {object} promise object, { status: false, result: {raw_query}, error: null }.<br>
    * @author Noah
    */
	generateRawQuery = (query_data, params, required_fields = [], query_value_params = []) => {
		let response_data = { status: false, result: {}, error: null };

		try{
			let { condition, connector, fields, table, query_type } = query_data;

			if(query_data && table && query_type && params){
				let query_data = this.getQueryAndParams(params, required_fields, query_value_params, [], connector);
		
				if(query_data.status){					
					let { query_string, query_params } = query_data.result;
					let raw_query = DATABASE_QUERY_SETTINGS.format[query_type].replace("<--table-->", table);

					if(DATABASE_QUERY_SETTINGS.type.selq === query_type){
						let selected_fields = fields === null ? `${table}.*` : fields;
						raw_query = raw_query.replace("<--fields-->", selected_fields);
					}
					else if([DATABASE_QUERY_SETTINGS.type.updq, DATABASE_QUERY_SETTINGS.type.insq].includes(query_type)){
						if(DATABASE_QUERY_SETTINGS.type.insq === query_type){
							query_string = `${query_string}, created_at = NOW(), updated_at = NOW()`;
						}
						else if(condition){
							/* check for where condition needed for update query */
							let condition_data = this.getQueryAndParams(condition, [], query_params);

							/* check if string and params were successfully generated */
							if(condition_data.status){
								let { query_string:cond_query_string, query_params:cond_query_params } = condition_data.result;
								query_params = cond_query_params;

								/* finalize update query */
								raw_query = `${raw_query} ${query_string}, updated_at = NOW() WHERE ${cond_query_string}`;
								query_string = "";
							}
							else{
								throw new Error(condition_data.error);
							}
						}
					}

					response_data.status = true;
					response_data.result.raw_query = mysqlFormat(`${raw_query} ${query_string};`, query_params);
				}
				else{
					response_data.error = query_data.error;
				}
			}
			else{
				response_data.error = "Parameters table, type and params are required.";
			}
		}
		catch(error){
			console.log(error);
			response_data.error = error;
		}
		
		return response_data;
	}

	/**
	* Establish connection and executes the given query
    * Triggered by All models
    * Last updated at: March 8, 2022 
    * @param String keyword - details where the query was called
    * @param String query - formatted query to be executed (make sure to use mysql.format
    * @param Object options {restrict_result, error_message, group_concat_max_length} 
	* 	restrict_result=false - default to false, Throw error if query returned empty result
	*	error_message='No Data'
	*   group_concat_max_length=0 - increase session if needed
	* @returns {object} promise object, returns result or error.<br>
    * @author Noah
	*/
	executeQuery = (keyword, query, restrict_result = false, error_message = "No Data", group_concat_max_length = false) => {
		let query_model = this;

		return new Promise( async (resolve, reject) => {
			let start_time = new Date().getTime();
			let is_transaction = (query_model.activeTransaction) ? true : false;

			/* Get new connection if activeTransaction is not defined */
			let query_connection = await query_model.getAvailableConnection();
					
			/* run query statement */
			let execute_response_data = await query_model.runQueryStatement(query_connection, {start_time, keyword, query, options: {restrict_result, error_message, group_concat_max_length}}, is_transaction);

			/* resolve promise if query was successfully executed */
			if(execute_response_data.status){
				resolve(execute_response_data.result);
			}
			else{
				reject(execute_response_data.error);
			}
		});
	}

	/**
	* Run the given query with specific connection
    * Triggered by executeQuery
    * Last updated at: March 9, 2022 
    * @param {DatabaseConnection} connection - active connection to be used to execute the query
    * @param {object} {start_time, keyword, query, options} - requires keyword and query
    * @param {boolean=} is_transaction=false determines if connection is a transaction or not
    * @author Noah
	*/
	runQueryStatement =  (connection, {start_time, keyword, query, options}, is_transaction = false) => {
		let query_model = this;

		return new Promise(async (resolve, reject) => {
			let execute_start_time = start_time || new Date().getTime();

			/* run set session for group max length if provided */
			if(options.group_concat_max_length > 0){		
				await connection.query(mysqlFormat(`SET SESSION group_concat_max_len = ?;`, [options.group_concat_max_length]));
			}

			connection.query(query, function (error, result) {
				let response_data = { status: false, result: null, error: false }; 
				let total_duration = ((new Date().getTime()) - execute_start_time) / 1000;

				/* release connection if connection is not a transaction connection */
				if(!is_transaction){
					connection.release();   
				}

				/*	track mysql errors */ 
				if(error !== null || (options.restrict_result == true && result.length == 0)) {
					if(options.restrict_result == true && result.length == 0){
						response_data.error = new Error(options.error_message);
						resolve(response_data);
					}
					else{
						/* track database error */
						query_model.trackDatabaseError(`ErrorQueryException: ${keyword}`, total_duration, query);

						response_data.error = error;
						resolve(response_data);
					}
				}
				else{
					/*	track slow queries based from the computed total duration */ 
					if(total_duration > 1){
						/* track database error */
						query_model.trackDatabaseError(`SlowQueryException: ${keyword}`, total_duration, query);
					}

					response_data.status = true;
					response_data.result = result;

					resolve(response_data);
				}
			});   
		});
	}

	/**
	* Get the available pool connection
    * Triggered when query is being executed
    * Last updated at: March 22, 2022 
	* @returns {DatabaseConnection} returns available connection.<br>
    * @author Noah
	*/
	getAvailableConnection =  () => {
		let query_model = this;

		return new Promise(async (resolve, reject) => {
			if(!query_model.activeTransaction){
				query_model.DBConnection.getConnection(async function(err, connection) {
					if (err) {
						reject(err);
					}
					else{
						resolve(connection);
					}
				});
			}
			else{
				resolve(query_model.activeTransaction);
			}
		});
	}

	/**
	* Start Transaction - start transaction when there are 2 or more insert/update queries run on a single request
    * Triggered by executeQuery
    * Last updated at: March 9, 2022 
    * @param {string} keyword - keyword to be passed on logging
	* @returns {PromiseObject} promise object, pass connection when successfully started
    * @author Noah
	*/
	startTransaction = (keyword) => {
		let query_model = this;
		query_model.transaction_keyword = keyword;
		query_model.transaction_start_time = new Date().getTime();

		return new Promise((resolve, reject) => {
			/* DOCU: start transaction */			
			query_model.DBConnection.getConnection(async function(err, connection) {
				if (err) {
					reject(err);
				}
			    else{
					connection.beginTransaction(async (err) => {
						if(err){
							await query_model.cancelTransaction(err, connection);
							reject(err);
						}
						else{
							resolve(connection);
						}
					});
				}
			});
		});
	}

	/**
	* Cancel Transaction - usually happens if a certain query was not successfully executed 
    * Triggered by models
    * Last updated at: March 18, 2022 
	* @returns {PromiseObject} promise object, rollback the transaction
    * @author Noah updated by Christian
	*/
	cancelTransaction = (error, connection, message = null) => {
		let query_model = this;

		return new Promise((resolve, reject) => {
			connection.rollback(function() {		
				/* track database error */
				query_model.trackDatabaseError(`TransactionErrorException: ${error}`, (((new Date().getTime()) - query_model.transaction_start_time) / 1000));

				query_model.activeTransaction = null;
				query_model.transaction_keyword = null;
				query_model.transaction_start_time = null;

				connection.release();       
				resolve({status: false, result: {}, error, message});
			});
		});
	}

	/**
	* Commit Transaction - commit transaction when all queries was successfully executed
    * Triggered by models
    * Last updated at: March 9, 2022 
	* @returns {PromiseObject} promise object, commit the transaction
    * @author Noah
	*/
	commitTransaction = (connection) => {	
		let query_model = this;

		return new Promise((resolve, reject) => {
			connection.commit(async function(transaction_err) {
				if (transaction_err) {
					/*  DOCU: rollbacks transaction when commit was not successful */
					await query_model.cancelTransaction(transaction_err, connection);
					reject(transaction_err);
				}
				else{
					query_model.activeTransaction = null;
					query_model.transaction_keyword = null;
					query_model.transaction_start_time = null;

					connection.release();          
					resolve(true);
				}
			});
		});
    }

	/**
	* DOCU: Track Error when there is failure in executing of query 
    * Triggered by database model
    * @param {string} error - error encountered by the database
    * @param {integer} total_duration - elapsed time / duration after executing the query
    * @param {string} executed_query - executed query
    * Last updated at: August 24, 2022 
	* @returns {PromiseObject} promise object, commit the transaction
    * @author Erick
	*/
	trackDatabaseError = (error, total_duration, executed_query="") => {
		console.log("Executed Query: ",executed_query);
		console.log("\n Error: ", error);
	}
}

export default DatabaseModel;