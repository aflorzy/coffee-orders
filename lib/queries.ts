import { getDb } from './db';
import type {
  Drink,
  Bean,
  SyrupOption,
  Order,
  OrderFormData,
  OrderStatus,
} from './types';

// ---------------------------------------------------------------------------
// Drinks
// ---------------------------------------------------------------------------

export function getDrinks(): Drink[] {
  const db = getDb();
  return db.prepare('SELECT * FROM drinks WHERE is_active = 1').all() as Drink[];
}

export function getDrink(id: string): Drink | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM drinks WHERE id = ?').get(id) as Drink | undefined;
}

export function updateDrinkDefaults(
  id: string,
  defaults: Partial<
    Pick<
      Drink,
      | 'default_temp'
      | 'default_syrup'
      | 'default_sweetness'
      | 'default_milk'
      | 'default_caffeine'
    >
  >
): void {
  const db = getDb();
  const entries = Object.entries(defaults).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return;
  const setClauses = entries.map(([k]) => `${k} = ?`).join(', ');
  const values = entries.map(([, v]) => v);
  db.prepare(`UPDATE drinks SET ${setClauses} WHERE id = ?`).run(...values, id);
}

// ---------------------------------------------------------------------------
// Beans
// ---------------------------------------------------------------------------

export function getBeans(): Bean[] {
  const db = getDb();
  return db.prepare('SELECT * FROM beans WHERE is_active = 1 ORDER BY created_at DESC').all() as Bean[];
}

export function getBean(id: string): Bean | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM beans WHERE id = ?').get(id) as Bean | undefined;
}

export function createBean(data: Omit<Bean, 'id' | 'created_at'>): string {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO beans (id, name, brand, origin, roast_level, tasting_notes, picture_url, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    data.name,
    data.brand ?? null,
    data.origin ?? null,
    data.roast_level ?? null,
    data.tasting_notes ?? null,
    data.picture_url ?? null,
    data.is_active ?? 1
  );
  return id;
}

export function updateBean(id: string, data: Partial<Omit<Bean, 'id' | 'created_at'>>): void {
  const db = getDb();
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return;
  const setClauses = entries.map(([k]) => `${k} = ?`).join(', ');
  const values = entries.map(([, v]) => v);
  db.prepare(`UPDATE beans SET ${setClauses} WHERE id = ?`).run(...values, id);
}

export function deleteBean(id: string): void {
  const db = getDb();
  db.prepare('UPDATE beans SET is_active = 0 WHERE id = ?').run(id);
}

// ---------------------------------------------------------------------------
// Syrups
// ---------------------------------------------------------------------------

export function getSyrups(): SyrupOption[] {
  const db = getDb();
  return db.prepare('SELECT * FROM syrups ORDER BY name ASC').all() as SyrupOption[];
}

export function createSyrup(name: string): string {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO syrups (id, name) VALUES (?, ?)').run(id, name);
  return id;
}

export function updateSyrup(id: string, data: { name?: string; is_active?: number }): void {
  const db = getDb();
  const entries = Object.entries(data).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return;
  const setClauses = entries.map(([k]) => `${k} = ?`).join(', ');
  const values = entries.map(([, v]) => v);
  db.prepare(`UPDATE syrups SET ${setClauses} WHERE id = ?`).run(...values, id);
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

export function getOrders(): Order[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT o.*, d.name AS drink_name, b.name AS bean_name
       FROM orders o
       LEFT JOIN drinks d ON o.drink_id = d.id
       LEFT JOIN beans b ON o.bean_id = b.id
       ORDER BY o.created_at DESC`
    )
    .all() as Order[];
}

export function getOrder(id: string): Order | undefined {
  const db = getDb();
  return db
    .prepare(
      `SELECT o.*, d.name AS drink_name, b.name AS bean_name
       FROM orders o
       LEFT JOIN drinks d ON o.drink_id = d.id
       LEFT JOIN beans b ON o.bean_id = b.id
       WHERE o.id = ?`
    )
    .get(id) as Order | undefined;
}

export function createOrder(data: OrderFormData): string {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO orders (id, customer_name, drink_id, temp, syrup, sweetness, milk, caffeine, special_notes, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`
  ).run(
    id,
    data.customer_name,
    data.drink_id,
    data.temp,
    data.syrup,
    data.sweetness,
    data.milk,
    data.caffeine,
    data.special_notes ?? null
  );
  return id;
}

export function updateOrderStatus(id: string, status: OrderStatus): void {
  const db = getDb();
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
}
