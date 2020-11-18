import { ObjectType } from "../interfaces/ObjectType";

/**
 * Gets the i18n key for an object
 * @param objectId The id of the object
 */
export const getObjectName = (objectId: string) => {
  return "solarSystemObjects." + objectId;
};

/**
 * Gets the i18n key for an object type
 * @param objectType The object type
 */
export const getObjectTypeName = (objectType: ObjectType) => {
  switch (objectType) {
    case "dwarf":
      return "objectTypes.dwarfPlanet";
    default:
      return "objectTypes." + objectType;
  }
};
