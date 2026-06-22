"use client";

import { useParams, notFound } from "next/navigation";
import DevUtils from "@/components/DevUtils";

const VALID_TOOLS = [
  "markdown", "html", "number-base", "diff", "json", "jwt", "timestamp", "uuid", "base64", "hash",
  "cron-parser", "yaml-json", "yaml-formatter", "makefile-validator", "sql-formatter",
  "php-serializer", "php-json", "curl-code", "csv-json", "json-csv", "json-code",
  "cert-decoder", "cert-generator", "svg-css", "hex-ascii", "string-case", "base64-image",
  "regexp", "html-entity", "backslash", "lorem-ipsum", "html-jsx", "css-minify-beautify",
  "js-minify-beautify", "html-minify-beautify", "k8s-secret-decoder",
  "color-converter", "line-sorter", "url-encoder", "url-parser"
];

export default function ToolPage() {
  const params = useParams();
  const toolId = params.id as string;

  if (!VALID_TOOLS.includes(toolId)) {
    notFound();
  }

  return <DevUtils standalone />;
}
