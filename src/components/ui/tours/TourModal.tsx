import "./TourModal.scss";
import React from "react";
import { setTourModalOpen } from "../../../redux/actionCreators";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { useSpring, animated } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { tours } from "../../../data/tours";

const mapStateToProps = (state: RootState) => ({
  tourModalOpen: state.ui.tourModalOpen,
});

const mapDispatchToProps = {
  setTourModalOpen,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TourModal = connector(({ tourModalOpen, setTourModalOpen }: PropsFromRedux) => {
  const props = useSpring({ opacity: tourModalOpen ? 1 : 0 });
  const { t } = useTranslation();
  return (
    <animated.div style={props} className="tour-modal-container">
      <div className="tour-modal">
        <div className="tour-modal-header">
          <h3>{t("tours")}</h3>
          <button onClick={() => setTourModalOpen(false)} className="close-button">
            <FontAwesomeIcon icon={faTimes} size={"2x"} />
          </button>
        </div>
        {tours.map((tour) => (
          <button
            className="tour"
            onClick={() => {
              setTourModalOpen(false);
              tour.startTour();
            }}
          >
            {tour.name}
          </button>
        ))}
      </div>
    </animated.div>
  );
});
