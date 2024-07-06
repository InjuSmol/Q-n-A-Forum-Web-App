import React from 'react';


class TagPreview extends React.Component {


 
        render() {
          const { tag } = this.props;
      
          return (
            <div className="tag-box">
              <span>{tag.name}</span>
              {/* Add additional content or functionality related to each tag as needed */}
            </div>
          );
        }
}





export default TagPreview;