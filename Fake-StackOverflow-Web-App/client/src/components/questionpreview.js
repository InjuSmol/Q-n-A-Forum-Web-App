import React from 'react';
import ViewQuestion from './viewquestion';
import QuestionPage from './questionmainpage';
import axios from 'axios';
import { Link } from 'react-router-dom';

class QuestionPreview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showQuestion: false, 
            votes: this.props.question.votes, 
            views: this.props.question.views
        };
    }

    handleTitleClick = async () => {
        try {
            
            this.setState((prevState) => ({
                showQuestion: true,
            }));

            this.props.page.showQuestion(this.props.question);
            await axios.post('http://localhost:8000/updateViews',{question: this.props.question}, { withCredentials: true });
        } catch (error) {
                console.error('Error updating views:', error);
        }
    };

    handleUpvote = async () => {
        try {
            const user = await axios.get('http://localhost:8000/session-user', { withCredentials: true });
            if (user.data.reputation >= 50 || user.data.role === 'admin') {
                try {
                    //this.setState((prevState) => ({ votes: prevState.votes + 1 }));
                    await axios.post('http://localhost:8000/incrementVotes',{question: this.props.question}, { withCredentials: true });
                    this.setState(prevState => ({ votes: prevState.votes + 1 }));
                    try {
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

    handleDownvote = async () => {
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
        if(!this.state.showQuestion) {
            return(
                <div style={{height: '140px'}}>
                <div className='questionPreview' style={{justifyContent: 'left' }}>
                    <div className='questionComponent' style={{justifyContent: 'space-between', marginLeft: '3%'}}>
                        <p style={{color: 'dimgray'}}>{this.props.question.answers.length} Answers</p>
                        <p style={{color: 'dimgray'}}>{this.props.question.views} Views</p>
                    </div>
                    <div id="voteButtons">
                                <button onClick={this.handleUpvote} className="voteButton" aria-label="Upvote">
                                ▲
                                </button>
                                <br />
                                <span>{this.state.votes}</span>
                                <br />
                                <button onClick={this.handleDownvote} className="voteButton" aria-label="Downvote">
                                ▼
                                </button>
                            </div>
                    <div className='questionComponent' style={{justifyContent: 'space-between', marginLeft: '0%'}} >
                        {/* <Link to={`/questions/${this.props.question._id}`}> */}
                        <h3 onClick={this.handleTitleClick} style={{fontSize: '22px'}}id="mainQuestionTitle">{this.props.question.title}</h3>
                        {/* </Link> */}
                        <div style={{height: '27px'}} >
                        {this.props.question.tags.map(tag => (
                            <span key={tag._id} style={{height: '80%', display:'inline-block'}} className="smolTag">
                                {tag.name}
                            </span>
                        ))}
                        
                        </div>
                       
                        <div className='questionComponent' style={{margin: '8px'}}>
                            <h3 style={{color: 'red', fontWeight: 'lighter', marginTop: '-8px'}}>{this.props.question.summary}</h3>
                        </div>
                        
                    </div>
                
                    <div className='questionComponent' style={{justifyContent: 'right',  marginLeft: '8%'}}>
                        <p style={{color: 'dimgray'}}><span style={{color:'red'}}>{this.props.question.asked_by}</span> asked {formatDateTime(this.props.question.ask_date_time)}</p>
                    </div>
                    </div>
                </div>
            );
        }
        return (<QuestionPage showQuestion={true} />)
    }
}

export default QuestionPreview;