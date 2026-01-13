# PWA Icons

To complete the PWA setup, you need to create the following icon files:

## Required Icons:

- `icon-192x192.png` - 192x192 pixels
- `icon-384x384.png` - 384x384 pixels
- `icon-512x512.png` - 512x512 pixels

## Quick Way to Generate Icons:

### Option 1: Use Online Tools

1. Go to https://www.pwabuilder.com/imageGenerator
2. Upload your logo/icon (minimum 512x512)
3. Download the generated icons
4. Replace the placeholder files in `/public` folder

### Option 2: Use Favicon Generator

1. Go to https://favicon.io/favicon-converter/
2. Upload your logo
3. Download and extract
4. Copy the Android icons to this folder

### Option 3: Manual Creation

1. Create a 512x512 PNG image with your logo
2. Use image editing software to resize:
   - 512x512 → icon-512x512.png
   - 384x384 → icon-384x384.png
   - 192x192 → icon-192x192.png
3. Save all files in this `/public` folder

## Design Guidelines:

- Use transparent or solid background
- Keep the design simple and recognizable at small sizes
- Match your app's theme color (#3B82F6 - blue)
- Ensure good contrast for visibility
- Consider safe zones (leave padding around edges)

## Current Status:

✅ Placeholder SVG created
⚠️ PNG icons need to be created

Once you create the icons, the PWA will be fully functional!
