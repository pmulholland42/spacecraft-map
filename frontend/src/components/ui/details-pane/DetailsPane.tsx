import "./DetailsPane.scss";
import React from "react";
import { animated, useTransition } from "react-spring";
import { connect, ConnectedProps } from "react-redux";
import { RootState } from "../../../redux/store";
import { useTranslation } from "react-i18next";

import { ObjectDetails } from "./ObjectDetails";
import { getPausedTimeStepIndex } from "../../../utilities";
import { timeSteps } from "../../../constants";

const mapStateToProps = (state: RootState) => ({
  selectedObject: state.objectInfo.selectedObject,
  open: state.ui.detailsPaneOpen,
  removeAnimations: state.options.removeAnimations,
  timeStepIndex: state.time.timeStepIndex,
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const DetailsPane = connector(
  ({ open, selectedObject, removeAnimations, timeStepIndex }: PropsFromRedux) => {
    const transitions = useTransition(open, null, {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 },
      immediate: removeAnimations || timeStepIndex !== getPausedTimeStepIndex(timeSteps),
    });

    const { t } = useTranslation();

    return (
      <div>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div key={key} className="details-pane" style={props}>
                {selectedObject !== null ? (
                  <ObjectDetails object={selectedObject} />
                ) : (
                  <div>{t("noResults")}</div>
                )}
              </animated.div>
            )
        )}
      </div>
    );
  }
);
