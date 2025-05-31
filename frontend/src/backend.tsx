
const api = "http://localhost:5000";

export type User = {
    name : string,
    id : string
};

export namespace Backend {
    export function GetApi() : string{
        return api;
    }
    export async function FetchUsers() : Promise<string[]> {
        const fullResponse = await fetch(GetApi() + '/users');
        const responseJson = await fullResponse.json();
        let userDataArray = responseJson as {username: string}[];
        let userList = [] as string[];
        for(let i=0;i<responseJson.length;i++){
            userList.push(userDataArray[i].username as string);
        }
        return userList;
    }
    export async function Login(username: string) : Promise<User | null> {
        try{
            const response = await fetch(GetApi() + '/login', {
                method: "POST",
                body: JSON.stringify({
                    user_selection: username
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            const responseJson = await response.json();
            const responseUser = responseJson as {message: string, user_id: string};
            const user = {name: username, id: responseUser.user_id} as User;
            return user;
        }
        catch (e){
            const err = e as Error;
            console.error(err.message);
            console.error(err.stack);
            return null;
        }
    }
}