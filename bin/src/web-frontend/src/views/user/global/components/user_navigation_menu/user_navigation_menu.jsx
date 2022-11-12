import React from 'react';
import { useSelector } from 'react-redux';

function UserNavigationMenu(props) {
    const { candidate_profile_data } = useSelector(state => state.candidate_profile);

    return (
        <div>
            <nav>
                <a href="#" className="cd_logo"><img src="https://cutecdn.codingdojo.com/images/global/coding-dojo-white-logo.svg" alt="coding-dojo-logo" /></a>
                <a href="#" className="talent_book_logo"><img src="https://cutecdn.codingdojo.com/new_design_image/talent_book/talent_book_white_logo.svg" alt="coding-dojo-talent-book" /></a>

                <ul>
                    <li className="user_profile_details">
                        <a href="#">
                            <img src={(candidate_profile_data.candidate_information?.headshot_file) || `https://cutecdn.codingdojo.com/new_design_image/talent_book/user_profile.png`} alt="user_profile_image" />

                            <div className="user_details">
                                <span>{candidate_profile_data.first_name} {candidate_profile_data.last_name}</span>
                                <span>Candidate</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default UserNavigationMenu;