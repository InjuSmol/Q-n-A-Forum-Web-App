import React, { useState } from 'react';
import QuestionPage from './questionmainpage';
import axios from 'axios';

const NewCommentPage = (props) => {
    const [commentData, setCommentData] = useState({
      comment_text: '',
      question_id: props.qid
    });
  const [mainView, setMainView] = useState(false);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setCommentData((prevData) => {
      return { ...prevData, [id]: value };
    });
  };

  const submitComment = async () => {
    if (!commentData.comment_text) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/questionComment', commentData, { withCredentials: true });
      setMainView(true);
    } catch(error) {
        console.error('Error creating new question', error);
    }
  };

  if (!mainView) {
    return(
        <div className='newAnswer'>
            <h2>Comment Text*</h2>
            <input type='text' id='comment_text' value={commentData.comment_text} onChange={handleInputChange} required></input>
            <h2 style={{visibility: 'hidden', marginBottom:'10px', marginTop: 0 }}>''</h2>
            <div>
              <button id='commentPost' className="welc-the-button" onClick={submitComment} >Post Comment</button>
            </div>
        </div>
    );
  }
  return(<QuestionPage />);
};

export default NewCommentPage;