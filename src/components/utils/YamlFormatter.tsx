import React, { useState, useEffect, useRef } from "react";
import * as yaml from "js-yaml";
import {
  Copy,
  Download,
  RotateCcw,
  FileText,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Settings,
  WrapText,
  Hash,
  Check,
} from "lucide-react";

interface YamlNode {
  key: string;
  value: unknown;
  type: "object" | "array" | "string" | "number" | "boolean" | "null";
  path: string;
  level: number;
  isCollapsed: boolean;
  hasChildren: boolean;
}

interface LineNumberedTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showLineNumbers?: boolean;
  lineWrap?: boolean;
  height?: string;
}

function LineNumberedTextArea({
  value,
  onChange,
  placeholder,
  className = "",
  showLineNumbers = true,
  lineWrap = true,
  height = "400px",
}: LineNumberedTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 1);

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div
      className={`relative flex border border-white/5 rounded-md shadow-sm ${className}`}
    >
      {showLineNumbers && (
        <div
          ref={lineNumbersRef}
          className="flex-shrink-0 w-12 bg-zinc-900/60 border-r border-white/5 overflow-hidden text-right pr-2 py-2 font-mono text-sm text-zinc-500 select-none"
          style={{ height }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        className={`flex-1 px-3 py-2 border-none focus:ring-0 font-mono text-sm resize-none outline-none ${
          lineWrap ? "whitespace-pre-wrap" : "whitespace-pre overflow-x-auto"
        }`}
        placeholder={placeholder}
        style={{ height }}
      />
    </div>
  );
}

interface LineNumberedPreProps {
  content: string;
  error?: boolean;
  className?: string;
  showLineNumbers?: boolean;
  lineWrap?: boolean;
  height?: string;
}

function LineNumberedPre({
  content,
  error = false,
  className = "",
  showLineNumbers = true,
  lineWrap = true,
  height = "400px",
}: LineNumberedPreProps) {
  const lines = content.split("\n");
  const lineCount = Math.max(lines.length, 1);

  return (
    <div
      className={`relative flex border border-white/5 rounded-md overflow-hidden ${className}`}
    >
      {showLineNumbers && (
        <div className="flex-shrink-0 w-12 bg-zinc-900/60 border-r border-white/5 text-right pr-2 py-2 font-mono text-sm text-zinc-500 select-none">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      <pre
        className={`flex-1 px-3 py-2 overflow-auto font-mono text-sm ${
          error ? "text-red-600 bg-red-50" : "bg-zinc-800/50"
        } ${lineWrap ? "whitespace-pre-wrap" : "whitespace-pre"}`}
        style={{ height }}
      >
        {content}
      </pre>
    </div>
  );
}

export default function YamlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState<"formatted" | "tree">("formatted");
  const [indentSize, setIndentSize] = useState(2);
  const [copySuccess, setCopySuccess] = useState(false);
  const [inputCopySuccess, setInputCopySuccess] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [lineWrap, setLineWrap] = useState(true);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [parsedYaml, setParsedYaml] = useState<any>(null);

  const sampleYaml = `# Sample YAML Configuration
app:
  name: "My Application"
  version: "1.0.0"
  description: |
    This is a multi-line description
    that spans several lines
  
database:
  host: localhost
  port: 5432
  name: myapp_db
  credentials:
    username: admin
    password: secret123
  
features:
  - authentication
  - logging
  - caching
  - monitoring
  
environments:
  development:
    debug: true
    log_level: debug
    database_url: "postgresql://localhost/myapp_dev"
  
  production:
    debug: false
    log_level: info
    database_url: "postgresql://prod-server/myapp"
    
settings:
  max_connections: 100
  timeout: 30
  retry_attempts: 3
  enabled: true
  
metadata:
  created_at: 2024-01-01T00:00:00Z
  updated_at: 2024-01-15T12:30:00Z
  tags:
    - web
    - api
    - backend`;

  const formatYaml = () => {
    if (!input.trim()) {
      setOutput("");
      setError("");
      setParsedYaml(null);
      return;
    }

    try {
      const parsed = yaml.load(input);
      setParsedYaml(parsed);

      const formatted = yaml.dump(parsed, {
        indent: indentSize,
        lineWidth: lineWrap ? 80 : -1,
        noRefs: true,
        sortKeys: false,
        quoteStyle: 'double',
      });

      setOutput(formatted);
      setError("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Invalid YAML";
      setError(errorMessage);
      setOutput("");
      setParsedYaml(null);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      formatYaml();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [input, indentSize, lineWrap]);

  const buildYamlTree = (obj: any, path = "", level = 0): YamlNode[] => {
    const nodes: YamlNode[] = [];

    if (obj === null) {
      return [
        {
          key: "",
          value: null,
          type: "null",
          path,
          level,
          isCollapsed: false,
          hasChildren: false,
        },
      ];
    }

    if (typeof obj !== "object") {
      return [
        {
          key: "",
          value: obj,
          type: typeof obj as any,
          path,
          level,
          isCollapsed: false,
          hasChildren: false,
        },
      ];
    }

    const isArray = Array.isArray(obj);
    const entries = isArray
      ? obj.map((v, i) => [i.toString(), v])
      : Object.entries(obj);

    entries.forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      const hasChildren = value !== null && typeof value === "object";

      nodes.push({
        key,
        value,
        type: Array.isArray(value)
          ? "array"
          : value === null
            ? "null"
            : (typeof value as any),
        path: currentPath,
        level,
        isCollapsed: collapsedNodes.has(currentPath),
        hasChildren,
      });

      if (hasChildren && !collapsedNodes.has(currentPath)) {
        nodes.push(...buildYamlTree(value, currentPath, level + 1));
      }
    });

    return nodes;
  };

  const toggleNode = (path: string) => {
    const newCollapsed = new Set(collapsedNodes);
    if (newCollapsed.has(path)) {
      newCollapsed.delete(path);
    } else {
      newCollapsed.add(path);
    }
    setCollapsedNodes(newCollapsed);
  };

  const renderYamlTree = () => {
    if (!parsedYaml) return null;

    const nodes = buildYamlTree(parsedYaml);

    return (
      <div className="font-mono text-sm p-3">
        {nodes.map((node, index) => (
          <div
            key={`${node.path}-${index}`}
            className="flex items-center py-0.5 hover:bg-zinc-800/50 rounded"
            style={{ paddingLeft: `${node.level * 20 + 8}px` }}
          >
            {node.hasChildren ? (
              <button
                type="button"
                onClick={() => toggleNode(node.path)}
                className="mr-1 p-0.5 hover:bg-zinc-700 rounded"
              >
                {node.isCollapsed ? (
                  <ChevronRight size={12} />
                ) : (
                  <ChevronDown size={12} />
                )}
              </button>
            ) : (
              <span className="w-4 mr-1" />
            )}

            <span className="text-blue-600 mr-2 font-medium">{node.key}:</span>

            {node.type === "string" && (
              <span className="text-green-600">"{node.value as string}"</span>
            )}
            {node.type === "number" && (
              <span className="text-purple-600">{node.value as number}</span>
            )}
            {node.type === "boolean" && (
              <span className="text-orange-600">{(node.value as boolean).toString()}</span>
            )}
            {node.type === "null" && (
              <span className="text-zinc-500">null</span>
            )}
            {node.type === "object" && !node.isCollapsed && (
              <span className="text-zinc-400">{"{"}</span>
            )}
            {node.type === "array" && !node.isCollapsed && (
              <span className="text-zinc-400">{"["}</span>
            )}
            {node.hasChildren && node.isCollapsed && (
              <span className="text-gray-400">
                {node.type === "object" ? "{...}" : "[...]"}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleCopy = async (
    text: string,
    setSuccess: (value: boolean) => void
  ) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/yaml;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "formatted.yaml";
    link.click();
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setParsedYaml(null);
    setCollapsedNodes(new Set());
  };

  const loadSample = () => {
    setInput(sampleYaml);
    setCollapsedNodes(new Set());
  };
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-zinc-300">Indent:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="px-2 py-1 border border-white/5 rounded text-sm focus:ring-emerald-500 focus:border-blue-500"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => setShowLineNumbers(!showLineNumbers)}
          className={`flex items-center space-x-1 px-3 py-2 text-sm border border-white/5 rounded-md transition-colors ${
            showLineNumbers
              ? "bg-emerald-500 text-zinc-950 border-emerald-500"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-zinc-700"
          }`}
        >
          <Hash size={16} />
          <span>Line Numbers</span>
        </button>

        <button
          type="button"
          onClick={() => setLineWrap(!lineWrap)}
          className={`flex items-center space-x-1 px-3 py-2 text-sm border border-white/5 rounded-md transition-colors ${
            lineWrap
              ? "bg-emerald-500 text-zinc-950 border-emerald-500"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-zinc-700"
          }`}
        >
          <WrapText size={16} />
          <span>Line Wrap</span>
        </button>

        <button
          type="button"
          onClick={loadSample}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <FileText size={16} />
          <span>Load Sample</span>
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="flex items-center space-x-1 px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <RotateCcw size={16} />
          <span>Clear</span>
        </button>
      </div>

      {/* Input/Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-300">
              YAML Input
            </label>
            <button
              type="button"
              onClick={() => handleCopy(input, setInputCopySuccess)}
              disabled={!input}
              className={`flex items-center space-x-1 px-2 py-1 text-xs border rounded transition-colors ${
                !input
                  ? "bg-zinc-900/60 text-gray-400 border-white/10 cursor-not-allowed"
                  : inputCopySuccess
                    ? "bg-green-100 text-emerald-300 border-green-300"
                    : "bg-zinc-900/60 text-zinc-300 border-white/5 hover:bg-zinc-700"
              }`}
              title="Copy input to clipboard"
            >
              {inputCopySuccess ? <Check size={12} /> : <Copy size={12} />}
              <span>{inputCopySuccess ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <LineNumberedTextArea
            value={input}
            onChange={setInput}
            placeholder="Enter YAML here..."
            className="w-full"
            showLineNumbers={showLineNumbers}
            lineWrap={lineWrap}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-zinc-300">
              Formatted Output
            </label>
            <div className="flex items-center space-x-2">
              {!error && parsedYaml && (
                <div className="flex bg-zinc-900/60 rounded">
                  <button
                    type="button"
                    onClick={() => setViewMode("formatted")}
                    className={`px-3 py-1 text-xs rounded-l ${
                      viewMode === "formatted"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-zinc-700"
                    }`}
                  >
                    Formatted
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("tree")}
                    className={`px-3 py-1 text-xs rounded-r ${
                      viewMode === "tree"
                        ? "bg-blue-500 text-white"
                        : "hover:bg-zinc-700"
                    }`}
                  >
                    Tree View
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleCopy(output, setCopySuccess)}
                disabled={!output || !!error}
                className={`flex items-center space-x-1 px-2 py-1 text-xs border rounded transition-colors ${
                  !output || !!error
                    ? "bg-zinc-900/60 text-gray-400 border-white/10 cursor-not-allowed"
                    : copySuccess
                      ? "bg-green-100 text-emerald-300 border-green-300"
                      : "bg-zinc-900/60 text-zinc-300 border-white/5 hover:bg-zinc-700"
                }`}
                title="Copy to clipboard"
              >
                {copySuccess ? <Check size={12} /> : <Copy size={12} />}
                <span>{copySuccess ? "Copied!" : "Copy"}</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!output || !!error}
                className={`flex items-center space-x-1 px-2 py-1 text-xs border rounded transition-colors ${
                  !output || !!error
                    ? "bg-zinc-900/60 text-gray-400 border-white/10 cursor-not-allowed"
                    : "bg-zinc-900/60 text-zinc-300 border-white/5 hover:bg-zinc-700"
                }`}
                title="Download file"
              >
                <Download size={12} />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="border border-white/5 rounded-md h-96 overflow-hidden">
            {error ? (
              <div className="p-4 text-red-600 bg-red-50 h-full">
                <div className="font-semibold mb-2">YAML Validation Error:</div>
                <div className="font-mono text-sm">{error}</div>
              </div>
            ) : output ? (
              <div className="h-full overflow-auto">
                {viewMode === "formatted" ? (
                  <LineNumberedPre
                    content={output}
                    className="w-full h-full border-0"
                    showLineNumbers={showLineNumbers}
                    lineWrap={lineWrap}
                    height="100%"
                  />
                ) : (
                  <div className="h-full overflow-auto bg-zinc-800/50">
                    {renderYamlTree()}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 text-zinc-500 h-full flex items-center justify-center">
                {input ? "Formatting..." : "Formatted YAML will appear here"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-6 p-4 bg-zinc-900/40 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Features:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Real-time YAML formatting and validation</li>
          <li>• Tree view for exploring YAML structure</li>
          <li>• Configurable indentation (2, 4, or 8 spaces)</li>
          <li>• Toggle line numbers and line wrapping</li>
          <li>• Copy to clipboard with success feedback</li>
          <li>• Download formatted YAML files</li>
          <li>• Sample data for quick testing</li>
          <li>• Comprehensive error handling</li>
        </ul>
      </div>

      {/* Toast Notifications */}
      {(copySuccess || inputCopySuccess) && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center space-x-2 z-50">
          <Check size={16} />
          <span>Copied to clipboard!</span>
        </div>
      )}
    </>
  );
}
