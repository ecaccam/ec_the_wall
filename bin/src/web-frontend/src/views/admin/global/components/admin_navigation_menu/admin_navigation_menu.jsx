import React from 'react';
import { useSelector } from 'react-redux';

function AdminNavigationMenu(props) {
    const { user_data } = useSelector(state => state.users);

    return (
        <div>
            <nav>
                <a href="#" className="cd_logo"><img src="https://cutecdn.codingdojo.com/images/global/coding-dojo-white-logo.svg" alt="coding-dojo-logo" /></a>

                <ul>
                    <li className="user_profile_details">
                        <a href="#">
                            <img src={ (user_data.headshot_file) || `https://cutecdn.codingdojo.com/new_design_image/talent_book/user_profile.png` } alt="user_profile_image" />

                            <div className="user_details">
                                <span>{user_data.first_name} {user_data.last_name}</span>
                                <span>Admin</span>
                            </div>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default AdminNavigationMenu;