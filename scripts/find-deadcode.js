#!/usr/bin/env node

/**
 * Custom dead code finder script
 * Finds unused files, exports, and dependencies
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const srcDir = join(projectRoot, 'src');

// File extensions to check
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const IGNORE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  '.git',
  '*.d.ts',
  '*.config.ts',
  '*.config.js',
  'main.tsx',
  'App.tsx',
  'vite-env.d.ts',
];

// Entry points that should be checked
const ENTRY_POINTS = [
  'src/main.tsx',
  'src/app/App.tsx',
  'src/app/routes/AppRouter.tsx',
];

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      if (!IGNORE_PATTERNS.some(pattern => filePath.includes(pattern))) {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = extname(file);
      if (EXTENSIONS.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Extract imports from a file
 */
function extractImports(content) {
  const imports = new Set();
  
  // Match various import patterns
  const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+\w+|\w+))*\s+from\s+)?['"]([^'"]+)['"]/g;
  const requireRegex = /require\(['"]([^'"]+)['"]\)/g;
  
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  while ((match = requireRegex.exec(content)) !== null) {
    imports.add(match[1]);
  }
  
  return Array.from(imports);
}

/**
 * Normalize import path
 */
function normalizeImport(importPath, fromFile) {
  // Remove file extensions
  importPath = importPath.replace(/\.(ts|tsx|js|jsx)$/, '');
  
  // Handle relative imports
  if (importPath.startsWith('.')) {
    const fromDir = dirname(fromFile);
    const resolved = join(fromDir, importPath);
    return relative(projectRoot, resolved).replace(/\\/g, '/');
  }
  
  // Handle @/ alias (assuming it maps to src/)
  if (importPath.startsWith('@/')) {
    return 'src/' + importPath.substring(2);
  }
  
  return importPath;
}

/**
 * Check if a file is used
 */
function isFileUsed(filePath, allFiles, usedFiles) {
  const relativePath = relative(projectRoot, filePath);
  const normalizedPath = relativePath.replace(/\\/g, '/').replace(/\.(ts|tsx|js|jsx)$/, '');
  
  // Check if it's an entry point
  if (ENTRY_POINTS.some(entry => relativePath.includes(entry))) {
    return true;
  }
  
  // Check if it's imported by any used file
  for (const usedFile of usedFiles) {
    try {
      const content = readFileSync(usedFile, 'utf-8');
      const imports = extractImports(content);
      
      for (const imp of imports) {
        const normalizedImport = normalizeImport(imp, usedFile);
        if (normalizedPath.includes(normalizedImport) || normalizedImport.includes(normalizedPath)) {
          return true;
        }
      }
    } catch (e) {
      // Skip files that can't be read
    }
  }
  
  return false;
}

/**
 * Main function
 */
function findDeadCode() {
  console.log('🔍 Scanning for dead code...\n');
  
  const allFiles = getAllFiles(srcDir);
  const usedFiles = new Set();
  const unusedFiles = [];
  
  // Start with entry points
  ENTRY_POINTS.forEach(entry => {
    const entryPath = join(projectRoot, entry);
    if (existsSync(entryPath)) {
      usedFiles.add(entryPath);
    }
  });
  
  // Recursively find all used files
  let changed = true;
  while (changed) {
    changed = false;
    const currentUsed = Array.from(usedFiles);
    
    for (const file of allFiles) {
      if (usedFiles.has(file)) continue;
      
      try {
        const content = readFileSync(file, 'utf-8');
        const imports = extractImports(content);
        
        for (const imp of imports) {
          // Try to resolve the import
          const normalizedImport = normalizeImport(imp, file);
          
          // Check if any used file imports this file
          for (const usedFile of currentUsed) {
            const usedContent = readFileSync(usedFile, 'utf-8');
            const usedImports = extractImports(usedContent);
            
            for (const usedImp of usedImports) {
              const normalizedUsedImport = normalizeImport(usedImp, usedFile);
              const fileNormalized = relative(projectRoot, file).replace(/\\/g, '/').replace(/\.(ts|tsx|js|jsx)$/, '');
              
              if (normalizedUsedImport.includes(fileNormalized) || fileNormalized.includes(normalizedUsedImport)) {
                if (!usedFiles.has(file)) {
                  usedFiles.add(file);
                  changed = true;
                }
              }
            }
          }
        }
      } catch (e) {
        // Skip files that can't be read
      }
    }
  }
  
  // Find unused files
  for (const file of allFiles) {
    if (!usedFiles.has(file)) {
      unusedFiles.push(file);
    }
  }
  
  // Report results
  console.log(`📊 Analysis Results:\n`);
  console.log(`   Total files: ${allFiles.length}`);
  console.log(`   Used files: ${usedFiles.size}`);
  console.log(`   Unused files: ${unusedFiles.length}\n`);
  
  if (unusedFiles.length > 0) {
    console.log('❌ Potentially unused files:\n');
    unusedFiles.forEach(file => {
      const relativePath = relative(projectRoot, file);
      console.log(`   ${relativePath}`);
    });
    console.log('\n⚠️  Review these files carefully before deleting!');
    console.log('   Some files might be used dynamically or in ways this script cannot detect.\n');
  } else {
    console.log('✅ No unused files found!\n');
  }
  
  return unusedFiles;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  findDeadCode();
}

export { findDeadCode };

