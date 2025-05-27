import React, { useState } from "react";
import './login.css';
import { useNavigate } from "react-router";

export default function Login() {
    const [user, setUser] = useState("");
    const defaultUsers = ["User 1", "User 2", "User 3"];
    let nav = useNavigate();

    let goHome = function(){
        nav('/home');
    }

    return (
        <div className="container">
            <div className="usernameInputContainer row">
                <label className="text" htmlFor="user-select" style={{ marginRight: "12px" }}>User:</label>
                <Options setSelected={setUser} categories={defaultUsers} />
            </div>
            <div className="loginButtonContainer">
                <button className="button" onClick={goHome}>Login</button>
            </div>
        </div>
    );
}

function Options({ setSelected, categories } : {
    setSelected : React.Dispatch<React.SetStateAction<string>>,
    categories : string[]
}) {
    return (
        <select id="user-select" onChange={e => setSelected(e.target.value)} defaultValue="">
            <option value="" disabled>Select a user</option>
            {categories.map(category => (
                <option key={category} value={category}>
                    {category}
                </option>
            ))}
        </select>
    );
}
