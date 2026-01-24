import type { CodeBlock, MaskingRule, FileChange } from './types.js';

const DEFAULT_MASKING_RULES: MaskingRule[] = [
  { name: 'openai_api_key', pattern: /sk-[a-zA-Z0-9]{48,}/g, replacement: 'YOUR_OPENAI_API_KEY' },
  { name: 'anthropic_api_key', pattern: /sk-ant-[a-zA-Z0-9-]{80,}/g, replacement: 'YOUR_ANTHROPIC_API_KEY' },
  { name: 'notion_api_key', pattern: /ntn_[a-zA-Z0-9]{50,}/g, replacement: 'YOUR_NOTION_API_KEY' },
  { name: 'supabase_key', pattern: /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, replacement: 'YOUR_SUPABASE_KEY' },
  { name: 'bearer_token', pattern: /Bearer\s+[a-zA-Z0-9._-]{20,}/g, replacement: 'Bearer YOUR_TOKEN' },
  { name: 'github_token', pattern: /gh[ps]_[a-zA-Z0-9]{36,}/g, replacement: 'YOUR_GITHUB_TOKEN' },
  { name: 'aws_access_key', pattern: /AKIA[0-9A-Z]{16}/g, replacement: 'YOUR_AWS_ACCESS_KEY' },
  { name: 'private_key', pattern: /-----BEGIN (?:RSA )?PRIVATE KEY-----[\s\S]+?-----END (?:RSA )?PRIVATE KEY-----/g, replacement: '-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----' },
  { name: 'generic_secret', pattern: /secret[_-]?key['":\s]*[=:]\s*['"]?[a-zA-Z0-9_-]{20,}['"]?/gi, replacement: 'secret_key: "YOUR_SECRET_KEY"' },
  { name: 'password', pattern: /password['":\s]*[=:]\s*['"][^'"]{8,}['"]/gi, replacement: 'password: "YOUR_PASSWORD"' },
  { name: 'internal_url', pattern: /https?:\/\/(?:internal|private|staging|dev)\.[a-zA-Z0-9.-]+/g, replacement: 'https://api.example.com' },
  { name: 'localhost_port', pattern: /localhost:\d{4,5}/g, replacement: 'localhost:3000' },
  { name: 'database_url', pattern: /(?:postgres|mysql|mongodb):\/\/[^\s"']+/g, replacement: 'postgres://user:password@localhost:5432/dbname' },
  { name: 'email', pattern: /[a-zA-Z0-9._%+-]+@(?!example\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: 'user@example.com' },
  { name: 'uuid', pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, replacement: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
];

export function maskSensitiveData(code: string, additionalRules: MaskingRule[] = []): string {
  const allRules = [...DEFAULT_MASKING_RULES, ...additionalRules];
  let maskedCode = code;

  for (const rule of allRules) {
    maskedCode = maskedCode.replace(rule.pattern, rule.replacement);
  }

  return maskedCode;
}

export function extractCodeBlocksFromDiff(diff: string, filePath: string): CodeBlock[] {
  const codeBlocks: CodeBlock[] = [];
  const addedLines: string[] = [];
  let currentHunk = '';

  const lines = diff.split('\n');
  for (const line of lines) {
    if (line.startsWith('@@')) {
      if (addedLines.length > 0) {
        const realCode = addedLines.join('\n');
        if (realCode.trim().length > 10) {
          codeBlocks.push({
            language: detectLanguageFromPath(filePath),
            realCode,
            exampleCode: maskSensitiveData(realCode),
            description: generateCodeDescription(realCode, filePath),
            filePath,
          });
        }
        addedLines.length = 0;
      }
      currentHunk = line;
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      addedLines.push(line.substring(1));
    }
  }

  if (addedLines.length > 0) {
    const realCode = addedLines.join('\n');
    if (realCode.trim().length > 10) {
      codeBlocks.push({
        language: detectLanguageFromPath(filePath),
        realCode,
        exampleCode: maskSensitiveData(realCode),
        description: generateCodeDescription(realCode, filePath),
        filePath,
      });
    }
  }

  return codeBlocks;
}

function detectLanguageFromPath(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'tsx',
    js: 'javascript',
    jsx: 'jsx',
    py: 'python',
    swift: 'swift',
    kt: 'kotlin',
    java: 'java',
    cs: 'csharp',
    go: 'go',
    rs: 'rust',
    rb: 'ruby',
    php: 'php',
    vue: 'vue',
    svelte: 'svelte',
    css: 'css',
    scss: 'scss',
    html: 'html',
    json: 'json',
    yaml: 'yaml',
    yml: 'yaml',
    md: 'markdown',
    sql: 'sql',
    sh: 'bash',
  };
  return ext ? langMap[ext] || 'text' : 'text';
}

function generateCodeDescription(code: string, filePath: string): string {
  const patterns: Array<{ regex: RegExp; description: string }> = [
    { regex: /export\s+(?:async\s+)?function\s+(\w+)/, description: (m: RegExpMatchArray) => `함수 ${m[1]} 정의` },
    { regex: /export\s+(?:default\s+)?class\s+(\w+)/, description: (m: RegExpMatchArray) => `클래스 ${m[1]} 정의` },
    { regex: /export\s+(?:const|let)\s+(\w+)/, description: (m: RegExpMatchArray) => `상수/변수 ${m[1]} export` },
    { regex: /interface\s+(\w+)/, description: (m: RegExpMatchArray) => `인터페이스 ${m[1]} 정의` },
    { regex: /type\s+(\w+)\s*=/, description: (m: RegExpMatchArray) => `타입 ${m[1]} 정의` },
    { regex: /useEffect\s*\(/, description: () => 'React useEffect 훅' },
    { regex: /useState\s*\(/, description: () => 'React useState 훅' },
    { regex: /async\s+function\s+(\w+)/, description: (m: RegExpMatchArray) => `비동기 함수 ${m[1]}` },
    { regex: /app\.(get|post|put|delete|patch)\s*\(/, description: (m: RegExpMatchArray) => `${m[1].toUpperCase()} API 엔드포인트` },
    { regex: /router\.(get|post|put|delete|patch)\s*\(/, description: (m: RegExpMatchArray) => `${m[1].toUpperCase()} 라우터` },
    { regex: /middleware/, description: () => '미들웨어' },
    { regex: /SELECT|INSERT|UPDATE|DELETE/i, description: () => 'SQL 쿼리' },
    { regex: /import\s+.+\s+from/, description: () => '모듈 임포트' },
  ];

  for (const { regex, description } of patterns) {
    const match = code.match(regex);
    if (match) {
      return typeof description === 'function' ? description(match) : description;
    }
  }

  const fileName = filePath.split('/').pop() || '';
  return `${fileName} 파일 변경`;
}

export function extractMeaningfulCodeBlocks(
  filesChanged: FileChange[],
  maxBlocks: number = 5,
): CodeBlock[] {
  const allBlocks: CodeBlock[] = [];

  for (const file of filesChanged) {
    if (!file.diff || file.diff.length < 50) continue;
    
    const skipPatterns = [
      /package-lock\.json/,
      /yarn\.lock/,
      /bun\.lock/,
      /\.min\./,
      /\.map$/,
      /node_modules/,
      /dist\//,
      /build\//,
    ];
    
    if (skipPatterns.some((p) => p.test(file.path))) continue;

    const blocks = extractCodeBlocksFromDiff(file.diff, file.path);
    allBlocks.push(...blocks);
  }

  return allBlocks
    .filter((b) => b.realCode.trim().length > 30)
    .sort((a, b) => b.realCode.length - a.realCode.length)
    .slice(0, maxBlocks);
}

export function generalizeVariableNames(code: string): string {
  const patterns: Array<[RegExp, string]> = [
    [/(?<![a-zA-Z])userId(?![a-zA-Z])/g, 'entityId'],
    [/(?<![a-zA-Z])bookId(?![a-zA-Z])/g, 'entityId'],
    [/(?<![a-zA-Z])postId(?![a-zA-Z])/g, 'entityId'],
    [/(?<![a-zA-Z])orderId(?![a-zA-Z])/g, 'entityId'],
    [/(?<![a-zA-Z])companyName(?![a-zA-Z])/g, 'entityName'],
    [/(?<![a-zA-Z])productName(?![a-zA-Z])/g, 'entityName'],
  ];

  let result = code;
  for (const [pattern, replacement] of patterns) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

export function createExampleCode(realCode: string, includeGeneralization: boolean = false): string {
  let exampleCode = maskSensitiveData(realCode);
  
  if (includeGeneralization) {
    exampleCode = generalizeVariableNames(exampleCode);
  }

  return exampleCode;
}
