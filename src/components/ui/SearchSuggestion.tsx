import React from "react";
import "./SearchSuggestion.css";
import { AstronomicalObject } from "../../interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobeAmericas,
  faStar,
  faMoon,
  faQuestion,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { getObjectName, getObjectTypeName } from "../../utilities";

interface SearchSuggestionProps {
  object: AstronomicalObject;
}

export const SearchSuggestion = ({ object }: SearchSuggestionProps) => {
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

  return (
    <div className="search-suggestion">
      <div className="search-suggestion-icon">
        <FontAwesomeIcon icon={icon} size={"lg"} />
      </div>
      <div className="search-suggestion-text">
        <span className="search-suggestion-name">{t(getObjectName(object.id))}</span>
        <span className="search-suggestion-type">
          {t(getObjectTypeName(object.type))}{" "}
          {object.parent && t("orbiting") + " " + t(getObjectName(object.parent.id))}
        </span>
      </div>
    </div>
  );
};
