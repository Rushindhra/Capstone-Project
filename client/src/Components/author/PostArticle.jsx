import {useContext} from 'react'
import {useForm} from 'react-hook-form'
import {userAuthorContextObj} from '../../contexts/userAuthorContext'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
function PostArticle() {
  const {register,handleSubmit,formState:{errors}}=useForm()
  const {currentUser}=useContext(userAuthorContextObj)
  const navigate=useNavigate()
  async function postArticle(articleObj)
  {
    console.log(articleObj)
    //create article object as per article schema
    const authorData={
      //the values can be obtained by current user present in userAutherContextObj
      nameOfAuthor:currentUser.firstName,
      email:currentUser.email,
      profileImageUrl:currentUser.profileImageUrl
    }
    //from the form we are receiving article object. So, assign article object to the author data to author data
    articleObj.authorData=authorData;
    //article id(timeStamp), have a inbuilt function to post current date and time in timestamp protocol(i.e Date.now())
    articleObj.articleId=Date.now()
    //Already article contains the title, category and content no need t assign them
    //adding date of creaion and modification
    let currentDate=new Date();
    //to localTimeString takes 2 arguments of time format and provides to article object 
    articleObj.dateOfCreation=currentDate.getDate()+"-"
                              +currentDate.getMonth()+"-"
                              +currentDate.getFullYear()+" "
                              +currentDate.toLocaleTimeString("en-US",{hour12:true})
    articleObj.dateOfModification=currentDate.getDate()+"-"
                                  +currentDate.getMonth()+"-"
                                  +currentDate.getFullYear()+" "
                                  +currentDate.toLocaleTimeString("en-US",{hour12:true})
    //add comment array
    articleObj.comments=[];
    //add article active state
    articleObj.isArticleActive=true;
    console.log(articleObj)                             
    //make http post req to create new article in backend
    let res=await axios.post('http://localhost:3000/author-api/article',articleObj)
    //await axios.post('',articleObj)
    if(res.status===201){
      //navigate to articles component
      navigate(`/author-profile/${currentUser.email}/articles`)
    }else{
      //set error
    }
  }
  return (
    <div className="container ">
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 col-md-8 col-sm-10">
          <div className="card shadow">
            <div className="card-title text-center border-bottom">
              <h2 className="p-3 " style={{ color: "goldenrod" }}>
                Write an Article
              </h2>
            </div>
            <div className="card-body bg-light">
              {/* {err.length!==0&&<p className='text-danger fs-5'>{err}</p>} */}
              <form onSubmit={handleSubmit(postArticle)}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    {...register("title")}
                  />
                  {/* title validation err msg */}

                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="form-label">
                    Select a category
                  </label>
                  <select
                     {...register("category")}
                    id="category"
                    className="form-select"
                    defaultValue=""
                  >
                    <option value="" disabled>--categories--</option>
                    <option value="programming">Programming</option>
                    <option value="AI&ML">AI&ML</option>
                    <option value="database">Database</option>
                  </select>
                  {/* title validation err msg */}

                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="form-label">
                    Content
                  </label>
                  <textarea
                     {...register("content")}
                    className="form-control"
                    id="content"
                    rows="10"
                  ></textarea>
                  {/* title validation err msg */}

                </div>

                <div className="text-end">
                  <button type="submit" className="add-article-btn">
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostArticle