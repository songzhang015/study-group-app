import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { User, Backend } from './backend';
import './login.css';

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [users, setUsers] = useState<string[]>([] as string[]);
    let nav = useNavigate();

    React.useEffect(() => {
        async function fetchUsers() {
            try{
                console.log("fetching users...");
                let userList = await Backend.FetchUsers();
                console.log(userList);
                setUsers(userList);
            }
            catch (e) {
                let err = e as Error;
                console.warn("Error", err.stack);
                console.warn("Error", err.name);
                console.warn("Error", err.message);
            }
        }

        fetchUsers();
    }, []);
    

    let Login = async function(){
        const user : User | null = await Backend.Login(username);
        if (user != null){
            nav('/home', {state: {user: user}});
        }
    }

    return (
        <div className="container">
            <div className="usernameInputContainer row">
                <label className="text" htmlFor="user-select" style={{ marginRight: "12px" }}>User:</label>
                <Options setSelected={setUsername} categories={users} />
            </div>
            <div className="loginButtonContainer">
                <button className="button" onClick={Login}>Login</button>
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
