import "./TourModal.scss";
import React from "react";
import { setTourModalOpen, setCurrentTour } from "../../../redux/actionCreators";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { animated, useTransition } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { tours } from "../../../data/tours";

const mapStateToProps = (state: RootState) => ({
  tourModalOpen: state.ui.tourModalOpen,
});

const mapDispatchToProps = {
  setTourModalOpen,
  setCurrentTour,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TourModal = connector(({ tourModalOpen, setTourModalOpen, setCurrentTour }: PropsFromRedux) => {
  const transitions = useTransition(tourModalOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });
  const { t } = useTranslation();
  return (
    <div>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props} className="tour-modal-container">
              <div className="tour-modal">
                <div className="tour-modal-header">
                  <h3>{t("tours")}</h3>
                  <button onClick={() => setTourModalOpen(false)} className="close-button">
                    <FontAwesomeIcon icon={faTimes} size={"2x"} />
                  </button>
                </div>
                {tours.map((tour, index) => (
                  <button
                    key={index}
                    className="tour"
                    onClick={async () => {
                      setTourModalOpen(false);
                      setCurrentTour(tour);
                      await tour.runTour(t);
                      setCurrentTour(null);
                    }}
                  >
                    {t(tour.title)}
                  </button>
                ))}
              </div>
            </animated.div>
          )
      )}
    </div>
  );
});
