import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import Rootlayout1 from './Components/Rootlayout1.jsx'
import Home from './Components/common/Home.jsx'
import Signin from './Components/common/Signin.jsx'
import Signup from './Components/common/Signup.jsx'
import UserProfile from './Components/user/UserProfile.jsx'
import AuthorProfile from './Components/author/AuthorProfile.jsx'
import Articles from './Components/common/Articles.jsx'
import ArticlesByID from './Components/common/ArticleByID.jsx'
import PostArticle from './Components/author/PostArticle.jsx'
import UserAuthorContext from './contexts/userAuthorContext.jsx';
import AdminProfile from './Components/admin/AdminProfile.jsx';
import Authors from './Components/admin/Authors.jsx';
import Users from './Components/admin/Users.jsx';
const browserRouterObj=createBrowserRouter([
  {
    path:"/",
    element:<Rootlayout1/>,
    children:[
      {
        path:"",
        element:<Home/>
      },
      {
        path:"signin",
        element:<Signin/>
      },
      {
        path:"signup",
        element:<Signup/>
      },
      {
        path:"user-profile/:email",
        element:<UserProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articleId",
            element:<ArticlesByID/>
          },
          {
            path:"",
            element:<Navigate to="articles"/>
          }
        ]
      },
      {
        path:"author-profile/:email",
        element:<AuthorProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            path:":articleId",
            element:<ArticlesByID/>
          },
          {
            path:"article",
            element:<PostArticle/>
          },
          {
            path:"",
            element:<Navigate to="articles"/>
          }
        ]
      },
      {
        path:"admin-profile/:email",
        element:<AdminProfile/>,
        children:[
          {
            path:"articles",
            element:<Articles/>
          },
          {
            
              path:":articleId",
              element:<ArticlesByID/>
            
          },
          {
            path:"users",
            element:<Users/>
          },
          {
            path:"authors",
            element:<Authors/>
          },
          {
            path:"",
            element:<Navigate to="articles"/>
          }
        ]
      }
    ]
  },

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorContext>
      <RouterProvider router={browserRouterObj}/>
      </UserAuthorContext>
      
  </StrictMode>
)
