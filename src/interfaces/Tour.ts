import { TFunction } from "i18next";

export interface Tour {
  title: string;
  runTour: (t: TFunction) => Promise<boolean>;
}
