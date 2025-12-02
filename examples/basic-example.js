/**
 * Basic TOON Converter Example
 * Run with: npm run example
 */

const ToonConverter = require('../src/toon-converter');

console.log('🚀 TOON Converter - Basic Example\n');

// Example: Site configuration
const siteConfig = {
  id: "site_abc123",
  name: "My Portfolio",
  settings: {
    theme: "dark",
    plugins: ["analytics", "seo"],
    seo: {
      title: "My Portfolio",
      description: "Check out my work",
      keywords: ["portfolio", "web", "design"]
    }
  },
  pages: [
    {
      id: "page_1",
      name: "Home",
      components: [
        {
          type: "hero",
          props: {
            title: "Welcome",
            subtitle: "Get started today",
            ctaText: "Learn More"
          }
        }
      ]
    }
  ]
};

console.log('📄 Original JSON:');
console.log(JSON.stringify(siteConfig, null, 2));
console.log('\n');

// Convert to TOON
const toon = ToonConverter.jsonToToon(siteConfig);
console.log('🎨 TOON Format:');
console.log(toon);
console.log('\n');

// Convert back to JSON
const converted = ToonConverter.toonToJson(toon);
console.log('✅ Converted back to JSON:');
console.log(JSON.stringify(converted, null, 2));
console.log('\n');

// Size comparison
const jsonSize = JSON.stringify(siteConfig).length;
const toonSize = toon.length;
const reduction = ((jsonSize - toonSize) / jsonSize * 100).toFixed(1);

console.log('📊 Size Comparison:');
console.log(`JSON: ${jsonSize} characters`);
console.log(`TOON: ${toonSize} characters`);
console.log(`Reduction: ${reduction}%`);
console.log('\n');

console.log('✨ Done!');

