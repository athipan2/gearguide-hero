import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionRenderer } from "../components/review/SectionRenderer";
import { ReviewData, ReviewSectionData } from "../types/review";
import { BrowserRouter, MemoryRouter } from "react-router-dom";

// Mock the hooks
vi.mock("@/hooks/useTranslation", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: "th",
  }),
}));

const mockReview: ReviewData = {
  name: "Test Shoe",
  brand: "Test Brand",
  category: "Road Running",
  price: "฿5,000",
  image_url: null,
  images: [],
  badge: null,
  overall_rating: 4.5,
  ratings: [],
  specs: [
    { label: "ระยะดรอป", value: "5 mm" },
    { label: "ระยะที่แนะนำ", value: "มาราธอน" },
    { label: "เหมาะกับ", value: "คนเท้าปกติ" },
    { label: "ความสูงส้น", value: "30 mm" }
  ],
  pros: ["Good cushion"],
  cons: ["Expensive"],
  verdict: "Great shoe",
  intro: "Intro text",
  sections: [],
  affiliate_url: null,
  cta_text: "Buy Now"
};

describe("SectionRenderer Filtering", () => {
  it("should filter out 'ระยะดรอป' but keep 'ระยะที่แนะนำ' and 'เหมาะกับ'", () => {
    const section: ReviewSectionData = { type: "quick_decision" };

    const { queryByText } = render(
      <BrowserRouter>
        <SectionRenderer section={section} review={mockReview} />
      </BrowserRouter>
    );

    // "มาราธอน" should be present (from ระยะที่แนะนำ)
    expect(queryByText("มาราธอน")).not.toBeNull();
    // "คนเท้าปกติ" should be present (from เหมาะกับ)
    expect(queryByText("คนเท้าปกติ")).not.toBeNull();
    // "5 mm" should NOT be present (from ระยะดรอป)
    expect(queryByText("5 mm")).toBeNull();
  });

  it('should filter out English technical specs like Distance/Drop/Stack/Weight', () => {
    const mockReviewWithEnglishSpecs = {
      ...mockReview,
      specs: [
        { label: 'Suitable for', value: 'Marathon' },
        { label: 'Distance', value: '42.2km' },
        { label: 'Drop', value: '8mm' },
        { label: 'Stack Height', value: '33mm' },
        { label: 'Weight', value: '250g' },
      ]
    };

    const section: ReviewSectionData = {
      id: 'who_is_this_for',
      type: 'who_is_this_for'
    };

    render(
      <MemoryRouter>
        <SectionRenderer section={section} review={mockReviewWithEnglishSpecs as any} />
      </MemoryRouter>
    );

    const suitabilityList = screen.getAllByRole('list')[0];

    // Should keep
    expect(suitabilityList).toHaveTextContent('Marathon');
    expect(suitabilityList).toHaveTextContent('42.2km');

    // Should filter out
    expect(suitabilityList).not.toHaveTextContent('8mm');
    expect(suitabilityList).not.toHaveTextContent('33mm');
    expect(suitabilityList).not.toHaveTextContent('250g');
  });
});
