import "./InfoButton.scss";
import React from "react";
import { setCreditsModalOpen } from "../../../redux/actionCreators";
import { connect, ConnectedProps } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../redux/store";

const mapStateToProps = (state: RootState) => ({
  creditsModalOpen: state.ui.creditsModalOpen,
});

const mapDispatchToProps = {
  setCreditsModalOpen,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const InfoButton = connector(({ creditsModalOpen, setCreditsModalOpen }: PropsFromRedux) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setCreditsModalOpen(!creditsModalOpen)}
      title={t("credits")}
      className="info-button"
    >
      <FontAwesomeIcon icon={faInfoCircle} size={"2x"} color={"white"} />
    </button>
  );
});
