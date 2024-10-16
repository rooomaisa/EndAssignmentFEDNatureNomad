import React from 'react';
import SearchComponent from "../../components/searchComponent/SearchComponent.jsx";

function Search() {
    return (
        <div className={'page-container'}>
            <h1>Search for National Parks</h1>
            <SearchComponent>
            </SearchComponent>
        </div>
    );
}

export default Search;