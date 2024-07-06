import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

class TagsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        tag: '',
        tags: [],
        isLoggedIn: false
    };
}

async componentDidMount() {
  const listtags = await this.getAllTags();
  this.setState({ tags: listtags });
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

async getAllTags() {
    try {
        const response = await axios.get('http://localhost:8000/tags', { withCredentials: true });
        console.log("loaded tags");
        return response.data;
    } catch (error) {
        console.error('Error fetching tags: ', error);
        return [];
    }
}

render() {
    const { showTags, tags } = this.state;

    const listTags = tags.map((tag) => (
        <div key={tag._id} className="tag">
          <p className="taglink" onClick={() => this.handleTagClick(tag._id)}>
            <u>{tag.name}</u>
          </p>
          {/**/}
          <p>{/*  */}</p>
        </div>
      ));
    


    return (
      <div className='mainPageQuestionHeader'>
        <div className='mainPageQuestionRow'>
            <div className='mainPageQuestionLeftContent'>
                <h2 className = "tagHeader">{`${tags.length} Tags`}</h2>
                <h2 className = "tagHeader">All Tags</h2>
            </div>
            <div className='mainPageQuestionRightContent'>
              {this.state.isLoggedIn && (<Link to='/askquestion'>
                <button id="ask_question_button">Ask Question</button>
              </Link>)}
            </div>
        </div>
    
        <div className="tag-container">
          {tags.map((tag, index) => (
          <div key={tag._id} className="tag-box">
            <p className="taglink" onClick={() => this.handleTagClick(tag.tid)}>
              <u className="tagContent">{tag.name}</u>
            </p>
          </div>
        ))}
        </div>
      </div>
    )
  }
}

export default TagsPage;