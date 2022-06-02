import { useSelector } from "react-redux"
import { selectUsersData } from "./usersSlice"



export const UsersList = () => {

  //const users = useSelector(state => selectUsersData(state))
  // const renderedUsers = users.map(user => (
  //     <li key={user.id}>
  //         <div >{user.name}</div>
  //     </li>
  // ))

  return (
      <section>
          <h2>Users</h2>

          {/* <ul>{renderedUsers}</ul> */}
      </section>
  )
}
