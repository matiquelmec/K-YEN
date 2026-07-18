import re
import os
import sys

# Reconfigure stdout to use UTF-8
sys.stdout.reconfigure(encoding='utf-8')

backup_path = r"C:\Users\Matías Riquelme\Desktop\Proyectos documentados\tienda-vestidos\supabase\db_cluster-29-11-2025@07-02-58.backup"
output_path = r"C:\Users\Matías Riquelme\Desktop\Proyectos documentados\tienda-vestidos\supabase\turso_bootstrap.sql"

# SQLite table schemas
schema_sql = """-- 🌙 TURSO BOOTSTRAP SCHEMA & SEED DATA (KÜYEN)

CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS colors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    hex_code TEXT,
    display_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sizes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    bust_cm INTEGER,
    waist_cm INTEGER,
    hips_cm INTEGER,
    is_plus_size INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    category_id TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL,
    featured INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_images (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    url TEXT NOT NULL,
    alt_text TEXT,
    is_primary INTEGER DEFAULT 0,
    display_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_variants (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    size_id TEXT NOT NULL,
    color_id TEXT NOT NULL,
    sku_variant TEXT,
    stock_quantity INTEGER DEFAULT 0,
    is_available INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY(size_id) REFERENCES sizes(id) ON DELETE CASCADE,
    FOREIGN KEY(color_id) REFERENCES colors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE,
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    payment_id TEXT,
    total REAL NOT NULL,
    shipping_address TEXT,
    items TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
"""

def clean_val(val):
    if val == '\\N':
        return "NULL"
    if val == 't':
        return "1"
    if val == 'f':
        return "0"
    # Escape single quotes
    escaped = val.replace("'", "''")
    return f"'{escaped}'"

def parse_copy_data_robust(content, table_name):
    copy_pattern = rf"COPY public\.{table_name}\s+\(([^)]+)\)\s+FROM stdin;"
    match = re.search(copy_pattern, content, re.IGNORECASE)
    if not match:
        print(f"⚠️ No data copy found for table: {table_name}")
        return []
    
    cols = [c.strip() for c in match.group(1).split(",")]
    start_pos = match.end()
    
    lines_block = []
    remaining_text = content[start_pos:]
    for line in remaining_text.splitlines():
        trimmed = line.strip()
        if trimmed == "\\.":
            break
        lines_block.append(line)
        
    insert_statements = []
    for row in lines_block:
        if not row.strip():
            continue
        vals = row.split("\t")
        if len(vals) != len(cols):
            continue
        cleaned_vals = [clean_val(v) for v in vals]
        cols_str = ", ".join(cols)
        vals_str = ", ".join(cleaned_vals)
        insert_statements.append(f"INSERT INTO {table_name} ({cols_str}) VALUES ({vals_str});")
        
    return insert_statements

def main():
    print("🚀 Iniciando conversión de backup PostgreSQL a SQLite...")
    with open(backup_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    tables_to_migrate = [
        "categories",
        "colors",
        "sizes",
        "products",
        "product_images",
        "product_variants"
    ]
    
    all_inserts = []
    for table in tables_to_migrate:
        inserts = parse_copy_data_robust(content, table)
        print(f"📊 Tabla '{table}': {len(inserts)} registros extraídos.")
        all_inserts.extend(inserts)
        
    # Write to final bootstrap file
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(schema_sql)
        f.write("\n-- Seed Data from PostgreSQL Backup\n")
        f.write("\n".join(all_inserts))
        f.write("\n")
        
    print(f"🎉 Conversión finalizada con éxito. Archivo creado en {output_path}")

if __name__ == "__main__":
    main()
