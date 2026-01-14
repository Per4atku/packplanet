import { getLatestPriceList } from "@/lib/queries/products";
import { Button } from "@/components/ui/button";
import { Download, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import * as XLSX from "xlsx";
import { readFile } from "fs/promises";
import { join } from "path";
import type { Metadata } from "next";
import { ScrollToTop } from "./scroll-to-top";
import { CategoryNav } from "./category-nav";

// Force dynamic rendering - this page needs fresh data
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Прайс-Лист - Планета Упаковки",
  description: "Актуальный прайс-лист на упаковку и одноразовую посуду",
};

export default async function PriceListPage() {
  const priceList = await getLatestPriceList();

  // If no price list exists, show message
  if (!priceList) {
    return (
      <main className="min-h-screen containerize py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <Link href="/#price-list">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Назад
            </Button>
          </Link>

          <div className="rounded-2xl border bg-card p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h1 className="mb-2 text-2xl font-bold">Прайс-лист недоступен</h1>
            <p className="text-muted-foreground">
              В данный момент прайс-лист не загружен. Пожалуйста, свяжитесь с
              нами для получения актуальных цен.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Parse XLSX file
  let tableData: {
    headers: string[];
    rows: { cells: string[]; isCategory: boolean; categoryId?: string }[];
    categories: { id: string; name: string }[];
  } | null = null;
  let error: string | null = null;

  try {
    // Extract filename from path (path includes the prefixed filename)
    // Path format: /uploads/pricelist/pricelist-timestamp-filename.ext
    const pathParts = priceList.path.split("/");
    const actualFilename = pathParts[pathParts.length - 1];

    // Check if file is XLSX/XLS
    const ext = actualFilename.split(".").pop()?.toLowerCase();

    if (!ext || !["xlsx", "xls"].includes(ext)) {
      error = `Файл имеет неподдерживаемый формат (${
        ext || "неизвестный"
      }). Поддерживаются только XLSX и XLS файлы. Вы можете скачать файл с помощью кнопки выше.`;
      throw new Error("Unsupported file format");
    }

    // Read file from filesystem (files are stored in uploads/pricelist/)
    const filePath = join(
      process.cwd(),
      "uploads",
      "pricelist",
      actualFilename
    );
    const fileBuffer = await readFile(filePath);

    // Parse XLSX
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert to JSON (array of arrays) with defval to preserve empty cells
    const data = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: "", // Preserve empty cells as empty strings
    }) as any[][];

    if (data.length < 2) {
      error = "Прайс-лист пустой или содержит недостаточно данных";
    } else {
      // Define the columns to display based on the sheet structure:
      // Column 0: Артикул, Column 1: Наименование, Column 2: units (no header), Column 3: Розничная цена
      const columnMapping = [
        { index: 0, header: "Артикул" },
        { index: 1, header: "Наименование" },
        { index: 2, header: "" }, // Units - no header
        { index: 3, header: "Розничная цена" },
      ];

      const headers = columnMapping.map((col) => col.header);

      // Helper to create a URL-safe ID from category name
      const createCategoryId = (name: string, index: number) => {
        const slug = name
          .toLowerCase()
          .replace(/[^\p{L}\p{N}\s-]/gu, "") // Keep letters (any language), numbers, spaces, hyphens
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-")
          .trim();
        return `category-${index}-${slug || "unnamed"}`;
      };

      let categoryIndex = 0;
      const categories: { id: string; name: string }[] = [];

      // Get all data rows (skip first two rows: row 0 and header row 1)
      const rows = data
        .slice(2)
        .filter((row) =>
          row.some((cell) => cell !== undefined && cell !== null && cell !== "")
        )
        .map((row) => {
          // Extract only the specified columns
          const cells = columnMapping.map((col) => {
            const cell = row[col.index];
            return cell !== undefined && cell !== null ? String(cell) : "";
          });

          // Detect category rows: only first column has data, others are empty
          const hasFirstColumn = cells[0].trim() !== "";
          const otherColumnsEmpty = cells
            .slice(1)
            .every((cell) => cell.trim() === "");
          const isCategory = hasFirstColumn && otherColumnsEmpty;

          if (isCategory) {
            const categoryId = createCategoryId(cells[0], categoryIndex++);
            categories.push({ id: categoryId, name: cells[0] });
            return { cells, isCategory, categoryId };
          }

          return { cells, isCategory };
        });

      tableData = { headers, rows, categories };
    }
  } catch (err) {
    console.error("Error parsing XLSX:", err);
    error = "Не удалось загрузить прайс-лист. Файл поврежден или недоступен.";
  }

  return (
    <main className="min-h-screen containerize py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link href="/#price-list">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight">Прайс-Лист</h1>
            <p className="mt-2 text-muted-foreground">
              Актуальный прайс-лист на{" "}
              {new Date(priceList.uploadedAt).toLocaleDateString("ru-RU")}
            </p>
          </div>
          <Button asChild>
            <a href={priceList.path} download={priceList.filename}>
              <Download className="mr-2 h-4 w-4" />
              Скачать
            </a>
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h2 className="mb-2 text-xl font-semibold">Ошибка загрузки</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Table */}
        {tableData && (
          <div className="overflow-x-auto rounded-xl border bg-card shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/50">
                  {tableData.headers.map((header, i) => (
                    <th
                      key={i}
                      className="sticky top-0 bg-muted/50 px-4 py-3 text-left text-sm font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIndex) =>
                  row.isCategory ? (
                    <tr
                      key={rowIndex}
                      id={row.categoryId}
                      className="border-b bg-primary/10 last:border-0 scroll-mt-20"
                    >
                      <td
                        colSpan={tableData.headers.length}
                        className="px-4 py-3 text-sm font-semibold text-primary"
                      >
                        {row.cells[0]}
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={rowIndex}
                      className="border-b last:border-0 hover:bg-muted/30"
                    >
                      {row.cells.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-3 text-sm">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Navigation components */}
        {tableData && <CategoryNav categories={tableData.categories} />}
        <ScrollToTop />
      </div>
    </main>
  );
}
