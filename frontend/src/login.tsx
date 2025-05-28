import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { api } from './backend';
import './login.css';

export default function Login() {
    const [user, setUser] = useState<string>("");
    const [users, setUsers] = useState<string[]>([] as string[]);
    let nav = useNavigate();

    React.useEffect(() => {
        async function fetchUsers() {
            try{
                console.log("fetching users...");
                const fullResponse = await fetch(api + '/users');
                const responseJson = await fullResponse.json();
                let userDataArray = responseJson as {username: string}[];
                let userList = [] as string[];
                for(let i=0;i<responseJson.length;i++){
                    userList.push(userDataArray[i].username as string);
                }
                console.log(responseJson)
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
    

    let goHome = function(){
        nav('/home', {state: { username: user} });
    }

    return (
        <div className="container">
            <div className="usernameInputContainer row">
                <label className="text" htmlFor="user-select" style={{ marginRight: "12px" }}>User:</label>
                <Options setSelected={setUser} categories={users} />
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
