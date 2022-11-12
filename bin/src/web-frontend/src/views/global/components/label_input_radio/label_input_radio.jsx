/* REACT */
import React, { useState, useEffect } from 'react';

/* CSS */
import "./label_input_radio.scss"

function LabelInputRadio({ name, on_change, custom_data, is_update }) {
    is_update = (typeof is_update === "number") ? is_update.toString() : is_update;
    const [is_fetch_is_update, setIsUpdateData] = useState(null);

    useEffect(() => {
        setIsUpdateData(is_update);
    }, [is_fetch_is_update, is_update]);

    return (
        <div className="label_block">
            <label>
                <input type="radio" name={ name } value="1" defaultChecked={ (is_fetch_is_update && is_fetch_is_update === "1") } onChange={ (event) => on_change(name, event) } />
                <span className="radio_marker"></span>
                <span>Yes</span>
            </label>
            <label>
                <input type="radio" name={ name } value="0" defaultChecked={ (is_fetch_is_update && is_fetch_is_update === "0") }  onChange={ (event) => on_change(name, event) } />
                <span className="radio_marker"></span>
                <span>No</span>
            </label>
            { custom_data !== "no_maybe_option" &&
                <label>
                    <input type="radio" name={ name } value="2" defaultChecked={ (is_fetch_is_update && is_fetch_is_update === "2") } onChange={ (event) => on_change(name, event) } />
                    <span className="radio_marker"></span>
                    <span>{ custom_data ? custom_data : "Maybe" }</span>
                </label>
            }
        </div>
    );
}

export default LabelInputRadio;