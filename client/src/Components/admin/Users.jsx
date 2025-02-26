import {useState,useEffect,useLocation} from 'react'
import { MdOutlineBlock } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
//to add token from the google
import {useAuth} from '@clerk/clerk-react' 
import { CgUnblock } from "react-icons/cg";
import axios from 'axios'
import { userAuthorContextObj } from '../../contexts/userAuthorContext';
function Users() { 
  // const {state}=useLocation()
  // const {currentUser}=useContext(userAuthorContextObj)
    const [users,setUsers]=useState([])
    const [error,setError]=useState('')
    const[editUserStatus,setUserStatus]=useState(false)
    // const[currentUserStatus,setCurrentUserStatus]=useState(state)
    const {getToken}=useAuth();
    async function getUsers()
    {
        //get jwt token 
        const token=await getToken()
        //make authenticated req
        let res=await axios.get(`http://localhost:3000/admin-api/users`,{
            headers:{
                //token sents by the google server
                Authorization:`Bearer ${token}`
            }
        })
        if(res.data.message==='users' ){
            setUsers(res.data.payload)
            setError('')
          }else{
            setError(res.data.message)
          }
    }
    console.log(error)
    //goto specific user
      useEffect(()=>{
        getUsers()
      },[])
      console.log(users);
      //block the user
      async function blockUser(email) {
        const token = await getToken();
        let res = await axios.put(
            `http://localhost:3000/admin-api/user/${email}`,
            { isActive: false },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.data.message === 'user is blocked or unblocked') {
            setUsers(users.map(user => user.email === email ? { ...user, isActive: false } : user));
        }
    }    
      async function unblockUser(email) {
        const token = await getToken();
        let res = await axios.put(
            `http://localhost:3000/admin-api/user/${email}`,
            { isActive: true },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.data.message === 'user is blocked or unblocked') {
            setUsers(users.map(user => user.email === email ? { ...user, isActive: true } : user));
        }
    }
    
    return (
    <div className='container'>
        <div className="row row-col-1 row-cols-sm-2 row-cols-md-3 mt-5">
        {error.length!==0&&<p className='display-4 text-center mt-5 text-danger'>{error}</p>}
        {users.map((UserObj)=><div className='col' key={UserObj.email}>
        <div className='card h-100'>
              <div className='card-body'>
                <div className="author-details text-end">
                  <img src={UserObj.profileImageUrl} width='40px' className='rounded-circle' alt="" />
                     {/* author name */}
                  <p>
                    <small className='text-secondary'>
                      {UserObj.email}
                    </small>
                  </p>
                </div>
                 {/* article title */}
                <h5 className='card-title'>{UserObj.firstName}</h5>
                {UserObj.isActive === true ? (
                            <button className="btn btn-success" onClick={() => blockUser(UserObj.email)}>
                            Block
                            </button>):<button className="btn btn-danger"  onClick={() => unblockUser(UserObj.email)}>
                               Unblock
                            </button>
                  }
            </div>
            </div>
        </div>
        )}
        </div>
    </div>
  )
}

export default Users