import React from 'react';
import SearchComponent from "../../components/searchComponent/SearchComponent.jsx";
import "./SearchPage.css"

function Search() {
    return (
        <div className="page-wrapper">
        <section className="outer-container">
            <div className="inner-container">
            <h1>Search for National Parks</h1>
            <SearchComponent/>
        </div>
        </section>
        </div>
    );
}

export default Search;