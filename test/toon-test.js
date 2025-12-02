/**
 * TOON Converter Test Script
 * Run with: npm test
 */

const ToonConverter = require('../src/toon-converter');

console.log('🧪 Testing TOON Converter\n');

// Test 1: Simple object
console.log('Test 1: Simple Object');
const simpleJson = {
  name: "My Site",
  id: "site_123",
  active: true
};

const simpleToon = ToonConverter.jsonToToon(simpleJson);
console.log('JSON:', JSON.stringify(simpleJson, null, 2));
console.log('TOON:');
console.log(simpleToon);
console.log('');

// Test 2: Nested object
console.log('Test 2: Nested Object');
const nestedJson = {
  site: {
    id: "site_abc",
    name: "Portfolio",
    settings: {
      theme: "dark",
      plugins: ["plugin1", "plugin2"]
    }
  }
};

const nestedToon = ToonConverter.jsonToToon(nestedJson);
console.log('JSON:', JSON.stringify(nestedJson, null, 2));
console.log('TOON:');
console.log(nestedToon);
console.log('');

// Test 3: Array
console.log('Test 3: Array');
const arrayJson = {
  pages: [
    { id: "page_1", title: "Home" },
    { id: "page_2", title: "About" }
  ]
};

const arrayToon = ToonConverter.jsonToToon(arrayJson);
console.log('JSON:', JSON.stringify(arrayJson, null, 2));
console.log('TOON:');
console.log(arrayToon);
console.log('');

// Test 4: Round-trip conversion
console.log('Test 4: Round-trip Conversion');
const originalJson = {
  site: {
    id: "test_123",
    name: "Test Site",
    pages: [
      { id: "p1", title: "Page 1" }
    ]
  }
};

const toon = ToonConverter.jsonToToon(originalJson);
const convertedJson = ToonConverter.toonToJson(toon);

console.log('Original:', JSON.stringify(originalJson, null, 2));
console.log('Converted:', JSON.stringify(convertedJson, null, 2));
console.log('Match:', JSON.stringify(originalJson) === JSON.stringify(convertedJson) ? '✅' : '❌');
console.log('');

// Test 5: Token count comparison
console.log('Test 5: Token Count Comparison');
const testData = {
  site: {
    id: "site_123",
    name: "My Awesome Site",
    pages: [
      {
        id: "page_1",
        title: "Home",
        components: [
          {
            type: "hero",
            props: {
              title: "Welcome",
              subtitle: "Get started today"
            }
          }
        ]
      }
    ]
  }
};

const jsonStr = JSON.stringify(testData);
const toonStr = ToonConverter.jsonToToon(testData);

// Rough token estimation (1 token ≈ 4 characters)
const jsonTokens = Math.ceil(jsonStr.length / 4);
const toonTokens = Math.ceil(toonStr.length / 4);
const reduction = ((jsonTokens - toonTokens) / jsonTokens * 100).toFixed(1);

console.log('JSON length:', jsonStr.length, 'chars');
console.log('TOON length:', toonStr.length, 'chars');
console.log('Estimated tokens (JSON):', jsonTokens);
console.log('Estimated tokens (TOON):', toonTokens);
console.log('Token reduction:', reduction + '%');
console.log('');

console.log('✅ All tests complete!');

