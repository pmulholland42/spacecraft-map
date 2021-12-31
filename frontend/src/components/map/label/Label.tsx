import "./Label.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { getObjectName } from "../../../utilities";

interface LabelProps {
  objectId: string;
  onClick: () => void;
}

export const Label = ({ objectId, onClick }: LabelProps) => {
  const { t } = useTranslation();
  return (
    <div className="label-text" onClick={onClick}>
      {getObjectName(objectId, t)}
    </div>
  );
};
