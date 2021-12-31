import "./TourButton.scss";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { setTourModalOpen } from "../../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../redux/store";

const mapStateToProps = (state: RootState) => ({
  currentTour: state.ui.currentTour,
});

const mapDispatchToProps = {
  setTourModalOpen,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TourButton = connector(({ currentTour, setTourModalOpen }: PropsFromRedux) => {
  const { t } = useTranslation();

  const buttonLabel = t(currentTour?.title ?? "takeATour");

  return (
    <button
      className="tour-button"
      onClick={() => setTourModalOpen(true)}
      disabled={currentTour !== null}
      title={buttonLabel}
    >
      <FontAwesomeIcon icon={faCompass} size={"2x"} />
      <p className="tour-button-text">{buttonLabel}</p>
    </button>
  );
});
