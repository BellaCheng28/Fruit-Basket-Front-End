import{useState,useEffect} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import * as productService from'../../services/productService';


const ReviewForm = () => {
  const {productId,reviewId}=useParams();
  return <main>Review List</main>;
};





export default ReviewForm;
