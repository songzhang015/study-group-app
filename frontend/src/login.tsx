import React, { useState, useEffect } from "react";
import './login.css';
import { useNavigate } from "react-router";

export default function Login() {
    const [user, setUser] : [string, React.Dispatch<React.SetStateAction<string>>] = useState("");
    const defaultUsers = ["user1", "user2", "user3"];
    let nav = useNavigate()

    let goHome = function(){
        nav('/home');
    }

    return (
    <div className="container">
        <div className="usernameInputContainer">
        <Options setSelected={setUser} categories={defaultUsers}/>
        </div>

        <div className="loginButtonContainer">
            <div className="text">user: {user}</div>
            <button className="button" onClick={goHome}>Login</button>
        </div>
    </div>
    );
}

//TODO: create some kind of dropdown menu for this
function Options({ setSelected, categories } : {
    setSelected : React.Dispatch<React.SetStateAction<string>>,
    categories : string[]
}){
    return (
        //for each category, make a button that sets the selected one to that category
        //and just display the categories
        <menu>
            {categories.map(category => (
                <button key={category} onClick={() => setSelected(category)}>
                    {category}
                </button>
            ))}            
        </menu>
    )
}
