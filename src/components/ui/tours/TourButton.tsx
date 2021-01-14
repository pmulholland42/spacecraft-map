import "./TourButton.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { setTourModalOpen } from "../../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";

const mapDispatchToProps = {
  setTourModalOpen,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TourButton = connector(({ setTourModalOpen }: PropsFromRedux) => {
  const { t } = useTranslation();

  return (
    <button className="tour-button" onClick={() => setTourModalOpen(true)}>
      <FontAwesomeIcon icon={faCompass} size={"2x"} />
      <p className="tour-button-text">{t("takeATour")}</p>
    </button>
  );
});
