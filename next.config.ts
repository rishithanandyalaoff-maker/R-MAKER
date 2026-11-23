import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

/** Project site on GitHub Pages: https://rishithanandyalaoff-maker.github.io/R-MAKER/ */
const repoBase = "/R-MAKER";

const nextConfig: NextConfig = {
  output: "export",
  basePath: repoBase,
  assetPrefix: repoBase,
  images: { unoptimized: true },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  trailingSlash: true,
};

export default withMDX(nextConfig);
