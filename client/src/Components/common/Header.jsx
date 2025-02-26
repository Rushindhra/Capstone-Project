import {useContext} from 'react'
import { IoLogoEdge } from "react-icons/io5";
import {Link, useNavigate} from 'react-router-dom'
import {useClerk,useUser} from '@clerk/clerk-react'
import {userAuthorContextObj} from '../../contexts/userAuthorContext'
function Header() {
  const {signOut}=useClerk()
  const {isSignedIn,user,isLoaded}=useUser()
  const { currentUser, setCurrentUser } = useContext(userAuthorContextObj)
  const navigate=useNavigate;
  //function to signOut
  async function handleSignout(){
    await signOut();
    setCurrentUser(null);
    navigate('/')
  }
  return (
    <div>
      <nav className='header d-flex justify-content-between align-items-center'>
        <div className="d-flex justify-content-center">
        <Link to="/" className='p-2'>
        <IoLogoEdge  className="admin-icon" /><p className='lead'>Capstone Project</p>
        </Link>
        </div>
        <ul className="d-flex justify-content-around header-links list-unstyled">

          {
            !isSignedIn?
            <>
            <li>
            <Link to="">Home</Link>
          </li>
          <li>
            <Link to="signin">Signin</Link>
          </li>
          <li>
            <Link to="signup">Signup</Link>
          </li>
            </>:
            <div className='d-flex'>
              <div className='user-button'>
                <div style={{position:'relative'}}>
                    <img src={user.imageUrl} width='60px' className='rounded-circle mt-2' alt='' />
                    <p className='role' style={{position:'absolute',top:'0px',right:'-20px'}}>{currentUser.role}</p>
                </div>
                <p className='mb-0 user-name'>{user.firstName}</p>
              </div>
              <button className="btn btn-danger signout-btn m-4" onClick={handleSignout}>SignOut</button>
            </div>
          }
          
        </ul>
      </nav>
    </div>
  )
}

export default Header