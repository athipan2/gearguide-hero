import { describe, it, expect } from "vitest";
import { translateArray, translateData } from "../lib/translation-utils";

describe("translation-utils", () => {
  describe("translateArray", () => {
    it("should return English when language is EN and EN data exists", () => {
      const data = {
        pros: ["ดี"],
        pros_en: ["Good"]
      };
      expect(translateArray(data, 'pros', 'en')).toEqual(["Good"]);
    });

    it("should fallback to Thai when language is EN but EN data is empty", () => {
      const data = {
        pros: ["ดี"],
        pros_en: []
      };
      expect(translateArray(data, 'pros', 'en')).toEqual(["ดี"]);
    });

    it("should return Thai when language is TH and TH data exists", () => {
      const data = {
        pros: ["ดี"],
        pros_en: ["Good"]
      };
      expect(translateArray(data, 'pros', 'th')).toEqual(["ดี"]);
    });

    it("should fallback to English when language is TH but TH data is empty", () => {
      const data = {
        pros: [],
        pros_en: ["Good"]
      };
      expect(translateArray(data, 'pros', 'th')).toEqual(["Good"]);
    });
  });

  describe("translateData", () => {
    it("should return English when language is EN and EN data exists", () => {
      const data = {
        name: "ชื่อ",
        name_en: "Name"
      };
      expect(translateData(data, 'name', 'en')).toBe("Name");
    });

    it("should fallback to Thai when language is EN but EN data is empty string", () => {
      const data = {
        name: "ชื่อ",
        name_en: ""
      };
      expect(translateData(data, 'name', 'en')).toBe("ชื่อ");
    });
  });
});
