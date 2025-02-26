import React from 'react'
import {NavLink,Outlet} from 'react-router-dom'
function AdminProfile() {
  return (
    <div className='author-profile'>      
            <ul className='d-flex justify-content-around list-unstyled fs-3'>
                  <li className='nav-item'>
                    <NavLink to='articles' className='nav-link'>Articles</NavLink>
                  </li>  
                  <li className='nav-item'>
                    <NavLink to='users' className='nav-link'>Users</NavLink>
                  </li>  
                  <li className='nav-item'>
                    <NavLink to='authors' className='nav-link'>Authors</NavLink>
                  </li>  
            </ul>
             <div className='mt-5'>
                    {/* to load the articles and add new article here */}
                    
                    <Outlet/>
                    
                   
                  </div>
           </div>
  )
}

export default AdminProfile