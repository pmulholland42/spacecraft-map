export interface Photo {
  /** Photo source URL */
  url: string;
  /** Attribution information for copyright purposes */
  attribution?: {
    /** Name of photo creator */
    creator: string;
    /** Name of photo license */
    licenseName: string;
    /** URL of photo license description */
    licenseUrl?: string;
  };
}
