import React, { useState } from 'react';
import QuestionPage from './questionmainpage';
import axios from 'axios';

const NewAnswerPage = (props) => {
    const [answerData, setAnswerData] = useState({
      answer_text: '',
      question_id: props.qid
    });
  const [mainView, setMainView] = useState(false);

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setAnswerData((prevData) => {
      return { ...prevData, [id]: value };
    });
  };

  const submitAnswer = async () => {
    if (!answerData.answer_text) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      await axios.post('http://localhost:8000/answers', answerData, { withCredentials: true });
      setMainView(true);
    } catch(error) {
        console.error('Error creating new question', error);
    }
  };

  if (!mainView) {
    return(
        <div className='newAnswer'>
            <h2>Answer Text*</h2>
            <input type='text' id='answer_text' value={answerData.answer_text} onChange={handleInputChange} required></input>
            <h2 style={{visibility: 'hidden', marginBottom:'10px', marginTop: 0 }}>''</h2>
            <div>
              <button id='answerPost' className="welc-the-button" onClick={submitAnswer} >Post Answer</button>
            </div>
        </div>
    );
  }
  return(<QuestionPage />);
};

export default NewAnswerPage;