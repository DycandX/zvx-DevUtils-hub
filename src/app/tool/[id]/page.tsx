"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import ToolRenderer from "@/components/ToolRenderer";
import { ArrowLeft } from "lucide-react";

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

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-5 py-3 bg-zinc-900/50 border-b border-white/5 shrink-0">
        <Link
          href={`/?tool=${toolId}`}
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Hub
        </Link>
        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          zvx-hub // {toolId}
        </span>
      </div>
      <div className="flex-1 p-5 overflow-y-auto workspace-content">
        <ToolRenderer toolId={toolId} />
      </div>
    </div>
  );
}
