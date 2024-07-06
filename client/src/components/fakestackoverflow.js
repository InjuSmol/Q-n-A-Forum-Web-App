import React from 'react';
import { Link } from 'react-router-dom';


export default function fakeStackOverflow({ toggleQuestionPage }) {
  return (
    <div style={{display:'inline'}}>
      
      <Link to='/questions' style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 className='titleHeader' id='title'>Fake Stack Overflow</h1>
      </Link>
    </div>
  );
}