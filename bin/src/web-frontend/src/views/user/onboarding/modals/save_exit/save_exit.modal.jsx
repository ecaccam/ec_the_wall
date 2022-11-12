import React from "react";
import { Modal, Button } from "react-bootstrap";
import "./save_exit.modal.scss";

function SaveExitModal({ set_show, set_hide, onboarding_page_form }) {
    return (
        <React.Fragment>
            <Modal className="save_exit_modal" show={ set_show } onHide={ () => set_hide(false) }>
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <h3>Save and exit</h3>
                    <p>In order to be featured in TalentBook, you must provide completed profile information. To complete your profile, please log back into your profile page.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="cancel_btn" onClick={ () => set_hide(false) }>CANCEL</Button>
                    <Button className="exit_btn" onClick={ () => set_hide(true) } type="submit" form={ onboarding_page_form }>EXIT</Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}

export default SaveExitModal;