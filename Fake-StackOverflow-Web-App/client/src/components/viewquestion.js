import React from 'react'
import NewQuestionPage from './newquestionpage';
import NewAnswerPage from './newanswerpage';
import { Link } from 'react-router-dom';
import axios from 'axios';
//import Question from 'question'

class ViewQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAskQuestion: false,
            showAnswerQuestion: false,
            answers: [], 
            currentPage: 1,
            answersPerPage: 5,
            isLoggedIn: false,
            votes: this.props.question.votes,
            comments: this.props.question.comments
        };
        this.handleNewQuestionClick = this.handleNewQuestionClick.bind(this);
        this.handleNewAnswerClick = this.handleNewAnswerClick.bind(this);
        this.handleNewCommentClick = this.handleNewCommentClick.bind(this);
    }

    async componentDidMount() {
        await this.fetchAnswers();
        axios.get('http://localhost:8000/session-user', { withCredentials: true })
        .then(response => {
            if (response.data && (response.data.role === 'user' || response.data.role === 'admin')) {
            this.setState({ isLoggedIn: true });
            }
        })
        .catch(error => console.log(error));
    }
    
     async fetchAnswers() {
        try {
            const questionId = this.props.question._id;
            console.log(questionId);
            const response = await axios.get(`http://localhost:8000/answers/${questionId}`, { withCredentials: true });
            const sortedAnswers = response.data.sort((a, b) => new Date(b.ans_date_time) - new Date(a.ans_date_time));
            this.setState({ answers: sortedAnswers });
        } catch (error) {
            console.error('Error fetching answers:', error);
        }
    }

    handleNewQuestionClick() {
        this.setState({showAskQuestion: true});
    }

    handleNewCommentClick() {
        console.log('hi');
    }

    handleNewAnswerClick() {
        this.setState({showAnswerQuestion: true});
    }

    paginate = pageNumber => {
        this.setState({ currentPage: pageNumber });
    }

    render() {
        const formatDateTime = (dateTimeString) => {
            const optionsWithoutYear = {
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            };
            const optionsWithYear = {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
            };
            const currentDate = new Date();
            const postDate = new Date(dateTimeString);
            const timeDifference = currentDate - postDate;
            const secondsInMinute = 60*60*60;
            const secondsInHour = 60*60*60*60;
            const secondsInDay = 24*60*60*60*60;
            if (timeDifference < secondsInMinute) {
                // Less than a minute ago
                return 'just now';
            } else if (timeDifference < secondsInHour) {
                // Less than an hour ago
                const minutesAgo = Math.floor(timeDifference / secondsInMinute);
                return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
            } else if (timeDifference < secondsInDay) {
                // Less than a day ago
                const hoursAgo = Math.floor(timeDifference / secondsInHour);
                return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
            } else {
                // More than a day ago
                // If the question is viewed a year after the posted date, include the year in the format
                const options = currentDate.getFullYear() - postDate.getFullYear() === 1 ? optionsWithYear : optionsWithoutYear;
                const formattedDate = postDate.toLocaleDateString('en-US', options);
                return formattedDate;
            }
        };    

        const handleUpvote = async () => {
            try {
                const user = await axios.get('http://localhost:8000/session-user', { withCredentials: true });
                if (user.data.reputation >= 50 || user.data.role === 'admin') {
                    try {
                        //this.setState((prevState) => ({ votes: prevState.votes + 1 }));
                        await axios.post('http://localhost:8000/incrementVotes',{question: this.props.question}, { withCredentials: true });
                        this.setState(prevState => ({ votes: prevState.votes + 1 }));
                        try {
                            console.log(this.props.question.userID);
                            await axios.post('http://localhost:8000/editReputation', {userID: this.props.question.userID, edit: "increase"}, { withCredentials: true });
                        } catch (error) {
                            console.error('Error increasing reputation:', error);
                        }
                    } catch (error) {
                        console.error('Error updating views:', error);
                    }
                }
                else {
                    window.alert('Reputation must be at least 50 to vote!');
                }
            } catch (error) {
                window.alert('Please log in to vote!');
            }
        };
    
        const handleDownvote = async () => {
            try {
                const user = await axios.get('http://localhost:8000/session-user', { withCredentials: true });
                if (user.data.reputation >= 50 || user.data.role === 'admin') {
                    try {
                        //this.setState((prevState) => ({ votes: prevState.votes + 1 }));
                        await axios.post('http://localhost:8000/decrementVotes',{question: this.props.question}, { withCredentials: true });
                        this.setState(prevState => ({ votes: prevState.votes - 1 }));
                        try {
                            await axios.post('http://localhost:8000/editReputation', {userID: this.props.question.userID, edit: "decrease"}, { withCredentials: true });
                        } catch (error) {
                            console.error('Error decreasing reputation:', error);
                        }
                    } catch (error) {
                        console.error('Error updating views:', error);
                    }
                }
                else {
                    window.alert('Reputation must be at least 50 to vote!');
                }
            } catch (error) {
                window.alert('Please log in to vote!');
            }
        };

        const handleAnswerUpvote = async (answerId, answer_id) => {
            try {
                const user = await axios.get('http://localhost:8000/session-user', { withCredentials: true });
                if (user.data.reputation >= 50 || user.data.role === 'admin') {
                    try {
                        const response = await axios.post('http://localhost:8000/incrementAnswerVotes', { answerId }, { withCredentials: true });
                
                        const updatedVotes = response.data;
                        try {
                            await axios.post('http://localhost:8000/editReputation', {userID: answer_id, edit: "increase"}, { withCredentials: true });
                        } catch (error) {
                            console.error('Error increasing reputation:', error);
                        }
                        this.setState((prevState) => {
                            const updatedAnswers = prevState.answers.map((answer) => {
                                if (answer._id === answerId) {
                                    return { ...answer, votes: updatedVotes };
                                }
                                return answer;
                            });
                            return { answers: updatedAnswers };
                        });
                    } catch (error) {
                        console.error('Error updating votes:', error);
                    }
                }
                else {
                    window.alert('Reputation must be at least 50 to vote!');
                }
            } catch (error) {
                window.alert('Please log in to vote!');
            }
        };
        
        const handleAnswerDownvote = async (answerId, answer_id) => {
            try {
                const user = await axios.get('http://localhost:8000/session-user', { withCredentials: true });
                if (user.data.reputation >= 50 || user.data.role === 'admin') {
                    try {
                        const response = await axios.post('http://localhost:8000/decrementAnswerVotes', { answerId }, { withCredentials: true });
                
                        const updatedVotes = response.data;
                        try {
                            await axios.post('http://localhost:8000/editReputation', {userID: answer_id, edit: "decrease"}, { withCredentials: true });
                        } catch (error) {
                            console.error('Error increasing reputation:', error);
                        }
                        this.setState((prevState) => {
                            const updatedAnswers = prevState.answers.map((answer) => {
                                if (answer._id === answerId) {
                                    return { ...answer, votes: updatedVotes };
                                }
                                return answer;
                            });
                            return { answers: updatedAnswers };
                        });
                    } catch (error) {
                        console.error('Error updating votes:', error);
                    }
                }
                else {
                    window.alert('Reputation must be at least 50 to vote!');
                }
            } catch (error) {
                window.alert('Please log in to vote!');
            }
        };

        const { currentPage, answersPerPage, answers} = this.state;
        const indexOfLastAnswer = currentPage * answersPerPage;
        const indexOfFirstAnswer = indexOfLastAnswer - answersPerPage;
        const currentAnswers = answers.slice(indexOfFirstAnswer, indexOfLastAnswer);
        if (this.state.showAskQuestion) {
            return(
                <NewQuestionPage />
            );
        }
        else if (this.state.showAnswerQuestion) {
            return(
                <NewAnswerPage qid={this.props.question._id}/>
            );
        }
        return(
            <div id="viewQuestion">
                <div className='viewQuestionHeader'>
                    <div className='viewQuestionHeaderRow'>
                        <h4 className="viewQuestionViews">{this.props.question.answers.length} answers</h4>
                        <h3 className="viewQuestionViews">{this.props.question.title}</h3>
                        {this.state.isLoggedIn && (<Link to='/askquestion'>
                            <button className='askQuestionFromQuestionPage' onClick={this.handleNewQuestionClick}>Ask Question</button>
                        </Link>)}
                        <div>
                            {this.state.isLoggedIn && (<Link to='/postcomment'>
                                <button className='askQuestionFromQuestionPage' style={{marginLeft: '-250px'}} onClick={this.handleNewCommentClick}>Comment</button>
                            </Link>)}
                        </div>
                    </div>
                    <div className='viewQuestionHeaderRow'>
                        <h4 className='viewQuestionViews'>{this.props.question.views} views</h4>

                        <div style={{marginBottom: '20px'}}>
                            <button style={{color: 'rgb(70, 131, 71)'}} onClick={() => handleUpvote(this.props.question)} className="voteButton" aria-label="Upvote" >
                                ▲
                            </button>
                            <br />
                            <span style={{marginLeft: '38%'}}>{this.state.votes}</span>
                            <br />
                            <button style={{color: 'rgb(237, 86, 70)'}} onClick={() => handleDownvote(this.props.question)} className="voteButton" aria-label="Downvote">
                                ▼
                            </button>
                        </div>

                        <h3 className='questionText'>{this.props.question.text}</h3>
                        <p className='viewQuestionAuthor'><span style={{color: 'red'}}>{this.props.question.asked_by}</span> <br />
                        <span style={{color: 'gray'}}>asked {formatDateTime(this.props.question.ask_date_time)}</span></p>
                    </div>
                    <div className='viewQuestionHeaderRow'>
                    
                    </div>
                </div>
                <div className='viewAnswers'>
                    {currentAnswers.map(answer => (
                        <div className='singleAnswer' key={answer._id}>
                            <div className='answerVoteButton'>
                                <div style={{marginBottom: '20px'}}>
                                    <button style={{color: 'rgb(70, 131, 71)'}} onClick={() => handleAnswerUpvote(answer._id, answer.answer_id)} className="voteButton" aria-label="Upvote" >
                                        ▲
                                    </button>
                                    <br />
                                    <span style={{marginLeft: '38%'}}>{answer.votes}</span>
                                    <br />
                                    <button style={{color: 'rgb(237, 86, 70)'}} onClick={() => handleAnswerDownvote(answer._id, answer.answer_id)} className="voteButton" aria-label="Downvote">
                                        ▼
                                    </button>
                                </div>
                            </div>
                            <div className='answerComponent1'>
                                <p>{answer.text}</p>
                            </div>
                            <div className='answerComponent2'>
                                <p><span style={{color: 'green'}}>{answer.ans_by}</span> <br />
                                <span style={{color: 'gray'}}>added {formatDateTime(answer.ans_date_time)}</span></p>
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <button className='answerPageSwitch' onClick={() => this.paginate(currentPage - 1)} disabled={currentPage <= 1}>Prev</button>
                    <button className='answerPageSwitch' onClick={() => this.paginate(currentPage + 1)} disabled={currentPage * answersPerPage >= answers.length}>Next</button>
                </div>
                <div className='answerButtonContainer'>
                    {this.state.isLoggedIn && (<button id='answerQuestionButton' onClick={this.handleNewAnswerClick}>Answer Question</button>)}
                </div>
            </div>
        );
    }
}

export default ViewQuestion;