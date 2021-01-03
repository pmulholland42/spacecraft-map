import "./SearchBar.scss";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import solarSystem from "../../data/solarSystem";
import { SearchSuggestion } from "./SearchSuggestion";
import { useTranslation } from "react-i18next";
import { AstronomicalObject } from "../../interfaces";
import { getObjectName } from "../../utilities";
import { setSelectedObject, setDetailsPaneOpen, setOptionsPaneOpen } from "../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../redux/store";

const mapStateToProps = (state: RootState) => ({
  selectedObject: state.objectInfo.selectedObject,
  detailsPaneOpen: state.ui.detailsPaneOpen,
});
const mapDispatchToProps = {
  setSelectedObject,
  setDetailsPaneOpen,
  setOptionsPaneOpen,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

/**
 * Search bar with a dropdown search suggestions list.
 * Used to search for astronomical objects on the map.
 * Controls the results pane and options pane.
 */
export const SearchBar = connector(
  ({
    detailsPaneOpen,
    setDetailsPaneOpen,
    setOptionsPaneOpen,
    selectedObject,
    setSelectedObject,
  }: PropsFromRedux) => {
    const [searchText, setSearchText] = useState("");
    const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);

    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const { t } = useTranslation();

    const searchSuggestions = useMemo(() => {
      return solarSystem.filter((object) => object.id.includes(searchText.toLowerCase()));
    }, [searchText]);

    const showCloseButton = detailsPaneOpen || searchText.length > 0;
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

    useEffect(() => {
      // When a new object is selected, put its name in the search bar
      if (selectedObject !== null) {
        setSearchText(getObjectName(selectedObject.id, t));
      }
    }, [selectedObject, t]);

    const onCloseButtonClick = () => {
      setSearchText("");
      setDetailsPaneOpen(false);
    };

    /**
     * Sets the object as selected, closes search suggestions, and opens the details pane
     * @param object
     */
    const selectObject = (object: AstronomicalObject | null) => {
      setSelectedObject(object);
      setShowSearchSuggestions(false);
      setDetailsPaneOpen(true);
    };

    const onSearchButtonClick = () => {
      if (searchText.length > 0) {
        // If there is text in the box, clicking the search button will open the details pane
        if (searchSuggestions.length > 0) {
          selectObject(searchSuggestions[0]);
        } else {
          selectObject(null);
        }
      } else if (inputRef.current !== null) {
        // Otherwise, focus the search bar input
        inputRef.current.focus();
      }
    };

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && searchText.length > 0) {
        if (searchSuggestions.length > 0) {
          selectObject(searchSuggestions[0]);
        } else {
          selectObject(null);
        }
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
          <div className="search-bar-button" onClick={() => setOptionsPaneOpen(true)}>
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
            <SearchSuggestion key={object.id} object={object} onSelect={selectObject} />
          ))}
      </div>
    );
  }
);
