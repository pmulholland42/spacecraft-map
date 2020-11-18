import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import solarSystem from "../../data/solarSystem";
import "./SearchBar.css";
import { SearchSuggestion } from "./SearchSuggestion";

export const SearchBar = () => {
  const [searchText, setSearchText] = useState("");

  const searchSuggestions = useMemo(() => {
    return solarSystem.filter((object) => object.id.includes(searchText.toLowerCase()));
  }, [searchText]);

  const showSearchSuggestions = searchText.length > 0 && searchSuggestions.length > 0;
  const borderBottomRadius = showSearchSuggestions ? 0 : undefined;

  return (
    <div className="search-bar-container">
      <div
        className="search-bar"
        style={{
          borderBottomLeftRadius: borderBottomRadius,
          borderBottomRightRadius: borderBottomRadius,
        }}
      >
        <div className="search-bar-button">
          <FontAwesomeIcon icon={faBars} size={"lg"} />
        </div>
        <input
          className="search-bar-text-input"
          style={{ flex: searchText.length > 0 ? 4 : 5 }}
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={"Search the solar system"}
        />
        <div className="search-bar-button">
          <FontAwesomeIcon icon={faSearch} size={"lg"} />
        </div>
        {searchText.length > 0 && (
          <div className="search-bar-button" onClick={() => setSearchText("")}>
            <FontAwesomeIcon icon={faTimes} size={"lg"} />
          </div>
        )}
      </div>
      {showSearchSuggestions && searchSuggestions.map((object) => <SearchSuggestion object={object} />)}
    </div>
  );
};
