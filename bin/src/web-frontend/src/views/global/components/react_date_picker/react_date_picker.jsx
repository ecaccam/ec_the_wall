import React from 'react';
import DatePicker from "react-datepicker";

/* CSS */
import "react-datepicker/dist/react-datepicker.css";
import "./react_date_picker.scss";

function ReactDatePicker(props) {
    const { on_change, start_date, errors } = props;

    return (
        <div className="date_picker">
            <DatePicker
                className={ (!start_date && errors) ? "set_available_start_date input_error" : "set_available_start_date" }
                selected={ start_date }
                onChange={ on_change }
                placeholderText="MM/DD/YY" />
            { (!start_date && errors) && <span className="message_error">This field is required</span> }
        </div>
    );
}

export default ReactDatePicker;