let SharedConstants = {};

 /** User levels */
 SharedConstants.USER_LEVELS = {
    candidate: 1,
    company_user: 2,
    admin: 9
 }

/** Used for is_active, is_archived table field */
SharedConstants.BOOLEAN_FIELD = {
    yes_value: 1,
    no_value: 0,
    active_value: 1,
    inactive_value: 0,
    zero_value: 0
}

/* US Country ID */
SharedConstants.US_COUNTRY_ID = 239;

/* US State IDs */
SharedConstants.US_STATES = {
    "AK": 2,
    "AL": 1,
    "AR": 4,
    "AZ": 3,
    "CA": 5,
    "CO": 6,
    "CT": 7,
    "DC": 9,
    "DE": 8,
    "FL": 10,
    "GA": 11,
    "HI": 12,
    "IA": 16,
    "ID": 13,
    "IL": 14,
    "IN": 15,
    "KS": 17,
    "KY": 18,
    "LA": 19,
    "MA": 22,
    "MD": 21,
    "ME": 20,
    "MI": 23,
    "MN": 24,
    "MO": 26,
    "MS": 25,
    "MT": 27,
    "NC": 34,
    "ND": 35,
    "NE": 28,
    "NH": 30,
    "NJ": 31,
    "NM": 32,
    "NV": 29,
    "NY": 33,
    "OH": 36,
    "OK": 37,
    "OR": 38,
    "PA": 39,
    "RI": 40,
    "SC": 41,
    "SD": 42,
    "TN": 43,
    "TX": 44,
    "UT": 45,
    "VA": 47,
    "VT": 46,
    "WA": 48,
    "WI": 50,
    "WV": 49,
    "WY": 51
}

SharedConstants.CONTACT_TYPE = { csm_manager: 1 }

SharedConstants.YEARS_OF_WORK_EXPERIENCE_VALUE_DATA = {
    1: {years: "0-2 Years", label: "Entry Level"},
    2: {years: "3-5 Years", label: "Mid-Level"},
    3: {years: "6-10 Years", label: "Senior"},
    4: {years: "10+ Years", label: "Executive"},
}

module.exports = SharedConstants;
    