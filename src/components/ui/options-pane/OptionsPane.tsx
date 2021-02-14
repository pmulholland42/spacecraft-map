import "./OptionsPane.scss";
import {
  setOptionsPaneOpen,
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
  setRemoveAnimations,
  setShowDebugInfo,
} from "../../../redux/actionCreators";
import { RootState } from "../../../redux/store";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { animated, useTransition } from "react-spring";
import Switch from "react-switch";
import { timeSteps } from "../../../constants";
import { getPausedTimeStepIndex } from "../../../utilities";

const mapStateToProps = (state: RootState) => ({
  open: state.ui.optionsPaneOpen,
  showOrbits: state.options.showOrbits,
  showLabels: state.options.showLabels,
  showBackgroundStars: state.options.showBackgroundStars,
  removeAnimations: state.options.removeAnimations,
  showDebugInfo: state.options.showDebugInfo,
  timeStepIndex: state.time.timeStepIndex,
});

const mapDispatchToProps = {
  setOptionsPaneOpen,
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
  setRemoveAnimations,
  setShowDebugInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const OptionsPane = connector(
  ({
    open,
    setOptionsPaneOpen,
    showOrbits,
    showLabels,
    showBackgroundStars,
    removeAnimations,
    showDebugInfo,
    setShowOrbits,
    setShowLabels,
    setShowBackgroundStars,
    setRemoveAnimations,
    setShowDebugInfo,
    timeStepIndex,
  }: PropsFromRedux) => {
    const { t } = useTranslation();

    const transitions = useTransition(open, null, {
      from: { left: -322 },
      enter: { left: 0 },
      leave: { left: -322 },
      config: { tension: 250, clamp: true },
      immediate: removeAnimations || timeStepIndex !== getPausedTimeStepIndex(timeSteps),
    });

    return (
      <div>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div key={key} className="options-pane" style={props}>
                <span className="options-pane-titlebar">
                  <h3>{t("options")}</h3>
                  <button
                    className="options-pane-close-button"
                    onClick={() => setOptionsPaneOpen(false)}
                    title={t("closeOptionsPane")}
                  >
                    <FontAwesomeIcon icon={faAngleDoubleLeft} size={"lg"} />
                  </button>
                </span>
                <hr className="options-pane-divider" />
                <div className="options-list">
                  <label className="option" title={t("toggleOrbits")}>
                    {t("showOrbits")}
                    <Switch onChange={setShowOrbits} checked={showOrbits} />
                  </label>
                  <label className="option" title={t("toggleLabels")}>
                    {t("showLabels")}
                    <Switch onChange={setShowLabels} checked={showLabels} />
                  </label>
                  <label className="option" title={t("toggleBackgroundStars")} style={{ display: "none" }}>
                    {t("showBackgroundStars")}
                    <Switch onChange={setShowBackgroundStars} checked={showBackgroundStars} />
                  </label>
                  <label className="option" title={t("toggleAnimations")}>
                    {t("removeAnimations")}
                    <Switch onChange={setRemoveAnimations} checked={removeAnimations} />
                  </label>
                  <label className="option" title={t("toggleDebugInfo")}>
                    {t("showDebugInfo")}
                    <Switch onChange={setShowDebugInfo} checked={showDebugInfo} />
                  </label>
                </div>
              </animated.div>
            )
        )}
      </div>
    );
  }
);
