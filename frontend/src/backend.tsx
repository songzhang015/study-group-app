
const api = "http://localhost:5000";

export type User = {
    id : string,
    name : string
};

export type StudyGroup = {
    id : string,
    subject : string,
    member_count : number,
    max_member_count : number
    location: {latitude: number, longitude: number}
}

//some functions for internal use

async function post(url: string) : Promise<Response> {
    return fetch(url, {method: "POST"});
}

async function del(url: string) : Promise<Response> {
    return fetch(url, {method: "DELETE"});
}

async function post_json(url: string, content: any) : Promise<Response> {
    return fetch(url, {
        method: "POST",
        body: JSON.stringify(content),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
}

type BackendUser = {
    message: string, 
    user_id: string
}

type BackendGroupCreation = {
    _id: string,
    name: string,
    description: string,
    max_members: number,
    location: number[]
}

type BackendGroupSummary = {
    _id: string,
    name: string,
    current_members_count: number,
    max_members: number,
    location: number[]
}

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
            const response = await post_json(GetApi() + '/login', {
                user_selection: username
            });
            const responseJson = await response.json();
            const responseUser = responseJson as BackendUser;
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

    export async function FetchGroups() : Promise<StudyGroup[] | null> {
        try{
            const response = await fetch(GetApi() + '/study-groups');
            const responseJson = await response.json();
            const responseArray = responseJson as object[];
            let groups = [] as StudyGroup[];
            for(let i = 0; i < responseArray.length; i++){
                let responseGroup = responseArray[i] as BackendGroupSummary;
                let group = {
                    id: responseGroup._id,
                    subject: responseGroup.name,
                    member_count: responseGroup.current_members_count,
                    max_member_count: responseGroup.max_members,
                    location: {
                        latitude: responseGroup.location[0],
                        longitude: responseGroup.location[1]
                    }
                } as StudyGroup;
                groups.push(group);
            }
            return groups;
        }
        catch (e){
            const err = e as Error;
            console.error(err.message);
            console.error(err.stack);
            return null;
        }
    }

    export async function CreateGroup(user:User, subject:string, max_members:number, latitude: number, longitude:number) : Promise<string | null> {
        let url:string = GetApi() + '/study-groups'
        let newGroup = {
            _id: user.id,
            name: subject,
            description: "",
            max_members: max_members,
            location: [latitude, longitude]
        } as BackendGroupCreation
        
        let result = await post_json(url, newGroup);
        let resultJson = await result.json();
        if (result.status == 201){
            return (resultJson as {group_id:string}).group_id;
        }
        else{
            return null;
        }
    }

    export async function JoinGroup(user: User, group: StudyGroup) : Promise<boolean>{
        let url:string = GetApi() + '/study-groups/' + group.id + '/members/' + user.id
        let result = await post(url);
        if (result.status == 201){
            return true;
        }
        else{
            return false;
        }
    }

    export async function LeaveGroup(user: User, group: StudyGroup) : Promise<boolean>{
        let url:string = GetApi() + '/study-groups/ ' + group.id + '/members/' + user.id
        let result = await del(url);
        if (result.status == 200){
            return true;
        }
        else{
            return false;
        }
    }
}