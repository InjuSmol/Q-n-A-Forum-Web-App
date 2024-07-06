import React from 'react';


class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
        };
    }

    handleInputChange = (event) => {
        const { value } = event.target;
        this.setState({ searchQuery: value });
         // not sure this below we need it 
         if (event.key === 'Enter' && value.trim() !== '') {
             this.search();
         }
    };

    handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            this.search();
        }
    };

    

    search = () => {
        console.log('Search triggered:', this.state.searchQuery);
        const { searchQuery } = this.state;
        if (searchQuery.trim() !== '') {
            this.props.onSearch(searchQuery.trim());
        }
    };

    render() {
        return (
            <div>
                <input
                    type='text'
                    id='search'
                    value={this.state.searchQuery}
                    onChange={this.handleInputChange}
                    onKeyUp={this.handleKeyUp}
                    placeholder='Search...'
                ></input>
                
            </div>
        );
    }
}

export default SearchBar;

