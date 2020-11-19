import "./OptionsPane.css";
import {
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

interface OptionsPaneProps {
  isOpen: boolean;
  closeOptionsPane: () => void;
}

const mapStateToProps = (state: RootState) => ({
  showOrbits: state.options.showOrbits,
  showLabels: state.options.showLabels,
  showBackgroundStars: state.options.showBackgroundStars,
  showDebugInfo: state.options.showDebugInfo,
});

const mapDispatchToProps = {
  setShowOrbits,
  setShowLabels,
  setShowBackgroundStars,
  setShowDebugInfo,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & OptionsPaneProps;

export const OptionsPane = connector(
  ({
    isOpen,
    closeOptionsPane,
    showOrbits,
    showLabels,
    showBackgroundStars,
    showDebugInfo,
    setShowOrbits,
    setShowLabels,
    setShowBackgroundStars,
    setShowDebugInfo,
  }: Props) => {
    const { t } = useTranslation();

    const transitions = useTransition(isOpen, null, {
      from: { left: -322 },
      enter: { left: 0 },
      leave: { left: -322 },
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
                  <h3>Options</h3>
                  <div className="options-pane-close-button" onClick={() => closeOptionsPane()}>
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
