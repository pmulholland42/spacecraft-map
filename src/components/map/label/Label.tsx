import "./Label.scss";
import React from "react";
import { useTranslation } from "react-i18next";
import { getObjectName } from "../../../utilities";

interface LabelProps {
  objectId: string;
}

export const Label = ({ objectId }: LabelProps) => {
  const { t } = useTranslation();
  return <div className="label-text">{getObjectName(objectId, t)}</div>;
};
