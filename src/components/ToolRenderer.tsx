"use client";

import MarkdownPreview from "./utils/MarkdownPreview";
import HtmlPreview from "./utils/HtmlPreview";
import NumberBaseConverter from "./utils/NumberBaseConverter";
import DiffChecker from "./utils/DiffChecker";
import JsonFormatter from "./utils/JsonFormatter";
import JwtDecoder from "./utils/JwtDecoder";
import TimestampConverter from "./utils/TimestampConverter";
import UuidGenerator from "./utils/UuidGenerator";
import Base64Transmuter from "./utils/Base64Transmuter";
import HashGenerator from "./utils/HashGenerator";

import CronJobParser from "./CronJobParser";
import YamlToJson from "./YamlToJson";
import YamlFormatter from "./YamlFormatter";
import MakefileValidator from "./MakefileValidator";
import SqlFormatter from "./SqlFormatter";
import PhpSerializer from "./PhpSerializer";
import PhpJsonConverter from "./PhpJsonConverter";
import CurlToCode from "./CurlToCode";
import CsvToJson from "./CsvToJson";
import JsonToCsv from "./JsonToCsv";
import JsonToCode from "./JsonToCode";
import CertificateDecoder from "./CertificateDecoder";
import CertificateGenerator from "./CertificateGenerator";
import SvgToCss from "./SvgToCss";
import HexAsciiConverter from "./HexAsciiConverter";
import StringCaseConverter from "./StringCaseConverter";
import Base64ImageEncoder from "./Base64ImageEncoder";
import RegexpTester from "./RegexpTester";
import HtmlEntityConverter from "./HtmlEntityConverter";
import BackslashEncoder from "./BackslashEncoder";
import LoremIpsum from "./LoremIpsum";
import HtmlToJsx from "./HtmlToJsx";
import CssMinifyBeautify from "./CssMinifyBeautify";
import JavaScriptMinifyBeautify from "./JavaScriptMinifyBeautify";
import HtmlMinifyBeautify from "./HtmlMinifyBeautify";
import Base64SecretDecoder from "./k8s/Base64SecretDecoder";
import ColorConverter from "./ColorConverter";
import LineSorter from "./LineSorter";
import UrlEncoder from "./UrlEncoder";
import UrlParser from "./UrlParser";

interface ToolRendererProps {
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

export default function ToolRenderer({ toolId, jsonInput, setJsonInput, jwtInput, setJwtInput, timestampInput, setTimestampInput, base64Input, setBase64Input }: ToolRendererProps) {
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
}
