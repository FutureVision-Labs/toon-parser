/**
 * TOON Converter - Browser-compatible version
 * Convert between JSON and TOON formats
 */

class ToonConverter {
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
          const itemToon = this.jsonToToon(item, 0);
          const lines = itemToon.split('\n');
          const firstLine = `-`;
          const restLines = lines.map((line, i) => 
            i === 0 ? nextIndentStr + line : nextIndentStr + line
          );
          items.push(firstLine + '\n' + restLines.join('\n'));
        } else {
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
          const valueToon = this.jsonToToon(value, 0);
          const valueLines = valueToon.split('\n');
          const firstLine = key;
          const restLines = valueLines.map(line => nextIndentStr + line);
          lines.push(firstLine + '\n' + restLines.join('\n'));
        } else {
          const valueToon = this.jsonToToon(value, 0);
          lines.push(`${key}: ${valueToon}`);
        }
      }
      
      return lines.join('\n' + indentStr);
    }
    
    return String(json);
  }

  static toonToJson(toon) {
    const lines = toon.split('\n');
    const result = this.parseToonValue(lines, 0, 0);
    return result.value;
  }

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
      
      if (indent < baseIndent && baseIndent > 0) {
        break;
      }
      
      if (trimmed.startsWith('-')) {
        if (!isArray) {
          currentObject = [];
          isArray = true;
        }
        
        const itemContent = trimmed.substring(1).trim();
        
        if (itemContent) {
          currentObject.push(this.parseInlineValue(itemContent));
        } else {
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
      else if (trimmed.includes(':')) {
        if (isArray) {
          break;
        }
        
        if (!currentObject) {
          currentObject = {};
        }
        
        const colonIndex = trimmed.indexOf(':');
        const key = trimmed.substring(0, colonIndex).trim();
        const valueStr = trimmed.substring(colonIndex + 1).trim();
        
        if (valueStr) {
          currentObject[key] = this.parseInlineValue(valueStr);
        } else {
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
          currentObject[key] = null;
        }
      }
      else {
        if (isArray) {
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
            const parsed = this.parseToonValue(lines, index, nextIndent);
            currentObject[key] = parsed.value;
            index = parsed.index;
            continue;
          }
        }
        
        currentObject[key] = null;
        index--;
      }
      
      index++;
    }
    
    return {
      value: currentObject !== null ? currentObject : (isArray ? [] : {}),
      index: index
    };
  }

  static parseInlineValue(str) {
    str = str.trim();
    
    if (!str) return null;
    
    if (str.startsWith('"') && str.endsWith('"')) {
      return str.slice(1, -1).replace(/\\"/g, '"');
    }
    
    if (/^-?\d+\.?\d*$/.test(str)) {
      return str.includes('.') ? parseFloat(str) : parseInt(str, 10);
    }
    
    if (str === 'true') return true;
    if (str === 'false') return false;
    if (str === 'null') return null;
    
    if (str === '[]') return [];
    if (str === '{}') return {};
    
    return str;
  }
}

