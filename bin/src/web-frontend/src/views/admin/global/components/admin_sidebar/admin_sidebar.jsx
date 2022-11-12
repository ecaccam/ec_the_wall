import React from 'react';
import { Link } from 'react-router-dom';

function AdminSideBar({ active }) {
    return (
        <div className="sidebar">
            <ul>
                <li><span className="sidebar_icon dashboard_icon"></span> <Link to="#">Dashboard</Link></li>
                <li className={ (active === "candidate_information") ? "active" : "" }><span className="sidebar_icon candidate_management_icon"></span> <Link to="/candidate-management">Candidate Management</Link></li>
                <li><span className="sidebar_icon company_management_icon"></span> <Link to="#">Company Management</Link></li>
                <li><span className="sidebar_icon job_requisitions_icon"></span> <Link to="#">Job Requisitions</Link></li>
                <li><span className="sidebar_icon resume_books_icon"></span> <Link to="#">Résumé Books</Link></li>
                <li><span className="sidebar_icon logout_icon"></span> <Link to="/sign-out">Log Out</Link></li>
            </ul>
        </div>
    );
}

export default AdminSideBar;