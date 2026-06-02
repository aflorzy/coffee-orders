import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'coffee-orders.db');

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma('journal_mode = WAL');
    _db.pragma('foreign_keys = ON');
    initSchema(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS beans (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      brand TEXT,
      origin TEXT,
      roast_level TEXT,
      tasting_notes TEXT,
      picture_url TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS syrups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS drinks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      is_active INTEGER DEFAULT 1,
      default_temp TEXT DEFAULT 'hot',
      default_syrup TEXT DEFAULT 'none',
      default_sweetness TEXT DEFAULT 'light',
      default_milk TEXT DEFAULT 'oat',
      default_caffeine TEXT DEFAULT 'full-caf'
    );

    CREATE TABLE IF NOT EXISTS sweetness_config (
      value TEXT PRIMARY KEY,
      subtitle TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      drink_id TEXT NOT NULL REFERENCES drinks(id),
      bean_id TEXT REFERENCES beans(id),
      temp TEXT NOT NULL,
      syrup TEXT DEFAULT 'none',
      sweetness TEXT DEFAULT 'default',
      milk TEXT DEFAULT 'oat',
      caffeine TEXT DEFAULT 'full-caf',
      special_notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  migrate(db);
  seed(db);
}

function migrate(db: Database.Database) {
  // Add style column to orders if it doesn't exist yet
  const cols = db.pragma('table_info(orders)') as Array<{ name: string }>;
  if (!cols.find((c) => c.name === 'style')) {
    db.exec(`ALTER TABLE orders ADD COLUMN style TEXT DEFAULT 'regular'`);
  }

  // Aerocano is now an Americano style option, not a standalone drink.
  // Migrate any existing aerocano orders to americano + style='aerocano' before removing the drink row.
  const aerocano = db
    .prepare("SELECT COUNT(*) as count FROM drinks WHERE id = 'aerocano'")
    .get() as { count: number };
  if (aerocano.count > 0) {
    db.prepare(
      "UPDATE orders SET drink_id = 'americano', style = 'aerocano' WHERE drink_id = 'aerocano'"
    ).run();
    db.prepare("DELETE FROM drinks WHERE id = 'aerocano'").run();
  }
}

function seed(db: Database.Database) {
  const drinkCount = (db.prepare('SELECT COUNT(*) as count FROM drinks').get() as { count: number }).count;
  if (drinkCount === 0) {
    const ins = db.prepare(
      'INSERT INTO drinks (id, name, default_temp, default_syrup, default_sweetness, default_milk, default_caffeine) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    ins.run('latte', 'Latte', 'iced', 'vanilla', 'light', 'oat', 'full-caf');
    ins.run('americano', 'Americano', 'hot', 'none', 'none', 'none', 'full-caf');
  }

  const syrupCount = (db.prepare('SELECT COUNT(*) as count FROM syrups').get() as { count: number }).count;
  if (syrupCount === 0) {
    const ins = db.prepare('INSERT INTO syrups (id, name) VALUES (?, ?)');
    ins.run('vanilla', 'Vanilla');
    ins.run('almond', 'Almond');
  }

  const sweetnessConfigCount = (db.prepare('SELECT COUNT(*) as count FROM sweetness_config').get() as { count: number }).count;
  if (sweetnessConfigCount === 0) {
    const ins = db.prepare('INSERT INTO sweetness_config (value, subtitle) VALUES (?, ?)');
    ins.run('none', '');
    ins.run('light', '1 tsp / 5 mL');
    ins.run('default', '2 tsp / 10 mL');
    ins.run('extra', '1 Tbsp / 15 mL');
  }
}
