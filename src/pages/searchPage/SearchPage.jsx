import React from 'react';
import SearchComponent from "../../components/searchComponent/SearchComponent.jsx";

function Search() {
    return (
        <section className="outer-container">
            <div className="inner-container">
            <h1>Search for National Parks</h1>
            <SearchComponent/>
        </div>
        </section>
    );
}

export default Search;