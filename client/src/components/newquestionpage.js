import React, { useState, useEffect } from 'react';
import QuestionPage from './questionmainpage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewQuestionPage = () => {
    const [questionData, setQuestionData] = useState({
        new_title: '',
        new_text: '',
        new_tags: '',
        new_summary: ''
    });
    const [userReputation, setUserReputation] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/session-user', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    setUserReputation(response.data.reputation);
                }
            })
            .catch(error => console.error(error));
    }, []);

    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setQuestionData((prevData) => {
            if (id === 'new_tags') {
                const tagsArray = value.split(/\s+/);
                return { ...prevData, [id]: tagsArray };
            }
            const newData = { ...prevData, [id]: value };
            return newData;
        });
    };

    const submitQuestion = async () => {
        if (!questionData.new_title || !questionData.new_text || !questionData.new_tags || !questionData.new_summary) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            await axios.post('http://localhost:8000/questions', questionData, { withCredentials: true });
        } catch(error) {
            console.error('Error creating new question', error);
        }
        navigate('/questions');
    };
      return(
          <div className='newQuestion'> 
              <div className='newQuestionContents'>
                  <h2>Question Title*</h2>
                  <p><i>Limit title to 50 characters or less</i></p>
                  <input type='text' id='new_title' style={{width: '200px', height: '20px'}} maxLength='50' value={questionData.title} onChange={handleInputChange} required></input> 
                  <h2>Question Summary*</h2>
                  <input type='text' style={{width: '280px', height: '70px'}} id='new_summary' maxLength='140' value={questionData.summary} onChange={handleInputChange} required></input>
                  <br></br>
                  <h2>Question Text*</h2>
                  <p><i>Add details</i></p>
                  <input type='text' id='new_text' style={{width: '280px', height: '70px'}} value={questionData.text} onChange={handleInputChange} required></input>
                  <h2>Tags*</h2>
                  <p><i>Add keywords separated by whitespace. Only for users with 50+ reputation.</i></p>
                  <input type='text' style={{width: '160px', height: '20px'}} id='new_tags' value={questionData.tags} onChange={handleInputChange} disabled={userReputation < 50} required></input>
                  <h2 style={{visibility: 'hidden', marginBottom:'20px', marginTop: 0 }}>''</h2>
                  <button id='questionPost' onClick={submitQuestion}>Post Question</button>
              </div>
          </div>
    );
};

export default NewQuestionPage;