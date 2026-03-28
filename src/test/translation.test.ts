import { describe, it, expect } from "vitest";
import { translateArray } from "../lib/translation-utils";

describe("translation-utils", () => {
  it("should translateArray with fallback", () => {
    const data = {
      pros: ["Good", "Very Good"],
      pros_en: ["Excellent"]
    };

    expect(translateArray(data, 'pros', 'th')).toEqual(["Good", "Very Good"]);
    expect(translateArray(data, 'pros', 'en')).toEqual(["Excellent"]);
  });

  it("should translateArray with missing English version", () => {
    const data = {
      pros: ["Good", "Very Good"]
    };

    expect(translateArray(data, 'pros', 'en')).toEqual(["Good", "Very Good"]);
  });
});
