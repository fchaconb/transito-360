import React from 'react';
import '../Styles/Login.css'; 

function AuthFormContainer({ title, children }) {
    return (
        <div className="login-background">
            <div className="login-container">
                <div className="profile-image">
                    <i className="fas fa-user"></i>
                </div>
                <div className="login-header">
                    <h2>{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
}

export default AuthFormContainer;
