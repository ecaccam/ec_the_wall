/**
 * Get the ENV values from react using "REACT_APP_" keyword
 * Note: File system such as FS package is not working in the browser because FS package is used for server like node.js which has file system
 * YAML file is not be able to read without using file system package which will parsed the yaml file
 * 
 * the format for env variable in react is "REACT_APP_", this kind of format of variable is needed to be able to read all the value inside the env file
 */

let ENV = {};

/* loop through all variable in env */
for(let values in process.env) {
    /* get only the variable that includes react_app_ */
    if(values.includes("REACT_APP_")) {
        let key = values.split("REACT_APP_").pop();
        ENV[key] = process.env[values];
    }
};

export const APIConstants = {
    URL: ENV.TB_BACKEND_URL,
    TB_FRONTEND_URL: ENV.TB_FRONTEND_URL
}; 


export const GENDER = [
    { "label": "Female", "value": 1 },
    { "label": "Male", "value": 2 },
    { "label": "Genderqueer or nonbinary", "value": 3 },
    { "label": "Prefer not to say",  "value": 4 },
    { "label": "Other", "value": 5 }
];

export const VACCINATION_STATUS = [
    { "label": "No, I am not vaccinated", "value": 0 },
    { "label": "Yes, I am fully vaccinated", "value": 1 },
    { "label": "I prefer not answer", "value": 2 }
];

export const YEARS_OF_WORK_EXPERIENCE = [
    {
        "label": "0-2 Years",
        "value": 1
    },
    {
        "label": "3-5 Years",
        "value": 2
    },
    {
        "label": "6-10 Years",
        "value": 3
    },
    {
        "label": "10+ Years",
        "value": 4
    }
];

export const YEARS_OF_WORK_EXPERIENCE_VALUE_DATA = {
    1: {years: "0-2 Years", label: "Entry Level"},
    2: {years: "3-5 Years", label: "Mid-Level"},
    3: {years: "6-10 Years", label: "Senior"},
    4: {years: "10+ Years", label: "Executive"},
};

export const CAND_EDUCATION_LEVEL_VALUE_DATA = {
    1: "Associates",
    2: "Bachelors Degree",
    3: "Graduate Degree",
    4: "Doctorate",
    5: "N/A"
};

export const CANDIDATE_PROFILE_PAGE = 4;

export const ONBOARDING_PAGE_ID = {
    "candidate_information": 1,
    "background": 2,
    "more_about_you": 3,
};

export const ONBOARDING_PAGE_FORM = {
    1: "candidate_information_form",
    2: "background_form",
    3: "more_about_you_form"
};

export const RADIO_ITEM_DATA = [
    {
        "label": "No",
        "value": 0
    },
    {
        "label": "Yes",
        "value": 1
    },
    {
        "label": "Maybe",
        "value": 2
    },
];

export const CANDIDATE_PROFILE_UPDATE_TYPE = {
    all: 1,
    user_information: 2,
    candidate_information: 3,
    education: 4,
    work_experience: 5,
    more_about_you: 6
};

export const CUSTOM_RADIO_ITEM_VALUE = { currently_enrolled: 2, prefer_not_to_say: 2 };

export const IS_CODING_DOJO_GRADUATE = {
    no: "0",
    yes: "1",
    currently_enrolled: "2"
};

export default Object.assign({}, 
    {APIConstants},
    {GENDER},
    {VACCINATION_STATUS},
    {YEARS_OF_WORK_EXPERIENCE},
    {YEARS_OF_WORK_EXPERIENCE_VALUE_DATA},
    {CANDIDATE_PROFILE_PAGE},
    {RADIO_ITEM_DATA},
    {CANDIDATE_PROFILE_UPDATE_TYPE},
    {CUSTOM_RADIO_ITEM_VALUE},
    {IS_CODING_DOJO_GRADUATE}
);