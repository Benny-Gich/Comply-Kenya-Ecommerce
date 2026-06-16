export const CATEGORIES = [
    { id: 'mdf-boards', name: 'MDF Boards' },
    { id: 'plywood', name: 'Plywood' },
    { id: 'doors', name: 'Doors' },
    { id: 'flooring', name: 'Flooring' },
    { id: 'timber', name: 'Timber' },
    { id: 'hardware', name: 'Hardware' },
];

export const PRODUCTS = [
    {
        id: 1,
        name: 'MDF Board 18mm',
        category: 'mdf-boards',
        categoryName: 'MDF Boards',
        price: 2500,
        originalPrice: 3000,
        image: 'https://cdn.pixabay.com/photo/2015/05/31/13/36/laminated-791794_1280.jpg',
        images: [
            'https://cdn.pixabay.com/photo/2015/05/31/13/36/laminated-791794_1280.jpg',
            'https://cdn.pixabay.com/photo/2015/05/31/13/36/laminated-791795_640.jpg',
        ],
        rating: 4.5,
        reviewCount: 42,
        inStock: true,
        stockQty: 150,
        description:
            'Premium 18mm MDF board ideal for furniture, cabinetry, and interior fittings. Smooth surface ready for painting or laminating. Dimensions: 2440mm x 1220mm x 18mm.',
        specs: {
            Thickness: '18mm',
            Size: '2440mm x 1220mm',
            Density: '750 kg/m³',
            Finish: 'Sanded smooth',
            Application: 'Interior use',
        },
        featured: true,
    },
    {
        id: 2,
        name: 'MDF Board 12mm',
        category: 'mdf-boards',
        categoryName: 'MDF Boards',
        price: 1800,
        image: 'https://cdn.pixabay.com/photo/2015/05/31/13/36/laminated-791795_640.jpg',
        images: ['https://cdn.pixabay.com/photo/2015/05/31/13/36/laminated-791795_640.jpg'],
        rating: 4.3,
        reviewCount: 28,
        inStock: true,
        stockQty: 200,
        description:
            'Lightweight 12mm MDF board suitable for wall panels, shelving, and light furniture.',
        specs: {
            Thickness: '12mm',
            Size: '2440mm x 1220mm',
            Density: '720 kg/m³',
            Finish: 'Sanded smooth',
            Application: 'Interior use',
        },
        featured: false,
    },
    {
        id: 3,
        name: 'Premium Hardwood Plywood 18mm',
        category: 'plywood',
        categoryName: 'Plywood',
        price: 3500,
        image: 'https://s.alicdn.com/@sc04/kf/H70d9c2a872a041e08de51cb7b5b049d53.jpg_300x300.jpg',
        images: ['https://s.alicdn.com/@sc04/kf/H70d9c2a872a041e08de51cb7b5b049d53.jpg_300x300.jpg'],
        rating: 4.8,
        reviewCount: 67,
        inStock: true,
        stockQty: 80,
        description:
            'High-quality hardwood plywood with multiple plies for superior strength. Ideal for flooring, roofing, and structural applications.',
        specs: {
            Thickness: '18mm',
            Size: '2440mm x 1220mm',
            Plies: '13',
            Core: 'Hardwood',
            Glue: 'WBP Marine Grade',
        },
        featured: true,
    },
    {
        id: 4,
        name: 'Marine Grade Plywood 12mm',
        category: 'plywood',
        categoryName: 'Plywood',
        price: 2800,
        image: 'https://s.alicdn.com/@sc04/kf/H98ec508d7b9446f88d6a0b5ab1ade1a91.jpg_300x300.jpg',
        images: ['https://s.alicdn.com/@sc04/kf/H98ec508d7b9446f88d6a0b5ab1ade1a91.jpg_300x300.jpg'],
        rating: 4.7,
        reviewCount: 35,
        inStock: true,
        stockQty: 60,
        description: 'Water-resistant marine grade plywood for outdoor and high-moisture environments.',
        specs: {
            Thickness: '12mm',
            Size: '2440mm x 1220mm',
            Grade: 'Marine',
            Glue: 'WBP Type',
            Application: 'Outdoor & Marine',
        },
        featured: false,
    },
    {
        id: 5,
        name: 'Modern Interior Flush Door',
        category: 'doors',
        categoryName: 'Doors',
        price: 8500,
        originalPrice: 10000,
        image: 'https://sharonply.com/wp-content/uploads/2025/09/Pre-Laminated-vs-Laminated-Boards-1024x530.jpg',
        images: ['https://sharonply.com/wp-content/uploads/2025/09/Pre-Laminated-vs-Laminated-Boards-1024x530.jpg'],
        rating: 4.7,
        reviewCount: 53,
        inStock: true,
        stockQty: 45,
        description:
            'Sleek flush interior door with solid core for superior sound insulation. Pre-finished surface ready for painting.',
        specs: {
            Size: '2100mm x 900mm',
            Core: 'Solid Timber',
            Finish: 'Primed',
            Thickness: '40mm',
            Fire: 'FD30 rated',
        },
        featured: true,
    },
    {
        id: 6,
        name: 'Mahogany Solid Wood Door',
        category: 'doors',
        categoryName: 'Doors',
        price: 15000,
        image: 'https://s.alicdn.com/@sc04/kf/Haddd906f8cc84fdb85d10b7f049259a8Q.jpg_300x300.jpg',
        images: ['https://s.alicdn.com/@sc04/kf/Haddd906f8cc84fdb85d10b7f049259a8Q.jpg_300x300.jpg'],
        rating: 4.9,
        reviewCount: 21,
        inStock: true,
        stockQty: 20,
        description:
            'Premium solid mahogany door for exterior or interior use. Naturally resistant to rot and insects.',
        specs: {
            Size: '2100mm x 900mm',
            Material: 'Solid Mahogany',
            Finish: 'Oiled',
            Thickness: '50mm',
            Application: 'Exterior/Interior',
        },
        featured: false,
    },
    {
        id: 7,
        name: 'DecoFloor Laminated Flooring 8mm',
        category: 'flooring',
        categoryName: 'Flooring',
        price: 1200,
        image: 'https://t4.ftcdn.net/jpg/12/51/11/75/360_F_1251117545_rMTeb4gPXSUFRP9yvQ8BEwCmjXG5MR3b.jpg',
        images: ['https://t4.ftcdn.net/jpg/12/51/11/75/360_F_1251117545_rMTeb4gPXSUFRP9yvQ8BEwCmjXG5MR3b.jpg'],
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        stockQty: 500,
        description:
            'Durable laminated flooring with realistic wood texture. Easy click-lock installation. Price per square metre.',
        specs: {
            Thickness: '8mm',
            Coverage: '1 m²/plank',
            AC: 'AC4 (Heavy Domestic)',
            Finish: 'Matt',
            Installation: 'Click-lock floating',
        },
        featured: true,
    },
    {
        id: 8,
        name: 'Vinyl Plank Flooring 5mm',
        category: 'flooring',
        categoryName: 'Flooring',
        price: 950,
        originalPrice: 1100,
        image: 'https://s.alicdn.com/@sc04/kf/H5a46474329a74e73a7f1541257a9a160b.jpg_300x300.jpg',
        images: ['https://s.alicdn.com/@sc04/kf/H5a46474329a74e73a7f1541257a9a160b.jpg_300x300.jpg'],
        rating: 4.4,
        reviewCount: 44,
        inStock: true,
        stockQty: 300,
        description:
            '100% waterproof vinyl plank flooring ideal for kitchens and bathrooms. Price per square metre.',
        specs: {
            Thickness: '5mm',
            Material: '100% Vinyl',
            Waterproof: 'Yes',
            Finish: 'Embossed',
            Installation: 'Click-lock',
        },
        featured: false,
    },
    {
        id: 9,
        name: 'Cypress Timber Post 100x100mm',
        category: 'timber',
        categoryName: 'Timber',
        price: 850,
        image: 'https://s.alicdn.com/@sc04/kf/Hdc3df8082b1742d8af552e9b19af627fF.jpg_300x300.jpg',
        images: ['https://s.alicdn.com/@sc04/kf/Hdc3df8082b1742d8af552e9b19af627fF.jpg_300x300.jpg'],
        rating: 4.5,
        reviewCount: 18,
        inStock: true,
        stockQty: 120,
        description:
            'Treated cypress timber post for structural and fencing applications. Length: 3 metres.',
        specs: {
            Size: '100mm x 100mm x 3000mm',
            Species: 'Cypress',
            Treatment: 'CCA treated',
            Application: 'Structural/Fencing',
        },
        featured: false,
    },
    {
        id: 10,
        name: 'Concealed Hinge Set (10 pairs)',
        category: 'hardware',
        categoryName: 'Hardware',
        price: 450,
        image: 'https://media.istockphoto.com/id/530948676/photo/mdf-wood-boards.jpg?s=612x612&w=0&k=20&c=0oVZHMf7aDcgymNdN4SwxSVeWCs17ZW8aC3RrrOfLPc=',
        images: ['https://media.istockphoto.com/id/530948676/photo/mdf-wood-boards.jpg?s=612x612&w=0&k=20&c=0oVZHMf7aDcgymNdN4SwxSVeWCs17ZW8aC3RrrOfLPc='],
        rating: 4.6,
        reviewCount: 112,
        inStock: true,
        stockQty: 1000,
        description:
            'European-style concealed cabinet hinges with soft-close mechanism. Pack of 10 pairs with mounting plates.',
        specs: {
            Type: 'Full overlay concealed',
            Opening: '110°',
            'Soft close': 'Yes',
            Material: 'Steel with nickel finish',
            Pack: '10 pairs',
        },
        featured: false,
    },
    {
        id: 11,
        name: 'Cabinet Drawer Slides 450mm (5 pairs)',
        category: 'hardware',
        categoryName: 'Hardware',
        price: 680,
        image: 'https://media.istockphoto.com/id/1307050831/photo/samples-of-laminated-board-and-mdf-construction-or-furniture-finishing-design-concept.jpg?s=612x612&w=0&k=20&c=xHZ2i4Uox0oPeET02wESgL0nVvAGzYsGYWppuJF8U=',
        images: ['https://media.istockphoto.com/id/1307050831/photo/samples-of-laminated-board-and-mdf-construction-or-furniture-finishing-design-concept.jpg?s=612x612&w=0&k=20&c=xHZ2i4Uox0oPeET02wESgL0nVvAGzYsGYWppuJF8U='],
        rating: 4.7,
        reviewCount: 76,
        inStock: false,
        stockQty: 0,
        description:
            'Heavy-duty undermount drawer slides with smooth full-extension and soft-close feature. Pack of 5 pairs.',
        specs: {
            Length: '450mm',
            Type: 'Undermount',
            Load: '40kg per pair',
            Feature: 'Soft close & full extension',
            Pack: '5 pairs',
        },
        featured: false,
    },
    {
        id: 12,
        name: 'MDF Moisture Resistant 18mm',
        category: 'mdf-boards',
        categoryName: 'MDF Boards',
        price: 3200,
        image: 'https://www.starbank-uk.com/umoartol/2021/09/STARlite-Bonding-Line-1000x559.jpg',
        images: ['https://www.starbank-uk.com/umoartol/2021/09/STARlite-Bonding-Line-1000x559.jpg'],
        rating: 4.6,
        reviewCount: 31,
        inStock: true,
        stockQty: 90,
        description:
            'Moisture-resistant MDF (green core) for use in humid environments like kitchens and bathrooms.',
        specs: {
            Thickness: '18mm',
            Size: '2440mm x 1220mm',
            Type: 'Moisture Resistant',
            Core: 'Green (MR)',
            Application: 'Kitchens & Bathrooms',
        },
        featured: false,
    },
];

const STORAGE_KEY = 'complyAdminProducts';
const PRODUCTS_VERSION = '2'; // bump this whenever PRODUCTS images/data are updated
const VERSION_KEY = 'complyProductsVersion';

const getLiveProducts = () => {
    try {
        const storedVersion = localStorage.getItem(VERSION_KEY);
        if (storedVersion !== PRODUCTS_VERSION) {
            // Seed data has been updated — clear stale cache so new images are shown
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem(VERSION_KEY, PRODUCTS_VERSION);
            return PRODUCTS;
        }
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : PRODUCTS;
    } catch {
        return PRODUCTS;
    }
};

export const getFeaturedProducts = () => getLiveProducts().filter((p) => p.featured);

export const getProductById = (id) => getLiveProducts().find((p) => p.id === Number(id));

export const getProductsByCategory = (categoryId) =>
    getLiveProducts().filter((p) => p.category === categoryId);

export const searchProducts = (query) => {
    const q = query.toLowerCase();
    return getLiveProducts().filter(
        (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
    );
};

export { getLiveProducts as getProducts };
