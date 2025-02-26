import {useState,useEffect} from 'react'
import { MdOutlineBlock } from "react-icons/md";
import { FaCircle } from "react-icons/fa";
//to add token from the google
import {useAuth} from '@clerk/clerk-react' 
import axios from 'axios'
function Authors() {
    const [authors,setAuthors]=useState([])
    const [error,setError]=useState('')
    const {getToken}=useAuth();
    async function getAuthors()
    {
        //get jwt token 
        const token=await getToken()
        //make authenticated req
        let res=await axios.get(`http://localhost:3000/admin-api/authors`,{
            headers:{
                //token sents by the google server
                Authorization:`Bearer ${token}`
            }
        })
        if(res.data.message==='authors' ){
            setAuthors(res.data.payload)
            setError('')
          }else{
            setError(res.data.message)
          }
    }
    console.log(error)
    //goto specific user
      useEffect(()=>{
        getAuthors()
      },[])
      console.log(authors)
      async function blockUser(email) {
        const token = await getToken();
        let res = await axios.put(
            `http://localhost:3000/admin-api/author/${email}`,
            { isActive: false },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.data.message === 'author is blocked or unblocked') {
            setUsers(users.map(user => user.email === email ? { ...user, isActive: false } : user));
        }
    }    
      async function unblockUser(email) {
        const token = await getToken();
        let res = await axios.put(
            `http://localhost:3000/admin-api/author/${email}`,
            { isActive: true },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (res.data.message === 'author is blocked or unblocked') {
            setUsers(users.map(user => user.email === email ? { ...user, isActive: true } : user));
        }
    }
    return (
    <div className='container'>
        <div className="row row-col-1 row-cols-sm-2 row-cols-md-3 mt-5">
        {error.length!==0&&<p className='display-4 text-center mt-5 text-danger'>{error}</p>}
        {authors.map((UserObj)=><div className='col' key={UserObj.email}>
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

export default Authors;