import React from "react";
import "./SearchSuggestion.scss";
import { AstronomicalObject } from "../../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobeAmericas,
  faStar,
  faMoon,
  faQuestion,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { getObjectName, getShortDescription } from "../../../utilities";

interface SearchSuggestionProps {
  object: AstronomicalObject;
  onSelect: (selectedObject: AstronomicalObject) => void;
  highlighted: boolean;
}

export const SearchSuggestion = ({ object, onSelect, highlighted }: SearchSuggestionProps) => {
  const { t } = useTranslation();

  let icon: IconDefinition;
  let iconSize: "lg" | "1x" = "lg";

  switch (object.type) {
    case "planet":
      icon = faGlobeAmericas;
      break;
    case "star":
      icon = faStar;
      break;
    case "moon":
      icon = faMoon;
      break;
    case "dwarf":
      icon = faGlobeAmericas;
      iconSize = "1x";
      break;
    default:
      icon = faQuestion;
      break;
  }

  const onClick = () => {
    onSelect(object);
  };

  return (
    <div className={highlighted ? "selected-search-suggestion" : "search-suggestion"} onClick={onClick}>
      <div className="search-suggestion-icon">
        <FontAwesomeIcon icon={icon} size={iconSize} />
      </div>
      <div className="search-suggestion-text">
        <span className="search-suggestion-name">{getObjectName(object.id, t)}</span>
        <span className="search-suggestion-type">{getShortDescription(object, t)}</span>
      </div>
    </div>
  );
};
