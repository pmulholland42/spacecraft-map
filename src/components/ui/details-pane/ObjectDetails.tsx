import "./ObjectDetails.scss";
import React, { useMemo } from "react";
import { AstronomicalObject } from "../../../interfaces";
import { useTranslation } from "react-i18next";
import {
  getObjectName,
  getShortDescription,
  getOrbitalPosition,
  getPeriod,
  getRelativeCoordinates,
  getImagePath,
} from "../../../utilities";
import Switch from "react-switch";
import { RootState } from "../../../redux/store";
import { setKeepCentered } from "../../../redux/actionCreators";
import { ConnectedProps, connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const mapStateToProps = (state: RootState) => ({
  keepCentered: state.objectInfo.keepCentered,
  displayTime: state.time.displayTime,
});

const mapDispatchToProps = {
  setKeepCentered,
};

// The selected object is taken in as a prop and not read directly from redux
// because this allows the parent component to handle the null case, where no object is selected
interface ObjectDetailsProps {
  /** The object for which to show details */
  object: AstronomicalObject;
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & ObjectDetailsProps;

export const ObjectDetails = connector(({ object, keepCentered, setKeepCentered, displayTime }: Props) => {
  const { t } = useTranslation();

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
        src={getImagePath(object.photo.url)}
        width="320px"
        height="170px"
        alt={objectName}
        title={objectName}
      />
      {object.photo.attribution && (
        <div className="attribution">
          {`${t("photoBy")} ${object.photo.attribution.creator}, `}
          <a
            target="_blank"
            rel="noreferrer nofollow"
            href={object.photo.attribution.licenseUrl}
            title={object.photo.attribution.licenseName}
          >
            {object.photo.attribution.licenseName}
          </a>
        </div>
      )}

      {/* Name, description, wiki link */}
      <div className="info-text">
        <h2>{objectName}</h2>
        <h3 className="short-description">{getShortDescription(object, t)}</h3>
        <p className="long-description">
          <a href={object.wikiURL} target="_blank" rel="noreferrer nofollow">
            {t("wikipedia")} <FontAwesomeIcon icon={faExternalLinkAlt} size={"sm"} />
          </a>
        </p>
      </div>

      <hr />

      <label className="keep-centered-toggle" title={t("toggleKeepCentered")}>
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
