import { AstronomicalObject } from "./AstronomicalObject";

export interface ITextBubble {
  id: string;
  text: string;
  object: AstronomicalObject;
}
