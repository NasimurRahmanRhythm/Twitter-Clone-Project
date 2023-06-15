import { MiniProfile } from "../mini-profile/MiniProfile";

export function UserList({users=[]}){
 return <div className="col">
    {
      users.map(user=>(
        <div className="col">
          <MiniProfile key={user.id} user={user}/>
          <div className="h-divider"></div> 
        </div>
      ))
    }
  </div>
}
