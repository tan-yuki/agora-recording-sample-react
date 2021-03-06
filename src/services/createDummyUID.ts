import { UID } from "agora-rtc-sdk-ng";

export function createDummyUID(): UID {
  const min = 1000000;
  const max = 9999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
