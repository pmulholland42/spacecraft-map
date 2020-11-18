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
import { setSelectedObject } from "../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";

interface SearchSuggestionProps {
  object: AstronomicalObject;
  onSelect: () => void;
}

const mapDispatchToProps = {
  setSelectedObject,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = SearchSuggestionProps & PropsFromRedux;

export const SearchSuggestion = connector(({ object, onSelect, setSelectedObject }: Props) => {
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
    setSelectedObject(object);
    onSelect();
  };

  return (
    <div className="search-suggestion" onClick={onClick}>
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
});
