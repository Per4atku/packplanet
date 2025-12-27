# Content Management

This directory contains YAML configuration files that control all the text content on the website. By editing these files, you can change the text displayed on the website without touching the code.

## 📁 Files

- **`main.yml`** - Main page content (homepage, hero, sections, footer, header)
- **catalog.yml** - Catalog page content (product listings, filters, pagination)
- **admin.yml** - Admin dashboard content (all admin panel text)

## 🚀 How to Use

### 1. Edit Content

Simply open any YAML file and edit the text values. For example, in `main.yml`:

```yaml
hero:
  title: "Ваш надежный поставщик"
  titleHighlight: "упаковки"
  subtitle: "Одноразовая посуда и упаковка.\nБыстрая доставка"
```

Change it to:

```yaml
hero:
  title: "Your reliable supplier"
  titleHighlight: "packaging"
  subtitle: "Disposable tableware and packaging.\nFast delivery"
```

### 2. Restart the Development Server

After making changes, restart your development server for the changes to take effect:

```bash
pnpm dev
```

### 3. Build for Production

When deploying, the content files are read during the build process:

```bash
pnpm build
```

## 📝 File Structure

### main.yml

Controls the main page content:

- **site**: Site name and tagline
- **header**: Navigation menu items
- **hero**: Hero section (main banner)
- **featuredProducts**: Featured products section heading
- **priceList**: Price list download section
- **partners**: Partners section
- **delivery**: Delivery information section
- **contacts**: Contact information section
- **footer**: Footer content (links, contacts, hours)

### catalog.yml

Controls the catalog page content:

- **page**: Page metadata (title, description)
- **header**: Page heading
- **filters**: Filter labels (category selector)
- **results**: Results count text
- **pagination**: Pagination buttons (Next, Previous, etc.)
- **product**: Product card labels

### admin.yml

Controls the admin dashboard content:

- **login**: Login page text
- **navigation**: Sidebar navigation menu items
- **actions**: Common action buttons (Edit, Delete, Export, etc.)
- **products**: Products page content
- **categories**: Categories page content
- **partners**: Partners page content
- **priceList**: Price list management page
- **productForm**: Product creation/editing form
- **categoryForm**: Category form
- **partnerForm**: Partner form
- **uploadForm**: File upload form

## ⚠️ Important Notes

### YAML Syntax Rules

1. **Indentation matters**: Use 2 spaces for indentation, not tabs
2. **Quotes**: Use quotes for text with special characters (colons, quotes, etc.)
3. **Lists**: Use `-` for list items
4. **Multi-line text**: Use `\n` for line breaks or use `|` for multi-line blocks

### Examples

**Simple text:**
```yaml
title: "My Title"
```

**Text with line breaks:**
```yaml
subtitle: "Line 1\nLine 2"
```

**Lists:**
```yaml
phones:
  - "8 (800) 234-78-76"
  - "+7 (421) 244-48-55"
```

**Nested structure:**
```yaml
hero:
  title: "Main Title"
  subtitle: "Subtitle"
  buttons:
    primary: "Click Me"
    secondary: "Learn More"
```

## 🔧 Technical Details

### How It Works

1. Content files are stored in `/content/*.yml`
2. The utility function `/src/lib/content.ts` reads and parses these files
3. Components import and use the content via the utility functions
4. Content is loaded at build time for optimal performance

### Using Content in Components

Server Components (recommended):

```tsx
import { getMainContent } from '@/lib/content';

export default function HomePage() {
  const content = getMainContent();

  return (
    <h1>{content.hero.title}</h1>
  );
}
```

### Adding New Content

To add new content fields:

1. Add the field to the appropriate YAML file
2. Update the TypeScript types in `/src/lib/content.ts`
3. Use the content in your components

## 🌍 Internationalization (Future)

To support multiple languages:

1. Create language-specific files: `main.en.yml`, `main.ru.yml`, etc.
2. Modify the utility functions to accept a language parameter
3. Load the appropriate file based on the user's language preference

## 📖 Examples

### Changing the Hero Title

**File**: `content/main.yml`

```yaml
hero:
  title: "Your New Title Here"
  titleHighlight: "highlighted word"
```

### Changing Button Text

**File**: `content/admin.yml`

```yaml
actions:
  edit: "Изменить"  # Change to your preferred text
  delete: "Удалить"
  cancel: "Отменить"
```

### Adding a New Section Heading

**File**: `content/main.yml`

```yaml
newSection:
  heading: "My New Section"
  description: "Section description"
```

Then use it in your component:

```tsx
const content = getMainContent();
<h2>{content.newSection.heading}</h2>
```

## 🐛 Troubleshooting

### Changes Not Appearing

1. Make sure you saved the YAML file
2. Restart the development server
3. Clear your browser cache
4. Check the console for YAML parsing errors

### YAML Parsing Errors

- Check indentation (2 spaces, not tabs)
- Ensure quotes are properly closed
- Validate YAML syntax at https://www.yamllint.com/

### Server Won't Start

- Check for syntax errors in YAML files
- Ensure all required fields are present
- Look at terminal error messages for details

## 📚 Resources

- [YAML Syntax Guide](https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html)
- [YAML Validator](https://www.yamllint.com/)
- [Project Documentation](../README.md)
