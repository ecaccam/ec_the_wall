/* REACT */
import React, { useEffect, useState } from 'react';

/* VENDOR */
import Select from 'react-dropdown-select';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux/es/exports";

/* COMPONENT */
import CandidateProfile from '../../../../global/components/candidate_profile/candidate_profile';
import AdvancedCandidateModal from '../../modals/advanced_filters/advanced_filters.modal';

/* CONSTANTS */
import {YEARS_OF_WORK_EXPERIENCE_VALUE_DATA} from '../../../../../__config/constants';

/* JSON */
import dropdownData from "../../../../global/candidate_data.json";

/* CSS */
import "./candidate_list.scss";

import { AdminActions } from '../../../../../__action/admin.action';

/* FONT AWESOME ICON USED */
library.add(faEllipsisV);




function CandidateList(props){
    const { sort_type, page_list_filter } = dropdownData;
    const { candidate_list_data } = useSelector(state => state.candidate_list);

    const sortCandidate = (sort_selected_item) => {
        dispatch(AdminActions.searchCandidates({ search_keyword: search_keyword, sort_order: sort_selected_item[0].value }));
        setSortOrder(sort_selected_item[0].value);
    }

    const dispatch = useDispatch();
    const [update_active_page, setActivePage] = useState(1);
    const [update_page_list, setPageList] = useState([page_list_filter[0]]);
    const [is_show_candidate_profile, showCandidateProfile] = useState(false);
    const [active_candidate_profile_data, setActiveCandidateProfileData] = useState(null);
    const [fetch_candidate_list, fetchCandidateList] = useState(candidate_list_data);
    const [set_show_modal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const [search_keyword, setSearchKeyword] = useState('');
    const [sort_order, setSortOrder] = useState(sort_type[0].value);

    /* PAGINATION */
    const page_list = [];
    const candidate_list_count_data = candidate_list_data.length;
    const total_pages = Math.floor(candidate_list_count_data / update_page_list[0].label) + ((candidate_list_count_data % update_page_list[0].label !== 0 ) ? 1 : 0 );

    if(candidate_list_count_data > update_page_list[0].label){
        for( let page = 1; page <= total_pages; page++){
            page_list.push(page);
        }
    }

    const updateActivePAge = (event, page_item) => {
        event.preventDefault();
        setActivePage(page_item);
    }

    const updatePageListFilter = (page_list_filter) => {
        setPageList(page_list_filter);
        setActivePage(1);
    }

    const prevNextPageList = (event, prev_next_data) => {
        ((prev_next_data === "prev_data" && update_active_page !== 1) || (prev_next_data === "next_data" && update_active_page !== total_pages))
            && setActivePage((prev_next_data === "next_data")
            ? update_active_page + 1 : update_active_page - 1);
    }

    const setActiveSelectedCandidateProfileData = (event, selected_profile_data) => {
        showCandidateProfile(true);
        setActiveCandidateProfileData(selected_profile_data);
        document.body.click();
    }

    const customContentRender = (placeholder, dropdown_option) => {
        return(
            <React.Fragment>
                <button className="sort_btn">Sort</button>
            </React.Fragment>
        )
    }

    const searchCandidateItem = (event) => {
        /* TODO: To be move in constants */
        const MINIMUM_TEXT_CHAR_LENGTH = 4;

        if(["Enter", "NumpadEnter"].includes(event.code) && event.target.value.length >= MINIMUM_TEXT_CHAR_LENGTH){
            dispatch(AdminActions.searchCandidates({ is_export: false, sort_order, search_keyword: event.target.value }));
        }

        setSearchKeyword( (event.target.value.length >= MINIMUM_TEXT_CHAR_LENGTH) ? event.target.value : "");
    }

    const showAdvancedFilterModal = () => {
        setShowModal(true)
    }

    /**
    * DOCU: This will handle the on load fetching of candidates list <br>
    * Triggered: on load <br>
    * Last Updated Date: August 16, 2022
    * @param {object} query_type - To get the uploaded headshot file raw data.
    * @author Ruelito
    */
    useEffect(() => { dispatch(AdminActions.searchCandidates({ is_export: false, sort_order: 0, search_keyword: "" })); }, [] );

    const submitExportCandidateList = () => {
        dispatch(AdminActions.exportCandidateList({ is_export: true, sort_order, search_keyword })); 
    }

    return (
        <div id="candidate_list_wrapper">
            <div className={ (is_show_candidate_profile) ? "is_show_candidate_profile hidden" : "is_show_candidate_profile" }>
                <div className="title_block">
                    <h1>Candidate Management</h1>
                    <button type="button" className="export_btn" onClick={ submitExportCandidateList }>EXPORT TO .XLS</button>
                </div>

                <div className="header_block">
                    <input type="text" name="search_candidate" className="search_candidate" onKeyUp={ (event) => searchCandidateItem(event) } placeholder="Search" />

                    <Select
                        className={ "sort_candidate" }
                        options={ sort_type }
                        name={ "sort_candidate" }
                        onChange={ sortCandidate }
                        values={ [sort_type[0]] }
                        contentRenderer={ customContentRender }
                        placeholder={ "Sort" }
                    />

                    <button type="button" className="advance_filter_btn hidden" onClick={ showAdvancedFilterModal }>Advanced Filters</button>
                </div>

                <ul id="candidate_list_data_wrapper">
                    { candidate_list_data &&
                        candidate_list_data.map(candidate_item => {
                            return (
                                <li key={ candidate_item.id }>
                                    <div className="candidate_details_block">
                                        <img src={ candidate_item.profile_picture_url } alt={ candidate_item.full_name + " User Profile Image" } />

                                        <div className="details">
                                            <span className="name">{ candidate_item.full_name }</span>
                                            <span className="location">{ candidate_item.cand_location }</span>
                                        </div>
                                    </div>

                                    <div className="position_block details">
                                        <span className="job_title">{ /* TODO: Display data here once Specialty is added in forms and DB. */ }</span>
                                        <span className="experience level">{ (candidate_item.experience_level) ? YEARS_OF_WORK_EXPERIENCE_VALUE_DATA[candidate_item.experience_level].label : "" }</span>
                                    </div>

                                    <div className="candidate_status_block details">
                                        <span className="status">{(candidate_item.is_active) ? 'Active' : 'Inactive'}</span>
                                        <span className="last_modified">Last modified {candidate_item.last_modified_at}</span>
                                    </div>

                                    <div className="action_btn">
                                        <OverlayTrigger trigger="click" placement="top" rootClose
                                            overlay={
                                                <Popover className="view_candidate_popover">
                                                    <div className="action_btn">
                                                        <button className="view_candidate_btn" onClick={ (event) => setActiveSelectedCandidateProfileData(event, candidate_item) }>View Candidate</button>
                                                    </div>
                                                </Popover>
                                            }>
                                            <button><FontAwesomeIcon icon="ellipsis-vertical" /></button>
                                        </OverlayTrigger>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>

                <div id="candidate_pagination" className="hidden">
                    { page_list &&
                        <React.Fragment>
                            <div className="page_item_filter_block">
                                <span>1 to</span>
                                <Select
                                    className={ "page_list_filter" }
                                    options={ page_list_filter }
                                    name={ "page_list_filter" }
                                    onChange={ updatePageListFilter }
                                    values={ update_page_list }
                                    placeholder={ "Page List Filter" }
                                    dropdownPosition="top"
                                />
                                <span>{ candidate_list_count_data } candidates</span>
                            </div>
                            { candidate_list_count_data > update_page_list[0].label &&
                                <div className="page_list_block">
                                    <button className={ (update_active_page !== 1) ? "prev_btn" : "prev_btn disabled" } onClick={ (event) => prevNextPageList(event, "prev_data") }>Previous</button>
                                    <ul id="candidate_list_pagination_page" active_page={ update_active_page } className="">
                                        {
                                            page_list.map((page_item) => {
                                                return (
                                                    <li key={ page_item } className={(page_item === update_active_page) ? "active" : ""} data-page={ page_item }>
                                                        <button type="button" onClick={ (event) => updateActivePAge(event, page_item) }>{ page_item }</button>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                    <button className={ (update_active_page !== total_pages) ? "next_btn" : "next_btn disabled" } onClick={ (event) => prevNextPageList(event, "next_data") }>Next</button>
                                </div>
                            }
                        </React.Fragment>
                    }
                </div>
            </div>
            
            { is_show_candidate_profile &&
                <CandidateProfile selected_candidate_profile_data={ active_candidate_profile_data }></CandidateProfile>
            }

            <AdvancedCandidateModal set_show={ set_show_modal } set_hide={ handleClose }></AdvancedCandidateModal>
        </div>
    );
}

export default CandidateList;