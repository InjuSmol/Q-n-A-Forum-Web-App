// ************** THIS IS YOUR APP'S ENTRY POINT. CHANGE THIS FILE AS NEEDED. **************
// ************** DEFINE YOUR REACT COMPONENTS in ./components directory **************
import './stylesheets/App.css';
import FakeStackOverflow from './components/fakestackoverflow.js';
import SearchBar from './components/searchbar.js';
import SearchResults from './components/searchresults.js';
import Sidebar from './components/sidebar.js';
import QuestionPage from './components/questionmainpage.js';
import WelcomePage from './components/welcomepage.js';
import TagsPage from './components/tagspage.js';
import RegisterForm from './components/registerform.js';
import LoginForm from './components/loginform.js';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Route, Routes, useLocation} from 'react-router-dom';
import NewQuestionPage from './components/newquestionpage.js';
import NewAnswerPage from './components/newanswerpage.js';
import LogoutIcon from './components/logouticon.js';
import ViewQuestion from './components/viewquestion.js';
import AdminPage from './components/adminpage.js';
import NewCommentPage from './components/newcommentpage.js';
import UserPage from './components/profilepage.js'

function Content() {
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  
  useEffect(() => {
    setPathname(location.pathname);
  }, [location.pathname]);
  const showSidebarPaths = ['/questions', '/tags', '/askquestion', '/answerquestion'];
  
  return (
    <div className="belowHeader">
      {showSidebarPaths.includes(pathname) && <Sidebar />}
      <Routes>
        <Route exact path="/" element={<WelcomePage />} />
        <Route exact path="/welcome" element={<WelcomePage />} />
        <Route exact path="/questions" element={<QuestionPage />} />
        <Route exact path="/questions/:questionid" element={<ViewQuestion />} />
        <Route exact path="/tags" element={<TagsPage />} />
        <Route exact path="/register" element={<RegisterForm />} />
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/askquestion" element={<NewQuestionPage />} />
        <Route exact path="/answerquestion" element={<NewAnswerPage />} />
        <Route exact path="/admin/dashboard" element={<AdminPage />} />
        <Route exact path="/postcomment" element={<NewCommentPage />} />
        <Route exact path="/profile" element={<UserPage />} />
      </Routes>
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (query) => {
    console.log('Search triggered -- in App', query );
    setSearchQuery(query);
  };
  
  return (
    <Router>
      <section className="fakeso">
        <div className="header">
          <LogoutIcon />
          <FakeStackOverflow />
          <SearchBar onSearch={handleSearch} />
        </div>
        <Routes>
          <Route
            path="/*"
            element={<Content pathname={window.location.pathname} />}
          />
        </Routes>
      </section>
    </Router>
  );
}

export default App;