import { describe, expect, it } from "vitest";
import { filterPortfolio, services } from "@/lib/studio";

describe("Studio services and portfolio", () => {
  it("offers exactly the eight requested services", () => {
    expect(services.map((service) => service.name)).toEqual(["TVC Production", "OVC Production", "Video Production", "Photography", "Digital Content Creation", "Event Production", "Model Management", "Media Management"]);
  });
  it("returns only matching work for a portfolio category", () => {
    expect(filterPortfolio("Award & Creator Platform").map((item) => item.title)).toEqual([
      "BCCA Awards 2026",
      "BCCA Award 2026",
    ]);
    expect(filterPortfolio("All work")).toHaveLength(2);
    expect(filterPortfolio("Unknown")).toHaveLength(0);
  });
});