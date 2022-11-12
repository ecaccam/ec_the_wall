import Express              from 'express';
import BodyParser           from 'body-parser';
import Passport             from 'passport';
import CookieParser         from 'cookie-parser';
import Session              from 'express-session';
import cors                 from 'cors';
import MemoryStore          from 'memorystore';
import TalentBookMiddleware    from './middleware/talentbook.middleware';
import TalentBookPassport      from './middleware/passport.middleware';
import Fs                   from 'fs';
import Path                 from 'path';

import { 
    BACKEND_URL, FRONTEND_URL, PORT, SESSION_SECRET,  SESSION_NAME, SERVER,
    PRODUCTION_ENVIRONMENTS 
} from "./config/constants/app.constants"; 

const memoryStore    = MemoryStore(Session);
const App            = Express();

/* Session Provider. Set secure and httpOnly to be true if production environments */
let session_setting = {
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        secure: PRODUCTION_ENVIRONMENTS.includes(process.env.NODE_ENV),
        httpOnly: PRODUCTION_ENVIRONMENTS.includes(process.env.NODE_ENV),
        domain: SERVER,
        maxAge: 36000000,
        expires: new Date(Date.now() + 1860 * 60 * 1000 * 24)
    }
}

/* If it's development, use redis, if not, use memory */
session_setting.store = new memoryStore({
    checkPeriod: 86400000 /* prune expired entries every 24h, before: 86400000 */
});

const ExpressSession = Session(session_setting);
/* End of  Session Proivder */

/* SET FRONTEND URL */
let frontend_url        = FRONTEND_URL.split("/");

/* remote trailing slash */
frontend_url.pop();
frontend_url = frontend_url.join("/");

App.use(cors({origin: frontend_url, credentials: true}));


/* Used for cross browsing request */
App.use(function(req, res, next) {
    /* DOCU: enables allow origin for the provided SERVER */

    // res.header("Access-Control-Allow-Origin", origin); 
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Origin, x-www-form-urlencoded, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Expose-Headers', 'Set-Cookie')
    next();
});


App.use(BodyParser.json({limit: '50mb'}));
App.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
App.use(CookieParser(SESSION_SECRET));
App.use(ExpressSession);

TalentBookPassport(Passport);

App.use(Passport.initialize());  
App.use(Passport.session());  

App.use(Express.static(`${__dirname}/../public`));
App.use(TalentBookMiddleware());

App.set("view engine", "ejs");
App.set('views', `${__dirname}/../views`);

/* VIEW ROUTES */
import ApiRoutes from './routes/api.routes';
ApiRoutes(App);

App.listen(PORT, () => {
    console.log(`${BACKEND_URL}`);
});
