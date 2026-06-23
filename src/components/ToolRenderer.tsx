"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const MarkdownPreview = dynamic(() => import("./utils/MarkdownPreview"), { ssr: false });
const HtmlPreview = dynamic(() => import("./utils/HtmlPreview"), { ssr: false });
const NumberBaseConverter = dynamic(() => import("./utils/NumberBaseConverter"), { ssr: false });
const DiffChecker = dynamic(() => import("./utils/DiffChecker"), { ssr: false });
const JsonFormatter = dynamic(() => import("./utils/JsonFormatter"), { ssr: false });
const JwtDecoder = dynamic(() => import("./utils/JwtDecoder"), { ssr: false });
const TimestampConverter = dynamic(() => import("./utils/TimestampConverter"), { ssr: false });
const UuidGenerator = dynamic(() => import("./utils/UuidGenerator"), { ssr: false });
const Base64Transmuter = dynamic(() => import("./utils/Base64Transmuter"), { ssr: false });
const HashGenerator = dynamic(() => import("./utils/HashGenerator"), { ssr: false });

const CronJobParser = dynamic(() => import("./utils/CronJobParser"), { ssr: false });
const YamlToJson = dynamic(() => import("./utils/YamlToJson"), { ssr: false });
const YamlFormatter = dynamic(() => import("./utils/YamlFormatter"), { ssr: false });
const MakefileValidator = dynamic(() => import("./utils/MakefileValidator"), { ssr: false });
const SqlFormatter = dynamic(() => import("./utils/SqlFormatter"), { ssr: false });
const PhpSerializer = dynamic(() => import("./utils/PhpSerializer"), { ssr: false });
const PhpJsonConverter = dynamic(() => import("./utils/PhpJsonConverter"), { ssr: false });
const CurlToCode = dynamic(() => import("./utils/CurlToCode"), { ssr: false });
const CsvToJson = dynamic(() => import("./utils/CsvToJson"), { ssr: false });
const JsonToCsv = dynamic(() => import("./utils/JsonToCsv"), { ssr: false });
const JsonToCode = dynamic(() => import("./utils/JsonToCode"), { ssr: false });
const CertificateDecoder = dynamic(() => import("./utils/CertificateDecoder"), { ssr: false });
const CertificateGenerator = dynamic(() => import("./utils/CertificateGenerator"), { ssr: false });
const SvgToCss = dynamic(() => import("./utils/SvgToCss"), { ssr: false });
const HexAsciiConverter = dynamic(() => import("./utils/HexAsciiConverter"), { ssr: false });
const StringCaseConverter = dynamic(() => import("./utils/StringCaseConverter"), { ssr: false });
const Base64ImageEncoder = dynamic(() => import("./utils/Base64ImageEncoder"), { ssr: false });
const RegexpTester = dynamic(() => import("./utils/RegexpTester"), { ssr: false });
const HtmlEntityConverter = dynamic(() => import("./utils/HtmlEntityConverter"), { ssr: false });
const BackslashEncoder = dynamic(() => import("./utils/BackslashEncoder"), { ssr: false });
const LoremIpsum = dynamic(() => import("./utils/LoremIpsum"), { ssr: false });
const HtmlToJsx = dynamic(() => import("./utils/HtmlToJsx"), { ssr: false });
const CssMinifyBeautify = dynamic(() => import("./utils/CssMinifyBeautify"), { ssr: false });
const JavaScriptMinifyBeautify = dynamic(() => import("./utils/JavaScriptMinifyBeautify"), { ssr: false });
const HtmlMinifyBeautify = dynamic(() => import("./utils/HtmlMinifyBeautify"), { ssr: false });
const Base64SecretDecoder = dynamic(() => import("./utils/k8s/Base64SecretDecoder"), { ssr: false });
const ColorConverter = dynamic(() => import("./utils/ColorConverter"), { ssr: false });
const LineSorter = dynamic(() => import("./utils/LineSorter"), { ssr: false });
const UrlEncoder = dynamic(() => import("./utils/UrlEncoder"), { ssr: false });
const UrlParser = dynamic(() => import("./utils/UrlParser"), { ssr: false });

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[300px] text-zinc-600 font-mono text-xs">
      <div className="flex flex-col items-center gap-3">
        <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
        <span>Loading tool...</span>
      </div>
    </div>
  );
}

interface Props {
  toolId: string;
  jsonInput?: string;
  setJsonInput?: (v: string) => void;
  jwtInput?: string;
  setJwtInput?: (v: string) => void;
  timestampInput?: string;
  setTimestampInput?: (v: string) => void;
  base64Input?: string;
  setBase64Input?: (v: string) => void;
}

export default function ToolRenderer({ toolId, jsonInput, setJsonInput, jwtInput, setJwtInput, timestampInput, setTimestampInput, base64Input, setBase64Input }: Props) {
  const shared = { jsonInput, setJsonInput, jwtInput, setJwtInput, timestampInput, setTimestampInput, base64Input, setBase64Input };

  const el = (() => {
    switch (toolId) {
      case "markdown": return <MarkdownPreview />;
      case "html": return <HtmlPreview />;
      case "number-base": return <NumberBaseConverter />;
      case "diff": return <DiffChecker />;
      case "json": return <JsonFormatter jsonInput={jsonInput || '{"name":"zvx-hub"}'} setJsonInput={setJsonInput || (() => {})} />;
      case "jwt": return <JwtDecoder jwtInput={jwtInput || ""} setJwtInput={setJwtInput || (() => {})} />;
      case "timestamp": return <TimestampConverter timestampInput={timestampInput || ""} setTimestampInput={setTimestampInput || (() => {})} />;
      case "uuid": return <UuidGenerator />;
      case "base64": return <Base64Transmuter base64Input={base64Input || ""} setBase64Input={setBase64Input || (() => {})} />;
      case "hash": return <HashGenerator />;
      case "cron-parser": return <CronJobParser />;
      case "yaml-json": return <YamlToJson />;
      case "yaml-formatter": return <YamlFormatter />;
      case "makefile-validator": return <MakefileValidator />;
      case "sql-formatter": return <SqlFormatter />;
      case "php-serializer": return <PhpSerializer />;
      case "php-json": return <PhpJsonConverter />;
      case "curl-code": return <CurlToCode />;
      case "csv-json": return <CsvToJson />;
      case "json-csv": return <JsonToCsv />;
      case "json-code": return <JsonToCode />;
      case "cert-decoder": return <CertificateDecoder />;
      case "cert-generator": return <CertificateGenerator />;
      case "svg-css": return <SvgToCss />;
      case "hex-ascii": return <HexAsciiConverter />;
      case "string-case": return <StringCaseConverter />;
      case "base64-image": return <Base64ImageEncoder />;
      case "regexp": return <RegexpTester />;
      case "html-entity": return <HtmlEntityConverter />;
      case "backslash": return <BackslashEncoder />;
      case "lorem-ipsum": return <LoremIpsum />;
      case "html-jsx": return <HtmlToJsx />;
      case "css-minify-beautify": return <CssMinifyBeautify />;
      case "js-minify-beautify": return <JavaScriptMinifyBeautify />;
      case "html-minify-beautify": return <HtmlMinifyBeautify />;
      case "k8s-secret-decoder": return <Base64SecretDecoder />;
      case "color-converter": return <ColorConverter />;
      case "line-sorter": return <LineSorter />;
      case "url-encoder": return <UrlEncoder />;
      case "url-parser": return <UrlParser />;
      default: return <div className="text-zinc-500 font-mono text-sm p-8 text-center">Tool not found</div>;
    }
  })();

  return <Suspense fallback={<LoadingFallback />}>{el}</Suspense>;
}
