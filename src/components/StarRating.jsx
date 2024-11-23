import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const StarRating = ({ averageRating, postId }) => {
  const [rating, setRating] = useState(averageRating);
  const token = useSelector((state) => state.token);
  const handleStarClick = async (value) => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set the default Authorization header
  
      const response = await axios.post(`https://backend-pi-project-2024-cipher.onrender.com/activity/addActivityFeedback/${postId}`, { rating: value });
      const feedback = response.data.feedback || []; // Ensure feedback array exists
    const averageRating = feedback.length > 0 ? feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length : 0;
    setRating(averageRating);
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };
  
  return (
    <div>
      {[1, 2, 3, 4, 5].map((value) => (
        <span
          key={value}
          onClick={() => handleStarClick(value)}
          style={{ cursor: 'pointer', color: value <= rating ? 'gold' : 'gray' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
