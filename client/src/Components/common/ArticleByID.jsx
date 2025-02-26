import {useContext, useState} from 'react'
import { FaEdit } from 'react-icons/fa'
import { MdDateRange } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { MdDelete, MdRestore } from 'react-icons/md'
import {userAuthorContextObj} from "../../contexts/userAuthorContext"
//to implement backend
import axios from 'axios'
//takes the object which was sentt by article by using useLocation hook
import {useLocation, useNavigate} from 'react-router-dom'
//form for importing
import { useForm } from 'react-hook-form'
//token
import {useAuth} from '@clerk/clerk-react'
function ArticleByID() {

  const {state}=useLocation()
  const {currentUser}=useContext(userAuthorContextObj)
  // using states such that when it is true it will display edit status, when it is false no edits
  const [editArticleStatus,setEditArticleStatus]=useState(false)
  //to read the article
  const [currentArticle,setCurrentArticle]=useState(state)
console.log(currentArticle)
  // console.log(state)
  const { register, handleSubmit } = useForm()
  //comment
  const [commentStatus,setCommentStatus]=useState('')
  //token from google server
  const {getToken}=useAuth();

  //navigation
  const navigate=useNavigate();

  //function to chang edit status of article
  function enableEdit()
  {
    setEditArticleStatus(true)
  }
  //function to save the document
    //to save modified article
    async function onSave(modifiedArticle) {
      //desttrure the modified article
      const articleAfterChanges={...state,...modifiedArticle}
      //get the token
      const token=await getToken();
      //to get the date of the system 
      const currentDate=new Date();
      //add date of modification
      articleAfterChanges.dateOfModification=currentDate.getDate()+"-"+currentDate.getMonth()+"-"+currentDate.getFullYear()
      // console.log(articleAfterChanges)
      //make http post after changes request
      let res=await axios.put(`http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
              articleAfterChanges,{
              headers:{
                Authorization:`Bearer ${token}`
              }
            })
      if(res.data.message==='article modified'){
        //change edit article status to false
        setEditArticleStatus(false);
        navigate(`/author-profile/articles/${state.articleId}`,{state:res.data.payload})
      }
    }
    console.log(currentUser)
    //delete the article
    async function deleteArticle(){
      state.isArticleActive=false;
      let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
      if(res.data.message==='article deleted or restored')
      {
        setCurrentArticle(res.data.payload)
      }
    }
    //restore the article
    async function restoreArticle(){
      state.isArticleActive=true;
      let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
      if(res.data.message==='article deleted or restored')
        {
          setCurrentArticle(res.data.payload)
        }
    }
    //add comment by user
    async function addcomment(commentObj){
      //add name of user to comment obj
      commentObj.nameOfUser=currentUser.firstName;
      console.log(commentObj)
      //http put request to update the article by adding comment to it
      let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj)
      if(res.data.message==='comment added'){
        setCommentStatus(commentObj)
      }
    }
  return (
    <div className='container'>
  {
    // If the current user is a normal user and the article is deleted, display a message instead of the article
    currentUser.role === 'user' && state.isArticleActive === false ? (
      <p className="text-danger text-center mt-5">This article is no longer available.</p>
    ) : (
      <>
        {/* Display the article */}
        <div className="d-flex justify-content-between">
          <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
            <div>
              {/* Article title */}
              <p className="display-3 me-4">{state.title}</p>

              {/* Display creation and modification dates */}
              <span className='py-3'>
                <MdDateRange />
                <small className="text-secondary me-4">
                  Created on: {state.dateOfCreation}
                </small>
                <FaRegClock />
                <small className="text-secondary me-4">
                  Modified on: {state.dateOfModification}
                </small>              
              </span>
            </div>

            {/* Author details */}
            <div className="author-details text-center">
              <img src={state.authorData.profileImageUrl} alt="Author" width='60px' className="rounded-circle" />
              <p>{state.authorData.nameOfAuthor}</p>
            </div>
          </div>

          {/* Edit/Delete/Restore options (Only for authors) */}
          {
            currentUser.role === 'author' && (
              <div className="d-flex me-3">
                {/* Edit button */}
                <button className="me-2 btn btn-light h-25" onClick={enableEdit}>
                  <FaEdit className='text-warning' />
                </button>

                {/* If article is active, display delete icon, otherwise display restore icon */}
                {
                  state.isArticleActive ? (
                    <button className='me-2 btn btn-light h-25' onClick={deleteArticle}>
                      <MdDelete className='text-danger fs-4' />
                    </button>
                  ) : (
                    <button className="me-2 btn btn-light h-25" onClick={restoreArticle}>
                      <MdRestore className='text-info fs-4' />
                    </button>
                  )
                }
              </div>
            )
          }
        </div>

        {/* Article content */}
        <p className="lead mt-3 article-content" style={{ whiteSpace: "pre-line" }}>
          {state.content}
        </p>

        {/* Comments Section */}
        <div>
          <div className="comments my-4">
            {state.comments.length === 0 ? (
              <p className='display-3'>No comments yet..</p>
            ) : (
              state.comments.map(commentObj => (
                <div key={commentObj._id}>
                  {/* Display the commenter's name */}
                  <p className="user-name">{commentObj?.nameOfUser}</p>
                  {/* Display the comment text */}
                  <p className="comment">{commentObj?.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Comment Form (Only for users) */}
        {currentUser.role === 'user' && (
          <form onSubmit={handleSubmit(addcomment)}>
            <input type="text" {...register("comment")} className='form-control mb-4' placeholder="Add a comment..." />
            <button className='btn btn-success'>Add a comment</button>
          </form>
        )}
      </>
    )
  }
</div>

  )
}

export default ArticleByID