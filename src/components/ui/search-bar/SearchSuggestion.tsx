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
}

export const SearchSuggestion = ({ object, onSelect }: SearchSuggestionProps) => {
  const { t } = useTranslation();

  let icon: IconDefinition;

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
    default:
      icon = faQuestion;
      break;
  }

  const onClick = () => {
    onSelect(object);
  };

  return (
    <div className="search-suggestion" onClick={onClick}>
      <div className="search-suggestion-icon">
        <FontAwesomeIcon icon={icon} size={"lg"} />
      </div>
      <div className="search-suggestion-text">
        <span className="search-suggestion-name">{getObjectName(object.id, t)}</span>
        <span className="search-suggestion-type">{getShortDescription(object, t)}</span>
      </div>
    </div>
  );
};
