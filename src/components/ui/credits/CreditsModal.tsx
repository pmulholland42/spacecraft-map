import "./CreditsModal.scss";
import React from "react";
import { setCreditsModalOpen } from "../../../redux/actionCreators";
import { RootState } from "../../../redux/store";
import { connect, ConnectedProps } from "react-redux";
import { animated, useTransition } from "react-spring";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { getPausedTimeStepIndex } from "../../../utilities";
import { timeSteps } from "../../../constants";
import Collapsible from "react-collapsible";

const mapStateToProps = (state: RootState) => ({
  creditsModalOpen: state.ui.creditsModalOpen,
  removeAnimations: state.options.removeAnimations,
  timeStepIndex: state.time.timeStepIndex,
});

const mapDispatchToProps = {
  setCreditsModalOpen,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const CreditsModal = connector(
  ({ creditsModalOpen, setCreditsModalOpen, removeAnimations, timeStepIndex }: PropsFromRedux) => {
    const transitions = useTransition(creditsModalOpen, null, {
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
              <animated.div key={key} style={props} className="modal-container">
                <div className="modal">
                  <div className="modal-header">
                    <h3>{t("about")}</h3>
                    <button
                      onClick={() => setCreditsModalOpen(false)}
                      className="modal-close-button"
                      title={t("closeModal")}
                    >
                      <FontAwesomeIcon icon={faTimes} size={"2x"} />
                    </button>
                  </div>
                  <div className="info-section">
                    <p>
                      {t("siteCreatedBy")}&nbsp;
                      <a href="https://github.com/pmulholland42" target="_blank" rel="noreferrer nofollow">
                        Peter Mulholland
                      </a>
                    </p>
                  </div>
                  <div className="info-section">
                    <Collapsible trigger={t("howToUse")}>
                      <p>{t("usageInstructions")}</p>
                    </Collapsible>
                  </div>
                  <div className="info-section">
                    <Collapsible trigger={t("inaccuracies")}>
                      <p>...</p>
                    </Collapsible>
                  </div>
                  <div className="info-section">
                    <Collapsible trigger="MIT License">
                      <p>Copyright (c) 2018 Peter Mulholland</p>
                      <p>
                        Permission is hereby granted, free of charge, to any person obtaining a copy of this
                        software and associated documentation files (the "Software"), to deal in the Software
                        without restriction, including without limitation the rights to use, copy, modify,
                        merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
                        permit persons to whom the Software is furnished to do so, subject to the following
                        conditions: The above copyright notice and this permission notice shall be included in
                        all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS",
                        WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
                        WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
                        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
                        OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                        SOFTWARE.
                      </p>
                    </Collapsible>
                  </div>
                </div>
              </animated.div>
            )
        )}
      </div>
    );
  }
);
