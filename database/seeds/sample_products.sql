-- Insert sample products
INSERT INTO
    products (
        name,
        slug,
        description,
        short_description,
        category,
        price,
        compare_price,
        quantity,
        sku,
        is_featured
    )
VALUES (
        'MDF Board 18mm',
        'mdf-board-18mm',
        'High-quality Medium Density Fiberboard perfect for furniture and cabinetry. Smooth surface, easy to paint and machine.',
        'Premium MDF board for all your woodworking needs',
        'Boards',
        2500.00,
        3000.00,
        500,
        'MDF-18-001',
        TRUE
    ),
    (
        'Premium Plywood 12mm',
        'premium-plywood-12mm',
        'Grade A plywood made from sustainable sources. Excellent strength and durability for construction and furniture.',
        'Strong and durable plywood for construction',
        'Boards',
        3500.00,
        4200.00,
        300,
        'PLY-12-002',
        TRUE
    ),
    (
        'Modern Interior Door',
        'modern-interior-door',
        'Contemporary design interior door with premium finish. Available in various sizes and colors.',
        'Stylish interior door for modern homes',
        'Doors',
        8500.00,
        10000.00,
        150,
        'DR-MOD-001',
        TRUE
    ),
    (
        'DecoFloor Laminated Flooring',
        'decofloor-laminated-flooring',
        'Luxury vinyl flooring that combines the look of wood with the benefits of tiles. Water-resistant and durable.',
        'Elegant flooring solution for any room',
        'Flooring',
        1200.00,
        1500.00,
        1000,
        'FLR-DECO-001',
        TRUE
    ),
    (
        'Block Board 18mm',
        'block-board-18mm',
        'Solid block board made from premium wood strips. Ideal for shelving and heavy-duty applications.',
        'Heavy-duty block board for shelving',
        'Boards',
        3200.00,
        3800.00,
        200,
        'BLK-18-001',
        FALSE
    ),
    (
        'Pre-laminated Board',
        'pre-laminated-board',
        'Ready-to-use laminated board in multiple finishes. Save time on finishing and painting.',
        'Ready-to-use laminated board',
        'Boards',
        2800.00,
        0,
        400,
        'LAM-001',
        FALSE
    ),
    (
        'MDF Furniture Set',
        'mdf-furniture-set',
        'Modern MDF furniture set including bed, wardrobe, and nightstand. Contemporary design with durable construction.',
        'Complete bedroom furniture set',
        'Furniture',
        45000.00,
        55000.00,
        50,
        'FRN-MDF-001',
        TRUE
    ),
    ('Power Transmission Pole',)