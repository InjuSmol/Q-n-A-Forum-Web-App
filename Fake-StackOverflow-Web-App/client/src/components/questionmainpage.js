
import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import QuestionPreview from './questionpreview'; 
import ViewQuestion from './viewquestion.js';

class QuestionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showQuestionForm: false,
            showQuestion: false,
            showWelcomePage: true,
            question: '',
            questions: [],
            searchQuery: '',
            sortBy: 'newest', 
            pageTitle: 'All Questions',
            currentPage: 1,
            questionsPerPage: 5,
            isLoggedIn: false
        };
        this.handleAskQuestionClick = this.handleAskQuestionClick.bind(this);
        this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
        this.handleSearchEnter = this.handleSearchEnter.bind(this);
        this.handleSortButtonClick = this.handleSortButtonClick.bind(this);
    }

    componentDidMount() {
        this.fetchQuestions();
        axios.get('http://localhost:8000/session-user', { withCredentials: true })
        .then(response => {
            if (response.data && (response.data.role === 'user' || response.data.role === 'admin')) { 
            this.setState({ isLoggedIn: true });
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

    async fetchQuestions() {
        try {
            let url = 'http://localhost:8000/questions';
            const { searchQuery, sortBy } = this.state;
    
            if (searchQuery) {
                url = `http://localhost:8000/search?q=${searchQuery}`;
            }
            const response = await axios.get(url, { withCredentials: true });
            let questions = response.data;

            if (sortBy === 'active') {
                questions.sort((a, b) => b.answers.length - a.answers.length);
            } else if (sortBy === 'newest') {
                questions.sort((a, b) => new Date(b.ask_date_time) - new Date(a.ask_date_time));
            }
    
            if (sortBy === 'unanswered') {
                questions = questions.filter(question => question.answers.length === 0);
            }
    
            this.setState({ questions });
        } catch (error) {
            console.error('Error fetching questions: ', error);
            this.setState({ questions: [] });
        }
    }

    handleAskQuestionClick() {
        this.setState({ showQuestionForm: true });
    }

    showQuestion(question) {
        this.setState({ question });
        this.setState({ showQuestion: true });
    }

    handleSearchEnter(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.fetchQuestions();
    
            const { searchQuery } = this.state;
            const pageTitle = searchQuery ? 'Search Results' : 'All Questions';
            this.setState({ pageTitle });
        }
    }

    handleSearchInputChange(event) {
        this.setState({ searchQuery: event.target.value });
    }

    handleSortButtonClick(sortBy) {
        this.setState({ sortBy }, () => {
            this.fetchQuestions();
        });
    }

    

    render() {
        const indexOfLastQuestion = this.state.currentPage * this.state.questionsPerPage;
        const indexOfFirstQuestion = indexOfLastQuestion - this.state.questionsPerPage;
        const currentQuestions = this.state.questions.slice(indexOfFirstQuestion, indexOfLastQuestion);

        const paginate = pageNumber => this.setState({ currentPage: pageNumber })

        const { questions, showQuestionForm, showQuestion, question, searchQuery, pageTitle, questionsPerPage, currentPage } = this.state;
        
        if (!this.state.showQuestion) {
            if (!this.state.showQuestionForm) {
                const listQuestions = currentQuestions.map(question => (
                    <QuestionPreview key={question._id} question={question} page={this} />
                ))
                // const listQuestions = questions.map((question) => (
                //     <QuestionPreview key={question._id} question={question} page={this} />
                // ));
                return (
                    <div>
                        <div className="mainPageQuestionHeader">
                            <div className="mainPageQuestionRow">
                                <div className="mainPageQuestionLeftContent">
                                <h2>{pageTitle}</h2>
                                </div>
                                <div className="mainPageQuestionRightContent">
                                    {this.state.isLoggedIn && (<Link to="/askquestion">
                                        <button id="ask_question_button" onClick={this.handleAskQuestionClick}>
                                        Ask Question   
                                        </button>
                                    </Link>)}
                                </div>
                            </div>
                            <div className="mainPageQuestionRow">
                                <div className="mainPageQuestionLeftContent">
                                    <p id="numQuestions">{questions.length} Questions</p>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <button className="switchPageButton" onClick={() => paginate(currentPage - 1)} disabled={currentPage <= 1}>Prev</button>
                                    <button className="switchPageButton" onClick={() => paginate(currentPage + 1)} disabled={currentPage * questionsPerPage >= questions.length}>Next</button>
                                </div>
                                <table id="sortingChoices" className="mainPageQuestionRightContent">
                                    <tbody>
                                        <tr>
                                            <td id="newest-td" > 
                                                <button id="newest" onClick={() => this.handleSortButtonClick('newest')}>Newest</button>
                                            </td>
                                            <td id="active-td">
                                                <button id="active" onClick={() => this.handleSortButtonClick('active')}>Active</button>
                                            </td>
                                            <td id="unanswered-td">
                                                <button id="unanswered" onClick={() => this.handleSortButtonClick('unanswered')}>Unanswered</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div id="questionList">
                            <input
                                type="text"
                                id="search"
                                value={searchQuery}
                                onChange={this.handleSearchInputChange}
                                onKeyUp={this.handleSearchEnter}
                                placeholder="Search..."
                            />
                            {listQuestions}
                        </div>
                    </div>
                );
            }
        } else {
            return <ViewQuestion question={question} />;
        }
    }
}

export default QuestionPage;



