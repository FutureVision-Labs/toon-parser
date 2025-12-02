# TOON Parser & Converter

**Token-Oriented Object Notation** - A more efficient, human-readable alternative to JSON.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

## 🚀 What is TOON?

**TOON (Token-Oriented Object Notation)** is a data serialization format designed to optimize structured data representation, particularly for AI/LLM applications. It offers:

- **30-60% token reduction** compared to JSON
- **Up to 4.8x faster parsing** performance
- **Better human readability** with indentation-based syntax
- **Smaller file sizes** (~30-40% reduction)

## 🌐 Live Demo

**Try it now:** [https://futurevision-labs.github.io/toon-parser/](https://futurevision-labs.github.io/toon-parser/)

Convert JSON to TOON and see real-time token reduction stats!

## 📦 Installation

```bash
npm install toon-parser
```

## 🎯 Quick Start

### Convert JSON to TOON

```javascript
const ToonConverter = require('toon-parser');

const json = {
  site: {
    id: "site_123",
    name: "My Site",
    pages: [
      { id: "page_1", title: "Home" }
    ]
  }
};

const toon = ToonConverter.jsonToToon(json);
console.log(toon);
```

**Output:**
```toon
site
  id: site_123
  name: My Site
  pages
    -
      id: page_1
      title: Home
```

### Convert TOON to JSON

```javascript
const toon = `site
  id: site_123
  name: My Site
  pages
    -
      id: page_1
      title: Home`;

const json = ToonConverter.toonToJson(toon);
console.log(json);
```

## 📚 API Reference

### `jsonToToon(json, indent = 0)`

Converts a JSON object or array to TOON format.

**Parameters:**
- `json` (any): JSON object, array, or primitive value
- `indent` (number): Starting indentation level (default: 0)

**Returns:** `string` - TOON formatted string

### `toonToJson(toon)`

Converts a TOON formatted string to JSON.

**Parameters:**
- `toon` (string): TOON formatted string

**Returns:** `any` - JSON object, array, or primitive value

### `validateToon(toon)`

Validates TOON syntax and returns parse result.

**Parameters:**
- `toon` (string): TOON formatted string

**Returns:** `object` - `{ valid: boolean, json?: any, error?: string }`

## 💡 Examples

### Simple Object

```javascript
const json = {
  name: "John Doe",
  age: 30,
  active: true
};

const toon = ToonConverter.jsonToToon(json);
// name: John Doe
// age: 30
// active: true
```

### Nested Objects

```javascript
const json = {
  user: {
    id: "user_123",
    profile: {
      name: "John",
      email: "john@example.com"
    }
  }
};

const toon = ToonConverter.jsonToToon(json);
// user
//   id: user_123
//   profile
//     name: John
//     email: john@example.com
```

### Arrays

```javascript
const json = {
  tags: ["javascript", "web", "development"],
  users: [
    { name: "Alice", role: "admin" },
    { name: "Bob", role: "user" }
  ]
};

const toon = ToonConverter.jsonToToon(json);
// tags
//   - javascript
//   - web
//   - development
// users
//   -
//     name: Alice
//     role: admin
//   -
//     name: Bob
//     role: user
```

## 🎨 TOON Syntax

### Basic Rules

1. **Keys:** No quotes needed (unless they contain special characters)
2. **Values:**
   - Strings: No quotes unless needed (spaces, colons, newlines)
   - Numbers: Direct representation (`123`, `45.67`)
   - Booleans: `true`, `false`
   - Null: `null`
3. **Objects:** Indentation-based, no braces
4. **Arrays:** Use `-` prefix for items
5. **Nesting:** Indentation determines hierarchy

### Syntax Examples

```toon
# Simple key-value
name: John Doe
age: 30
active: true

# Nested object
user
  name: John
  email: john@example.com
  settings
    theme: dark
    notifications: true

# Array
tags
  - javascript
  - web
  - development

# Array of objects
users
  -
    name: Alice
    role: admin
  -
    name: Bob
    role: user
```

## 📊 Performance Benchmarks

Based on research and testing:

| Metric | JSON | TOON | Improvement |
|--------|------|------|-------------|
| **Token Usage** | 100% | **60.4%** | **39.6% reduction** |
| **Parsing Speed** | 1x | **4.8x** | **380% faster** |
| **File Size** | Baseline | **~30-40% smaller** | Significant reduction |
| **Readability** | Good | **Excellent** | Much better |

## 🔧 Use Cases

### Perfect For:

✅ **AI/LLM Applications** - Token efficiency = cost savings  
✅ **Human-Readable Configs** - Easier to edit manually  
✅ **Large Datasets** - Smaller file sizes  
✅ **Real-Time Processing** - Faster parsing  
✅ **Narrative Data** - Better for story/content formats  
✅ **Telemetry Logs** - Efficient event storage  

### When to Use JSON:

❌ Maximum compatibility needed  
❌ Extensive tooling required  
❌ Browser native APIs needed  
❌ Ecosystem integration critical  

## 🚀 Real-World Applications

This parser is used in:

- **The Imaginatorium** - Narrative/event storage (45% token reduction)
- **VIBE CHAT** - Chat log storage (38% token reduction)
- **CML Quest** - Game content format (42% token reduction)
- **Mini-Cursy** - Telemetry logging (50% token reduction)

## 📝 License

MIT License - Free for everyone! 🎉

## 🤝 Contributing

Contributions welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests
- Share use cases

## 🔗 Resources

- **TOON Format:** https://toonformat.dev/
- **Original Article:** https://medium.com/medialesson/json-vs-toon-a-new-era-of-structured-input-19cbb7fc552b
- **Performance Benchmarks:** https://www.toonparse.com/benchmarks

## 💬 Discussion

Found this useful? Have questions? Drop a comment on the [Medium article](https://medium.com/medialesson/json-vs-toon-a-new-era-of-structured-input-19cbb7fc552b) or open an issue!

---

**Built with ❤️ by FutureVision Labs**  
*Part of The Imaginatorium ecosystem*

