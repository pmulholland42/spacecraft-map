import React from "react";
import { AstronomicalObject } from "../../interfaces";
import { useTranslation } from "react-i18next";
import { getObjectName } from "../../utilities";

interface ObjectDetailsProps {
  object: AstronomicalObject;
}

export const ObjectDetails = ({ object }: ObjectDetailsProps) => {
  const { t } = useTranslation();

  return <div>{t(getObjectName(object.id))} details</div>;
};
