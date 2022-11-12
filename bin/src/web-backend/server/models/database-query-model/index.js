import DatabaseModel  from "./lib/database.model";

/*
	DOCU: DatabaseModel Module
    initializing database model and profiler model
    - database model: responsible for querying raw mysql queries
    - profiler model: responsible for tracking queries
*/

export default function DatabaseQueryModel(){
    return new DatabaseModel();
}