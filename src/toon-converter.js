/**
 * TOON Converter - Convert between JSON and TOON formats
 * 
 * TOON (Token-Oriented Object Notation) is a more compact, human-readable
 * alternative to JSON with 30-60% token reduction.
 * 
 * @module toon-converter
 */

class ToonConverter {
  /**
   * Convert JSON to TOON format
   * @param {any} json - JSON object or array
   * @param {number} indent - Current indentation level
   * @returns {string} TOON formatted string
   */
  static jsonToToon(json, indent = 0) {
    if (json === null) {
      return 'null';
    }
    
    if (json === undefined) {
      return '';
    }
    
    const type = typeof json;
    
    // Primitive types
    if (type === 'string') {
      // Escape special characters
      return json.includes('\n') || json.includes(':') || json.trim() !== json
        ? `"${json.replace(/"/g, '\\"')}"`
        : json;
    }
    
    if (type === 'number' || type === 'boolean') {
      return String(json);
    }
    
    // Arrays
    if (Array.isArray(json)) {
      if (json.length === 0) {
        return '[]';
      }
      
      const indentStr = '  '.repeat(indent);
      const nextIndent = indent + 1;
      const nextIndentStr = '  '.repeat(nextIndent);
      
      const items = [];
      for (const item of json) {
        if (typeof item === 'object' && item !== null) {
          // Object or array - multi-line
          const itemToon = this.jsonToToon(item, 0); // Generate without base indent
          const lines = itemToon.split('\n');
          const firstLine = `-`;
          const restLines = lines.map((line, i) => 
            i === 0 ? nextIndentStr + line : nextIndentStr + line
          );
          items.push(firstLine + '\n' + restLines.join('\n'));
        } else {
          // Primitive - inline
          const itemToon = this.jsonToToon(item, 0);
          items.push(`- ${itemToon}`);
        }
      }
      
      return items.join('\n' + indentStr);
    }
    
    // Objects
    if (type === 'object') {
      const keys = Object.keys(json);
      if (keys.length === 0) {
        return '{}';
      }
      
      const indentStr = '  '.repeat(indent);
      const nextIndent = indent + 1;
      const nextIndentStr = '  '.repeat(nextIndent);
      
      const lines = [];
      for (const key of keys) {
        const value = json[key];
        
        if (typeof value === 'object' && value !== null) {
          // Nested object or array - multi-line
          const valueToon = this.jsonToToon(value, 0); // Generate without base indent
          const valueLines = valueToon.split('\n');
          const firstLine = key;
          const restLines = valueLines.map(line => nextIndentStr + line);
          lines.push(firstLine + '\n' + restLines.join('\n'));
        } else {
          // Primitive - inline
          const valueToon = this.jsonToToon(value, 0);
          lines.push(`${key}: ${valueToon}`);
        }
      }
      
      return lines.join('\n' + indentStr);
    }
    
    return String(json);
  }

  /**
   * Convert TOON to JSON format
   * @param {string} toon - TOON formatted string
   * @returns {any} JSON object or array
   */
  static toonToJson(toon) {
    const lines = toon.split('\n');
    const result = this.parseToonValue(lines, 0, 0);
    return result.value;
  }

  /**
   * Parse TOON value (recursive)
   * @private
   */
  static parseToonValue(lines, startIndex, baseIndent = 0) {
    let index = startIndex;
    let currentObject = null;
    let isArray = false;
    
    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();
      
      if (!trimmed || trimmed.startsWith('#')) {
        index++;
        continue;
      }
      
      const indent = line.length - line.trimStart().length;
      
      // Check if we've gone back up in indentation (end of current structure)
      if (indent < baseIndent && baseIndent > 0) {
        break;
      }
      
      // Array item
      if (trimmed.startsWith('-')) {
        if (!isArray) {
          currentObject = [];
          isArray = true;
        }
        
        const itemContent = trimmed.substring(1).trim();
        
        if (itemContent) {
          // Inline value
          currentObject.push(this.parseInlineValue(itemContent));
        } else {
          // Multi-line value (object or array)
          index++;
          if (index < lines.length) {
            const nextLine = lines[index];
            const nextIndent = nextLine.length - nextLine.trimStart().length;
            const parsed = this.parseToonValue(lines, index, nextIndent);
            currentObject.push(parsed.value);
            index = parsed.index;
            continue;
          }
        }
      }
      // Key-value pair
      else if (trimmed.includes(':')) {
        if (isArray) {
          // Can't have key-value in array
          break;
        }
        
        if (!currentObject) {
          currentObject = {};
        }
        
        const colonIndex = trimmed.indexOf(':');
        const key = trimmed.substring(0, colonIndex).trim();
        const valueStr = trimmed.substring(colonIndex + 1).trim();
        
        if (valueStr) {
          // Inline value
          currentObject[key] = this.parseInlineValue(valueStr);
        } else {
          // Multi-line value
          index++;
          if (index < lines.length) {
            const nextLine = lines[index];
            const nextIndent = nextLine.length - nextLine.trimStart().length;
            
            if (nextIndent > indent) {
              const parsed = this.parseToonValue(lines, index, nextIndent);
              currentObject[key] = parsed.value;
              index = parsed.index;
              continue;
            }
          }
          // No value found, set to null
          currentObject[key] = null;
        }
      }
      // Standalone key (object property with nested value)
      else {
        if (isArray) {
          // Can't have standalone key in array
          break;
        }
        
        if (!currentObject) {
          currentObject = {};
        }
        
        const key = trimmed;
        index++;
        
        if (index < lines.length) {
          const nextLine = lines[index];
          const nextIndent = nextLine.length - nextLine.trimStart().length;
          
          if (nextIndent > indent) {
            // Nested structure
            const parsed = this.parseToonValue(lines, index, nextIndent);
            currentObject[key] = parsed.value;
            index = parsed.index;
            continue;
          }
        }
        
        // Key with no value (null or empty)
        currentObject[key] = null;
        index--; // Don't advance, process this line again
      }
      
      index++;
    }
    
    return {
      value: currentObject !== null ? currentObject : (isArray ? [] : {}),
      index: index
    };
  }

  /**
   * Parse inline TOON value
   * @private
   */
  static parseInlineValue(str) {
    str = str.trim();
    
    if (!str) return null;
    
    // String (quoted)
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1).replace(/\\"/g, '"');
    }
    
    // Number
    if (/^-?\d+\.?\d*$/.test(str)) {
      return str.includes('.') ? parseFloat(str) : parseInt(str, 10);
    }
    
    // Boolean
    if (str === 'true') return true;
    if (str === 'false') return false;
    if (str === 'null') return null;
    
    // Array/object markers
    if (str === '[]') return [];
    if (str === '{}') return {};
    
    // Unquoted string (default)
    return str;
  }

  /**
   * Format TOON with proper indentation
   */
  static formatToon(toon) {
    // Already formatted by jsonToToon
    return toon;
  }

  /**
   * Validate TOON syntax
   */
  static validateToon(toon) {
    try {
      const json = this.toonToJson(toon);
      return { valid: true, json };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

module.exports = ToonConverter;

