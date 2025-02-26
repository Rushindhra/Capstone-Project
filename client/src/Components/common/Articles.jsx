import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import { IoFilterOutline } from "react-icons/io5";
import axios from 'axios'
//to add token from the google
import {useAuth} from '@clerk/clerk-react'
function Articles() {
  const [articles,setArticles]=useState([])
  const [error,setError]=useState('')
  const navigate=useNavigate();
  //get token from the server
  const {getToken}=useAuth();
  //filtering the category
  const [filteredArticles, setFilteredArticles] = useState([]);
  //selecting of the category
  const[selectedCategory,setSelectedCategory]=useState("all")
  //get all articles
  async function getArticles()
  {
    //get jwt token
    const token=await getToken()
    //make authenticated req
    let res=await axios.get(`http://localhost:3000/author-api/articles`,{
      headers:{
        //token google server sents
        Authorization:`Bearer ${token}`
      }
    })
    if(res.data.message==='articles'){
      setArticles(res.data.payload)
      setError('')
    }else{
      setError(res.data.message)
    }
  }
  console.log(error)
  //goto specific location of the article
  function gotoArticleById(articleObj)
  {
    //navigation it also send the state to specify which article should be displayed
    navigate(`../${articleObj.articleId}`,{ state:articleObj})
  }
  //selection of the category
  function changeCategory(event) {
    const category = event.target.value;
    setSelectedCategory(category);

    if (category === "all") {
      setFilteredArticles(articles);
    } else {
      setFilteredArticles(
        articles.filter((article) => article.category === category)
      );
    }
  }

  useEffect(()=>{
    getArticles()
  },[])
  useEffect(() => {
    setFilteredArticles(articles);
  }, [articles]);
  console.log(articles)
  return (
    <div className='container'>
      {/* Category Selection */}
      <div className="mb-4">
        <label htmlFor="category" className="form-label">
        <IoFilterOutline className='text-secondary'/> Select a category
        </label>
        <select
          id="category"
          className="form-select w-50"
          value={selectedCategory}
          defaultValue=""
          onChange={changeCategory}
        >
          <option value="" disabled>--categories--</option>
          <option value="all">All</option>
          <option value="programming">Programming</option>
          <option value="AI&ML">AI & ML</option>
          <option value="database">Database</option>
        </select>
      
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 mt-5">
        {error.length!==0&&<p className='display-4 text-center mt-5 text-danger'>{error}</p>}
            
             {filteredArticles.map((articleObj)=><div className='col' key={articleObj.articleId}>
              <div className='card h-100'>
              <div className='card-body'>
                <div className="author-details text-end">
                  <img src={articleObj.authorData.profileImageUrl} width='40px' className='rounded-circle' alt="" />
                     {/* author name */}
                  <p>
                    <small className='text-secondary'>
                      {articleObj.authorData.nameOfAuthor}
                    </small>
                  </p>
                </div>
                 {/* article title */}
                <h5 className='card-title'>{articleObj.title}</h5>
                {/* article content upadto 80 chars */}
                <p className='card-text'>
                    {articleObj.content.substring(0,80)+"...."}
                </p>
                {/* read more button */}
                <button className='custom-btn btn-4' onClick={()=>gotoArticleById(articleObj)}>
                  Read More
                </button>
              </div>
              <div className="card-footer">
                <small className='text-body-secondary'>
                  Last updated on {articleObj.dateOfModification}
                </small>
              </div>
              </div>
            </div>
              )
          }

        </div>
      </div>
      </div>
  )
}

export default Articles