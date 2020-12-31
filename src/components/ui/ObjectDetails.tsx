import "./ObjectDetails.scss";
import React, { useMemo } from "react";
import { AstronomicalObject } from "../../interfaces";
import { useTranslation, getI18n } from "react-i18next";
import {
  getObjectName,
  getShortDescription,
  getWikiLink,
  getOrbitalPosition,
  getPeriod,
  getRelativeCoordinates,
} from "../../utilities";
import Switch from "react-switch";
import { RootState } from "../../redux/store";
import { setKeepCentered } from "../../redux/actionCreators";
import { ConnectedProps, connect } from "react-redux";

const mapStateToProps = (state: RootState) => ({
  keepCentered: state.objectInfo.keepCentered,
  displayTime: state.time.displayTime,
});

const mapDispatchToProps = {
  setKeepCentered,
};

interface ObjectDetailsProps {
  object: AstronomicalObject;
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & ObjectDetailsProps;

export const ObjectDetails = connector(({ object, keepCentered, setKeepCentered, displayTime }: Props) => {
  const { t } = useTranslation();
  const { language } = getI18n();

  const {
    semiMajorAxis,
    eccentricity,
    eccentricAnomaly,
    meanAnomaly,
    trueAnomaly,
    longitudeOfPeriapsis,
  } = useMemo(() => getOrbitalPosition(object.orbit, displayTime), [object, displayTime]);

  const { distanceFromParent } = useMemo(
    () =>
      getRelativeCoordinates(
        semiMajorAxis,
        eccentricity,
        eccentricAnomaly,
        trueAnomaly,
        longitudeOfPeriapsis
      ),
    [semiMajorAxis, eccentricity, eccentricAnomaly, trueAnomaly, longitudeOfPeriapsis]
  );

  const objectName = getObjectName(object.id, t);

  return (
    <div className="object-details">
      <img
        src="https://picsum.photos/320/240"
        width="100%"
        height="240px"
        alt={objectName}
        title={objectName}
      />
      {/* Name, description, wiki link */}
      <div className="info-text">
        <h2>{objectName}</h2>
        <h3 className="short-description">{getShortDescription(object, t)}</h3>
        <p className="long-description">
          <a href={getWikiLink(object, t, language)} target="_blank" rel="noreferrer">
            {t("wikipedia")}
          </a>
        </p>
      </div>

      <hr />

      <label className="keep-centered-toggle">
        {t("keepCentered")}
        <Switch onChange={setKeepCentered} checked={keepCentered}></Switch>
      </label>

      <hr />

      {/* Orbital stats */}
      <div className="info-text">
        <h2 className="orbital-stats-header">{t("orbitalStats")}</h2>
        <dl>
          {object.parent && <dt>{t("distanceFrom") + " " + getObjectName(object.parent.id, t)}</dt>}
          {object.parent && <dd>{Math.round(distanceFromParent).toLocaleString()} km</dd>}
          <dt>{t("period")}</dt>
          <dd>{getPeriod(object.orbit).toFixed(2) + " " + t("days")}</dd>
          <dt>{t("eccentricity")}</dt>
          <dd>{eccentricity.toFixed(5)}</dd>
          <dt>{t("meanAnomaly")}</dt>
          <dd>{meanAnomaly.toFixed(2)}°</dd>
          <dt>{t("trueAnomaly")}</dt>
          <dd>{trueAnomaly.toFixed(2)}°</dd>
        </dl>
      </div>
    </div>
  );
});
