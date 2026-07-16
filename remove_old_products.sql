-- First, make sure the 4 POSHAN products are the only ones featured
UPDATE products 
SET is_featured = true 
WHERE slug IN (
  'poshan-growing-champs',
  'poshan-teen-queens',
  'poshan-mom-strong',
  'poshan-glp-support'
);

-- Next, delete EVERY product that is not one of the 4 POSHAN products
DELETE FROM products 
WHERE slug NOT IN (
  'poshan-growing-champs',
  'poshan-teen-queens',
  'poshan-mom-strong',
  'poshan-glp-support'
);
