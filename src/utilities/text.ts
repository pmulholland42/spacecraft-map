import { ObjectType } from "../interfaces/ObjectType";
import { AstronomicalObject } from "../interfaces";
import { TFunction } from "i18next";

/**
 * Gets the localized name of an object
 * @param objectId The id of the object
 * @param t i18n function
 */
export const getObjectName = (objectId: string, t: TFunction) => {
  return t("solarSystemObjects." + objectId);
};

/**
 * Gets the localized name of the object type.
 * For example, "Star", "Planet", or "Moon"
 * @param objectType The object type
 * @param t i18n function
 */
export const getObjectTypeName = (objectType: ObjectType, t: TFunction) => {
  switch (objectType) {
    case "dwarf":
      return t("objectTypes.dwarfPlanet");
    default:
      return t("objectTypes." + objectType);
  }
};

/**
 * Returns a short, localized text description for an object.
 * For example, "Star", "Planet orbiting Sun" or "Moon orbiting Jupiter".
 * @param object The object to get the description for
 * @param t i18n function
 */
export const getShortDescription = (object: AstronomicalObject, t: TFunction) => {
  if (object.parent === undefined) {
    return getObjectTypeName(object.type, t);
  } else {
    return `${getObjectTypeName(object.type, t)} ${t("orbiting")} ${getObjectName(object.parent.id, t)}`;
  }
};

/**
 * Returns the URL of the object's wikipedia page
 * @param object The object to get the URL for
 * @param t i18n function
 * @param language The i18n language code (e.g. "en")
 */
export const getWikiLink = (object: AstronomicalObject, t: TFunction, language: string) => {
  if (language.includes("-")) {
    language = language.split("-")[0];
  }
  return `https://${language}.wikipedia.org/wiki/${getObjectName(object.id, t)}_(${getObjectTypeName(
    object.type,
    t
  )})`;
};
