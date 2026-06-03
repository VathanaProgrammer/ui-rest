import type { MenuItem } from './composables/useTicket';

export const CATEGORIES = ['All Items', 'Mains', 'Sides', 'Beverages', 'Desserts'];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: 'Classic Double',
    description: 'Angus beef, cheddar, house sauce, pickles...',
    price: 14.50,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
  },
  {
    id: 2,
    name: 'Harvest Bowl',
    description: 'Quinoa, kale, roasted sweet potato, tahini...',
    price: 12.00,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80',
  },
  {
    id: 3,
    name: 'Hellfire Wings',
    description: '12pcs crispy bone-in wings with signature...',
    price: 16.25,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400&q=80',
  },
  {
    id: 4,
    name: 'Truffle Fries',
    description: 'Hand-cut russets, white truffle oil, par...',
    price: 8.00,
    category: 'Sides',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  },
  {
    id: 5,
    name: 'Neon Old Fashioned',
    description: 'Bourbon, black walnut bitters, citrus...',
    price: 13.00,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=80',
  },
  {
    id: 6,
    name: 'Margherita Pro',
    description: 'San Marzano tomatoes, buffalo...',
    price: 18.50,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=80',
  },
  {
    id: 7,
    name: 'Spaghetti Carbonara',
    description: 'Spaghetti Carbonara',
    price: 20.50,
    category: 'Mains',
    image: 'https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-mediumSquareAt3X-v2.jpg',
  },
];