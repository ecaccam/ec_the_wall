const base64url  = require('base64-url');
const Yaml  = require('js-yaml');
const Fs  = require('fs');
var constant     = {};

try {
    /** Current page */
    constant.CURRENT_PAGE = {
        cand_information: 1,
        background: 2,
        more_about_you: 3,
        cand_profile: 4
    },
    constant.CANDIDATE_PROFILE_UPDATE_TYPE = {
        all: 1,
        user_information: 2,
        candidate_information: 3,
        education: 4,
        work_experience: 5,
        more_about_you: 6
    },
    constant.S3_UPLOAD_TYPES = {
        headshot: "headshot",
        resume: "resume",
    }
    constant.ADMIN_FILTER_SETTINGS = {
        sort_order : {
            0: "ORDER BY candidates.id DESC",
            1: "ORDER BY candidates.updated_at DESC",
            2: "ORDER BY first_name ASC",
            3: "ORDER BY first_name DESC"
        }
    }
} 
catch (e) {
    console.log('Error loading yml file', e);
    process.exit(1);
}

module.exports = constant;