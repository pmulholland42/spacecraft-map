import "./OptionsPane.scss";
import {
  setOptionsPaneOpen,
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
  setShowDebugInfo,
} from "../../redux/actionCreators";
import { RootState } from "../../redux/store";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { animated, useTransition } from "react-spring";
import Switch from "react-switch";

const mapStateToProps = (state: RootState) => ({
  open: state.ui.optionsPaneOpen,
  showOrbits: state.options.showOrbits,
  showLabels: state.options.showLabels,
  showBackgroundStars: state.options.showBackgroundStars,
  showDebugInfo: state.options.showDebugInfo,
});

const mapDispatchToProps = {
  setOptionsPaneOpen,
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
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
    showDebugInfo,
    setShowOrbits,
    setShowLabels,
    setShowBackgroundStars,
    setShowDebugInfo,
  }: PropsFromRedux) => {
    const { t } = useTranslation();

    const transitions = useTransition(open, null, {
      from: { left: -322 },
      enter: { left: 0 },
      leave: { left: -322 },
      config: { tension: 250, clamp: true },
    });

    const toggleOrbits = (checked: boolean) => {
      setShowOrbits(checked);
    };
    const toggleLabels = (checked: boolean) => {
      setShowLabels(checked);
    };
    const toggleBackgroundStars = (checked: boolean) => {
      setShowBackgroundStars(checked);
    };
    const toggleDebugInfo = (checked: boolean) => {
      setShowDebugInfo(checked);
    };

    return (
      <div>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <animated.div key={key} className="options-pane" style={props}>
                <span className="options-pane-titlebar">
                  <h3>{t("options")}</h3>
                  <div className="options-pane-close-button" onClick={() => setOptionsPaneOpen(false)}>
                    <FontAwesomeIcon icon={faAngleDoubleLeft} size={"lg"} />
                  </div>
                </span>
                <hr className="options-pane-divider" />
                <div className="options-list">
                  <label className="option">
                    {t("showOrbits")}
                    <Switch onChange={toggleOrbits} checked={showOrbits} />
                  </label>
                  <label className="option">
                    {t("showLabels")}
                    <Switch onChange={toggleLabels} checked={showLabels} />
                  </label>
                  <label className="option">
                    {t("showBackgroundStars")}
                    <Switch onChange={toggleBackgroundStars} checked={showBackgroundStars} />
                  </label>
                  <label className="option">
                    {t("showDebugInfo")}
                    <Switch onChange={toggleDebugInfo} checked={showDebugInfo} />
                  </label>
                </div>
              </animated.div>
            )
        )}
      </div>
    );
  }
);
