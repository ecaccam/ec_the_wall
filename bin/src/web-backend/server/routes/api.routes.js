import UserRoutes       	from "./users.routes";
import CandidateRoute from "./candidates.routes";
import AdminRoute 	  from "./admins.routes";

let APIRoute = (App) => {
	/* Users */
	App.use(`/api/users`, UserRoutes);
	App.use(`/api/candidates`, CandidateRoute);
	
	/* Admins */
	App.use(`/api/admins`, AdminRoute);
}

module.exports = APIRoute;

