import React, {useState} from 'react';
import Select from "react-dropdown-select";
import "./react_search_dropdown.scss";

function ReactSearchDropdown({ placeholder, fetch_data, fetch_data_list, on_change_select, errors, class_name, is_multiple, is_label, get_coding_dojo_program }) {
    const customClearRender = ({ methods }) =>{
        return(
            <React.Fragment>
                { (fetch_data && fetch_data.length > 0) && <span className="clear_icon" onClick={() => methods.clearAll()}></span>}
            </React.Fragment>
        )
    }

    const [fetch_dropdown_list, updateDropdownList] = useState(fetch_data_list);


    const onChangeSearchDropdown = (event, methods) => {
        methods.setSearch(event);

        if(get_coding_dojo_program.length > 0){
            let new_program_skills_data = fetch_dropdown_list.filter(program_skill_item => {
                return program_skill_item.program_id === get_coding_dojo_program[0].value;
            });
    
            /* This will customize the search feature for search dropdown. */
            if(is_label){
                let dropdown_data_result = new_program_skills_data.map(category_type => {
                    return {
                        ...category_type,
                        technologies: category_type.technologies.filter(dropdown => dropdown.label.toLowerCase().includes(event.target.value))
                    }
                });
    
                fetch_data_list = dropdown_data_result.filter(dropdown => dropdown.technologies.length > 0);
            }
        }
        else{
            /* This will customize the search feature for search dropdown. */
            if(is_label){
                let dropdown_data_result = fetch_dropdown_list.map(category_type => {
                    return {
                        ...category_type,
                        technologies: category_type.technologies.filter(dropdown => dropdown.label.toLowerCase().includes(event.target.value))
                    }
                });
    
                fetch_data_list = dropdown_data_result.filter(dropdown => dropdown.technologies.length > 0);
            }
        }
    }

    const customDropdownRender = ({ state, methods }) => {
        return (
            <div className="dropdown_container">
                <div className="dropdown_search_block">
                    <input type="text" value={ state.search } onChange={ (event) => onChangeSearchDropdown(event, methods)  } placeholder="Search..."/>
                </div>
                { (!is_label)
                    ?   <ul className="dropdown_menu">
                            {
                                state.searchResults.length > 0 
                                    ?   state.searchResults.map((result_item) =>
                                            <li
                                                key={ result_item.value + " " + result_item.label }
                                                className={ (!is_multiple && fetch_data.length > 0 && fetch_data[0].label === result_item.label) ? "item_result active" : "item_result" }
                                                onClick={ () => methods.addItem(result_item) }>
                                                { is_multiple &&
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            checked={ fetch_data.length > 0 && fetch_data.filter(selected => selected.label === result_item.label).length > 0 }
                                                            name="selected_item"
                                                            onChange={ () => methods.addItem(result_item) }
                                                            className="selected_item" />
                                                        <span className="checkbox_style"></span>
                                                    </label>
                                                }
                                                <span>{ result_item.label }</span>
                                            </li>       
                                        )
                                    :   <li className="no_result item_result">No results found.</li>
                            }
                        </ul>
                    :   <ul className="dropdown_menu">
                            {
                                fetch_data_list.map(item => {
                                    return (
                                        <li key={ item.category }>
                                            <span className={ "category_label" }>{ item.name }</span>
                                            <ul className="dropdown_menu">
                                                {
                                                    item.technologies.length > 0 
                                                        ?   item.technologies.map((result_item) =>
                                                                <li
                                                                    key={ result_item.value + " " + result_item.label }
                                                                    className={ (!is_multiple && fetch_data && fetch_data[0].label === result_item.label) ? "item_result active" : "item_result" }
                                                                    onClick={ () => methods.addItem(result_item) }>
                                                                    { is_multiple &&
                                                                        <label>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={ fetch_data && fetch_data.filter(selected => selected.label === result_item.label).length > 0 }
                                                                                name="selected_item"
                                                                                onChange={ () => methods.addItem(result_item) }
                                                                                className="selected_item" />
                                                                            <span className="checkbox_style"></span>
                                                                        </label>
                                                                    }
                                                                    <span>{ result_item.label }</span>
                                                                </li>       
                                                            )
                                                        :   <li className="no_result item_result">No results found.</li>
                                                }
                                            </ul>
                                        </li>
                                    )
                                })
                            }

                            { (fetch_data_list.length === 0) && <li className="no_result item_result">No results found.</li> }
                        </ul>
                }
            </div>
        );
    };

    const customContentRender = (placeholder, dropdown_option) => {
        return(
            <React.Fragment>
                {
                    (dropdown_option.length > 0)
                        ? <span>{ dropdown_option[0].label }</span>
                        : <span className="select_placeholder">{ placeholder }</span>
                }

                { (is_multiple && dropdown_option.length > 1) && <span className="multi_select_counter">+ { dropdown_option.length -1 }</span> }
            </React.Fragment>
        )
    }

    return (
        <div>
            <Select
                className={ (!fetch_data && errors.fetch_data_list) ? `${ class_name } input_error` : class_name }
                options={ fetch_data_list }
                name={ class_name }
                onChange={ on_change_select }
                values={ fetch_data ? fetch_data : [] }
                multi={ (is_multiple) ? true : false }
                placeholder={ placeholder }
                clearable={ (is_multiple) ? true : false }
                clearRenderer={ customClearRender }
                contentRenderer={ () => customContentRender(placeholder, fetch_data) }
                dropdownRenderer={ customDropdownRender }
            />
        </div>
    );
}

export default ReactSearchDropdown;