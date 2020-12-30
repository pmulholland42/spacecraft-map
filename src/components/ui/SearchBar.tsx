import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import solarSystem from "../../data/solarSystem";
import "./SearchBar.scss";
import { SearchSuggestion } from "./SearchSuggestion";
import { useTranslation } from "react-i18next";
import { AstronomicalObject } from "../../interfaces";
import { getObjectName } from "../../utilities";

interface SearchBarProps {
  /** Called when the user searches, by clicking the search button or hitting enter */
  onSearch: (searchText: string) => void;
  /** Called when the close button is clicked */
  onClose: () => void;
  /** Called when the user selects a search suggestion from the dropdown list */
  onSelect: (object: AstronomicalObject) => void;
  /** Called when the user clicks the hamburger menu button */
  onMenuClick: () => void;
  /** Is the results pane open? */
  resultsPaneOpen: boolean;
}

/**
 * Search bar with a dropdown search suggestions list.
 * Used to search for astronomical objects on the map.
 * Controls the results pane and options pane.
 */
export const SearchBar = ({ onSearch, onClose, onSelect, onMenuClick, resultsPaneOpen }: SearchBarProps) => {
  const [searchText, setSearchText] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();

  const searchSuggestions = useMemo(() => {
    return solarSystem.filter((object) => object.id.includes(searchText.toLowerCase()));
  }, [searchText]);

  const showCloseButton = resultsPaneOpen || searchText.length > 0;
  const borderBottomRadius =
    showSearchSuggestions && searchText.length > 0 && searchSuggestions.length > 0 ? 0 : undefined;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current !== null && !containerRef.current.contains(event.target as Node)) {
        // When the user clicks outside the search bar or search results, hide the search suggestions
        setShowSearchSuggestions(false);
      } else if (inputRef.current !== null && inputRef.current.contains(event.target as Node)) {
        // Stop hiding the search suggestions if they click into the text box again
        setShowSearchSuggestions(true);
      }
    };

    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [setShowSearchSuggestions]);

  const onCloseButtonClick = () => {
    setSearchText("");
    onClose();
  };

  const search = () => {
    setShowSearchSuggestions(false);
    onSearch(searchText);
  };

  const onSearchButtonClick = () => {
    if (searchText.length > 0) {
      // If there is text in the box, clicking the search button will bring up the search results
      search();
    } else if (inputRef.current !== null) {
      // Otherwise, focus the search bar input
      inputRef.current.focus();
    }
  };

  const onSuggestionSelect = (selectedObject: AstronomicalObject) => {
    setShowSearchSuggestions(false);
    setSearchText(t(getObjectName(selectedObject.id)));
    onSelect(selectedObject);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchText.length > 0) {
      search();
    } else if (!showSearchSuggestions) {
      // If the user starts typing, search suggestions should be shown
      setShowSearchSuggestions(true);
    }
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <div
        className="search-bar"
        style={{
          borderBottomLeftRadius: borderBottomRadius,
          borderBottomRightRadius: borderBottomRadius,
        }}
      >
        <div className="search-bar-button" onClick={onMenuClick}>
          <FontAwesomeIcon icon={faBars} size={"lg"} />
        </div>
        <input
          className="search-bar-text-input"
          style={{ flex: searchText.length > 0 ? 4 : 5 }}
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder={t("searchTheSolarSystem")}
          onKeyDown={onKeyDown}
          ref={inputRef}
        />
        <div className="search-bar-button" onClick={onSearchButtonClick}>
          <FontAwesomeIcon icon={faSearch} size={"lg"} />
        </div>
        {showCloseButton && (
          <div className="search-bar-button" onClick={onCloseButtonClick}>
            <FontAwesomeIcon icon={faTimes} size={"lg"} />
          </div>
        )}
      </div>
      {showSearchSuggestions &&
        searchText.length > 0 &&
        searchSuggestions.map((object) => (
          <SearchSuggestion key={object.id} object={object} onSelect={onSuggestionSelect} />
        ))}
    </div>
  );
};
