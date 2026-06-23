import React, { useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

export default function CertificateDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const decodeCertificate = (cert: string): string => {
    try {
      // Remove headers and footers and clean whitespace
      const cleanCert = cert
        .replace(/-----BEGIN CERTIFICATE-----/g, '')
        .replace(/-----END CERTIFICATE-----/g, '')
        .replace(/\s/g, '');

      if (!cleanCert) {
        return 'Please enter a valid certificate';
      }

      // Decode base64 to binary
      const binary = atob(cleanCert);
      
      // Convert binary to Uint8Array for easier processing
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      // Parse the certificate using a more robust approach
      const result = parseCertificate(bytes);
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return `Error: ${error.message}`;
      }
      return 'Error decoding certificate. Please ensure you have pasted a valid X.509 certificate.';
    }
  };

  const parseCertificate = (bytes: Uint8Array): string => {
    let result = 'X.509 Certificate Information:\n';
    result += '=' .repeat(40) + '\n\n';

    try {
      // Basic certificate structure parsing
      const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
      
      result += `Certificate Length: ${bytes.length} bytes\n`;
      result += `Certificate Hex: ${hex.substring(0, 64)}${hex.length > 64 ? '...' : ''}\n\n`;

      // Try to extract some basic information using simple pattern matching
      const certString = Array.from(bytes, byte => 
        (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.'
      ).join('');

      // Look for common certificate fields
      const commonNames = extractField(certString, 'CN=');
      const organizations = extractField(certString, 'O=');
      const countries = extractField(certString, 'C=');
      const organizationalUnits = extractField(certString, 'OU=');

      if (commonNames.length > 0) {
        result += 'Common Names (CN):\n';
        commonNames.forEach(cn => result += `  - ${cn}\n`);
        result += '\n';
      }

      if (organizations.length > 0) {
        result += 'Organizations (O):\n';
        organizations.forEach(org => result += `  - ${org}\n`);
        result += '\n';
      }

      if (organizationalUnits.length > 0) {
        result += 'Organizational Units (OU):\n';
        organizationalUnits.forEach(ou => result += `  - ${ou}\n`);
        result += '\n';
      }

      if (countries.length > 0) {
        result += 'Countries (C):\n';
        countries.forEach(country => result += `  - ${country}\n`);
        result += '\n';
      }

      // Try to find dates (simplified approach)
      const datePattern = /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z/g;
      const dates = [];
      let match;
      while ((match = datePattern.exec(certString)) !== null) {
        const year = parseInt(match[1]) < 50 ? 2000 + parseInt(match[1]) : 1900 + parseInt(match[1]);
        const date = new Date(year, parseInt(match[2]) - 1, parseInt(match[3]), 
                             parseInt(match[4]), parseInt(match[5]), parseInt(match[6]));
        dates.push(date.toISOString());
      }

      if (dates.length >= 2) {
        result += `Valid From: ${dates[0]}\n`;
        result += `Valid To: ${dates[1]}\n\n`;
      }

      // Certificate fingerprint (SHA-1 simulation using simple hash)
      result += `Certificate Fingerprint (simplified): ${generateSimpleFingerprint(bytes)}\n\n`;

      result += 'Raw Certificate Data (first 500 chars):\n';
      result += '-'.repeat(40) + '\n';
      result += certString.substring(0, 500);
      if (certString.length > 500) {
        result += '\n... (truncated)';
      }

      return result;
    } catch (error) {
      return `Error parsing certificate: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
  };

  const extractField = (certString: string, fieldPrefix: string): string[] => {
    const fields: string[] = [];
    let index = 0;
    
    while ((index = certString.indexOf(fieldPrefix, index)) !== -1) {
      index += fieldPrefix.length;
      let endIndex = index;
      
      // Find the end of the field value
      while (endIndex < certString.length && 
             certString[endIndex] !== ',' && 
             certString[endIndex] !== '\0' &&
             certString[endIndex] !== '\n' &&
             certString[endIndex] !== '\r' &&
             endIndex - index < 100) {
        endIndex++;
      }
      
      const value = certString.substring(index, endIndex).trim();
      if (value && value.length > 0 && !fields.includes(value)) {
        fields.push(value);
      }
    }
    
    return fields;
  };

  const generateSimpleFingerprint = (bytes: Uint8Array): string => {
    // Simple hash function for demonstration
    let hash = 0;
    for (let i = 0; i < bytes.length; i++) {
      hash = ((hash << 5) - hash + bytes[i]) & 0xffffffff;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  };

  const handleDecode = () => {
    const decoded = decodeCertificate(input);
    setOutput(decoded);
  };

  const loadExample = () => {
    setInput(`-----BEGIN CERTIFICATE-----
MIIDHjCCAgagAwIBAgIQPo7nP9KvM7hKlB19AHdCyTANBgkqhkiG9w0BAQsFADAWMRQwEgYDVQQD
DAtleGFtcGxlLmNvbTAeFw0yNjA2MjIxNTAwNThaFw0yNzA2MjIxNTEwNTZaMBYxFDASBgNVBAMM
C2V4YW1wbGUuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsQaCbXsyAFREg9t9
pYrr68+kIr7ny/fTJ/bfgbVgriur1na7p8+DgVgxt0sKZVZYm7je905HaRpjoOJYlz+fVMXbG390
MzI59qDJQeGhwvZ6/2Nu98D5tKARVC0fUNim8gh/8ggYIeRAE017nXcIUrVlCIpBRqqGZ9ZpruG1
Qhml5tH0yhyckd1Ob8boLJvXeZp3FQD8PHC34YSctur5covtNI5e+3HUEfKrdXJdkrluM8RWrP4L
sfzikzhNJ3wEmn82j66BZ/bOJEnq7ICWxj2AykSIJ84VafX3H0UE1E4ShPfYkdaCH7NWfdCIxIC9
FH4HmZkbZlLd17N8Y7wX2QIDAQABo2gwZjAOBgNVHQ8BAf8EBAMCBaAwHQYDVR0lBBYwFAYIKwYB
BQUHAwIGCCsGAQUFBwMBMBYGA1UdEQQPMA2CC2V4YW1wbGUuY29tMB0GA1UdDgQWBBSKh4U9D1Di
OOsU1k0xe9vS3Kz+WzANBgkqhkiG9w0BAQsFAAOCAQEABhKArEUX1lrbj/VBPyCXFQ3U8IOHvse5
CVokX4/nghVr5hq+9eglZ2I4ogFnhYFbjMYvL2NcPQsy5nTvIAL30J6xN1Q2oDH+IjPevhMHNQYz
jCfxVdV+o5ZOziGDrU/JTJx8vWZ1dSp+uplNG1tS+TX/fBbULWecJmPkI4JuWz21aw9ckqe8vcyi
MLiiG1jCPGZH7yVPth201JCtGW/aH7h0TurP4mPvYxk9ORKKABdGDZgrs0UOuOlS9jkH3kr77Adn
kxztpOgeG3X+a2VCqWaVYjU5NT3oD6u/jID/gD+ln5ZjrKySir+Dz95MalEeZaAV+rh+yAZmD8GW
vmFBQg==
-----END CERTIFICATE-----`);
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Certificate Decoder</h2>
      <button
        onClick={loadExample}
        className="mb-4 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-xs font-mono text-zinc-300 hover:text-zinc-100 transition-all cursor-pointer"
      >
        Load Example
      </button>
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Certificate Input</label>
          <CodeEditor
            value={input}
            language="text"
            placeholder="Paste your X.509 certificate here..."
            onChange={(e) => setInput(e.target.value)}
            padding={15}
            className="h-[500px] font-mono text-sm border border-gray-300 rounded-md"
            style={{
              backgroundColor: '#ffffff',
              color: '#1f2937',
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Decoded Output</label>
          <CodeEditor
            value={output}
            language="text"
            readOnly
            padding={15}
            className="h-[500px] font-mono text-sm border border-gray-300 rounded-md bg-gray-50"
            style={{
              backgroundColor: '#f9fafb',
              color: '#374151',
              fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            }}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleDecode}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Decode
      </button>
    </div>
  );
} 