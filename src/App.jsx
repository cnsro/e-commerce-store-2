import React, { useState, createContext, useContext, useEffect } from 'react';
import { ShoppingBag, Menu, X, ChevronDown, ChevronRight, Search, User, Heart, Minus, Plus } from 'lucide-react';

// -- DUMMY DATA --
// In a real application, this data would come from a database or API.
const products = [
  { id: 1, name: 'Étoile Silk Blouse', designer: 'Atelier Garance', price: 850, category: 'Tops', image: 'https://placehold.co/800x1000/f0f0f0/333?text=Étoile+Silk+Blouse', description: 'A timeless silk blouse with a fluid drape and mother-of-pearl buttons. The epitome of Parisian chic.', sizes: ['XS', 'S', 'M', 'L'], colors: ['Ivory', 'Black'] },
  { id: 2, name: 'Ventura Tailored Trousers', designer: 'Bastion', price: 1200, category: 'Bottoms', image: 'https://placehold.co/800x1000/e9e9e9/333?text=Ventura+Trousers', description: 'Expertly tailored from Italian wool, these trousers feature a flattering high-waist and wide-leg silhouette.', sizes: ['S', 'M', 'L', 'XL'], colors: ['Charcoal', 'Navy'] },
  { id: 3, name: 'Riviera Linen Dress', designer: 'Solstice', price: 1550, category: 'Dresses', image: 'https://placehold.co/800x1000/f5f5f5/333?text=Riviera+Linen+Dress', description: 'An effortless midi dress crafted from breathable organic linen, perfect for sun-drenched days.', sizes: ['XS', 'S', 'M'], colors: ['Sand', 'Terracotta'] },
  { id: 4, name: 'Apex Cashmere Sweater', designer: 'Aura', price: 1800, category: 'Knitwear', image: 'https://placehold.co/800x1000/e0e0e0/333?text=Apex+Cashmere', description: 'A sumptuously soft oversized cashmere sweater, sourced from sustainable Mongolian farms.', sizes: ['S', 'M', 'L'], colors: ['Heather Grey', 'Oatmeal'] },
  { id: 5, name: 'Orion Trench Coat', designer: 'Bastion', price: 2950, category: 'Outerwear', image: 'https://placehold.co/800x1000/dcdcdc/333?text=Orion+Trench', description: 'The definitive trench coat, reimagined with modern proportions and water-resistant gabardine.', sizes: ['S', 'M', 'L'], colors: ['Beige', 'Olive'] },
  { id: 6, name: 'Luna Slip Skirt', designer: 'Atelier Garance', price: 750, category: 'Bottoms', image: 'https://placehold.co/800x1000/fafafa/333?text=Luna+Slip+Skirt', description: 'A bias-cut silk satin skirt that moves beautifully with every step. A versatile wardrobe essential.', sizes: ['XS', 'S', 'M', 'L'], colors: ['Champagne', 'Espresso'] },
  { id: 7, name: 'Helios Sunglasses', designer: 'Solstice', price: 450, category: 'Accessories', image: 'https://placehold.co/800x1000/f8f8f8/333?text=Helios+Sunglasses', description: 'Handcrafted in Italy, these oversized sunglasses feature a bold acetate frame and UV-protective lenses.', sizes: ['One Size'], colors: ['Tortoise', 'Black'] },
  { id: 8, name: 'Cresta Leather Belt', designer: 'Bastion', price: 350, category: 'Accessories', image: 'https://placehold.co/800x1000/e5e5e5/333?text=Cresta+Belt', description: 'A minimalist leather belt with a sculptural gold-tone buckle. Made from vegetable-tanned leather.', sizes: ['S', 'M', 'L'], colors: ['Black', 'Cognac'] },
];

// -- CONTEXT FOR CART MANAGEMENT --
const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, size, color) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && item.size === size && item.color === color);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, size, color }];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems(prevItems => prevItems.filter(item => !(item.id === productId && item.size === size && item.color === color)));
  };

  const updateQuantity = (productId, size, color, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId && item.size === size && item.color === color
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
const useCart = () => useContext(CartContext);

// -- HEADER COMPONENT --
const Header = ({ setPage }) => {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'New Arrivals', page: 'products' },
    { name: 'Designers', page: 'home' },
    { name: 'Clothing', page: 'products' },
    { name: 'Accessories', page: 'products' },
    { name: 'Journal', page: 'home' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="text-2xl font-serif tracking-widest text-gray-900 uppercase">
              AETHER
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href="#"
                onClick={(e) => { e.preventDefault(); setPage(link.page); }}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 hidden sm:block">
              <Search size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 hidden sm:block">
              <User size={20} />
            </button>
            <button className="text-gray-600 hover:text-gray-900 hidden sm:block">
              <Heart size={20} />
            </button>
            <button onClick={() => setPage('cart')} className="relative text-gray-600 hover:text-gray-900">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-gray-900 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white shadow-lg">
          <nav className="flex flex-col p-4 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href="#"
                onClick={(e) => { e.preventDefault(); setPage(link.page); setIsMenuOpen(false); }}
                className="text-base font-medium text-gray-700 hover:text-gray-900"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

// -- FOOTER COMPONENT --
const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Customer Service</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Shipping & Returns</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Size Guide</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">About Aether</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Our Story</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Sustainability</a></li>
              <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900">Press</a></li>
            </ul>
          </div>
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-sm font-semibold text-gray-800 tracking-wider uppercase">Join Our World</h3>
            <p className="mt-4 text-sm text-gray-600">Be the first to know about new arrivals, exclusive collections, and brand stories.</p>
            <form className="mt-4 flex">
              <input type="email" placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:ring-gray-800 focus:border-gray-800 text-sm" />
              <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-r-md hover:bg-gray-900 text-sm">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} AETHER. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-gray-900">Instagram</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Pinterest</a>
            <a href="#" className="text-gray-500 hover:text-gray-900">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// -- HOME PAGE COMPONENT --
const HomePage = ({ setPage, setSelectedProduct }) => {
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] bg-cover bg-center" style={{ backgroundImage: "url('https://placehold.co/1800x1200/dcdcdc/333?text=AETHER+FW24')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-16 md:pb-24">
          <h1 className="text-4xl md:text-6xl font-serif text-white tracking-wider leading-tight">The Art of Form</h1>
          <p className="mt-4 text-lg text-white max-w-lg">Discover the Fall/Winter '24 collection, a study in silhouette and texture.</p>
          <button onClick={() => setPage('products')} className="mt-8 bg-white text-gray-900 px-8 py-3 rounded-full uppercase text-sm font-medium hover:bg-gray-200 transition-colors w-fit">
            Shop The Collection
          </button>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <img src="https://placehold.co/800x1000/e0e0e0/333?text=Collection+One" alt="Collection" className="w-full h-auto object-cover rounded-lg" />
            </div>
            <div className="order-1 md:order-2 md:pl-12">
              <h2 className="text-3xl font-serif text-gray-900">Modern Heirlooms</h2>
              <p className="mt-4 text-gray-600">Timeless pieces designed to be cherished for years to come. Explore our curated selection of signature styles.</p>
              <button onClick={() => setPage('products')} className="mt-6 text-gray-900 font-medium group">
                Explore The Edit
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-300 h-0.5 bg-gray-900"></span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-serif text-gray-900 mb-12">New Arrivals</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group relative cursor-pointer" onClick={() => { setSelectedProduct(product); setPage('productDetail'); }}>
                <div className="w-full aspect-[2/2.5] bg-gray-200 rounded-lg overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">${product.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button onClick={() => setPage('products')} className="bg-gray-800 text-white px-10 py-3 rounded-full uppercase text-sm font-medium hover:bg-gray-900 transition-colors">
              View All
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// -- PRODUCTS PAGE COMPONENT --
const ProductsPage = ({ setPage, setSelectedProduct }) => {
  const [filters, setFilters] = useState({ category: 'All', designer: 'All' });
  const [sortBy, setSortBy] = useState('newest');

  const categories = ['All', ...new Set(products.map(p => p.category))];
  const designers = ['All', ...new Set(products.map(p => p.designer))];

  const filteredProducts = products
    .filter(p => filters.category === 'All' || p.category === filters.category)
    .filter(p => filters.designer === 'All' || p.designer === filters.designer)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        default: return 0; // 'newest' would require a timestamp, default to no sort
      }
    });

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-gray-900">All Clothing</h1>
          <p className="mt-2 text-gray-600">Discover our latest collection of timeless designs.</p>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-y border-gray-200 py-4">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-gray-800 focus:ring-gray-800"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={filters.designer}
              onChange={(e) => setFilters({ ...filters, designer: e.target.value })}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-gray-800 focus:ring-gray-800"
            >
              {designers.map(des => <option key={des} value={des}>{des}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border-gray-300 rounded-md shadow-sm focus:border-gray-800 focus:ring-gray-800"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group relative cursor-pointer" onClick={() => { setSelectedProduct(product); setPage('productDetail'); }}>
              <div className="w-full aspect-[2/2.5] bg-gray-200 rounded-lg overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-center object-cover group-hover:opacity-75 transition-opacity" />
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.designer}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">${product.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -- PRODUCT DETAIL PAGE COMPONENT --
const ProductDetailPage = ({ product, setPage }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [showNotification, setShowNotification] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  if (!product) {
    return (
        <div className="text-center py-20">
            <p>Product not found. Please return to the shop.</p>
            <button onClick={() => setPage('products')} className="mt-4 bg-gray-800 text-white px-6 py-2 rounded-md">
                Back to Products
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="text-sm mb-6">
          <a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="text-gray-500 hover:text-gray-700">Home</a>
          <ChevronRight className="inline mx-2 h-4 w-4 text-gray-400" />
          <a href="#" onClick={(e) => { e.preventDefault(); setPage('products'); }} className="text-gray-500 hover:text-gray-700">Clothing</a>
          <ChevronRight className="inline mx-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-700">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover rounded-lg" />
          </div>

          {/* Product Info */}
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500">{product.designer}</p>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mt-2">{product.name}</h1>
            <p className="text-2xl text-gray-800 mt-4">${product.price.toLocaleString()}</p>

            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-900">Color: <span className="text-gray-600 font-normal">{selectedColor}</span></h3>
              <div className="flex items-center space-x-3 mt-2">
                {product.colors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-8 w-8 rounded-full border-2 ${selectedColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                    style={{ backgroundColor: color.toLowerCase() === 'ivory' ? '#FFFFF0' : color.toLowerCase() }}
                    title={color}
                  >
                    <span className="sr-only">{color}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Size: <span className="text-gray-600 font-normal">{selectedSize}</span></h3>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Size guide</a>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`border rounded-md py-3 px-4 text-sm font-medium ${selectedSize === size ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAddToCart} className="mt-10 w-full bg-gray-800 text-white py-4 rounded-md text-sm font-medium uppercase hover:bg-gray-900 transition-colors">
              Add to Bag
            </button>

            {/* Product Description */}
            <div className="mt-10">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add to Cart Notification */}
      {showNotification && (
        <div className="fixed bottom-5 right-5 bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in-out">
          <p><span className="font-semibold">{product.name}</span> has been added to your bag.</p>
        </div>
      )}
    </div>
  );
};

// -- CART PAGE COMPONENT --
const CartPage = ({ setPage }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif text-center mb-8">Shopping Bag</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <p className="text-gray-600">Your shopping bag is empty.</p>
            <button onClick={() => setPage('products')} className="mt-6 bg-gray-800 text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-gray-900 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <ul role="list" className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.color}`} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.color}</p>
                        <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md"><Minus size={16}/></button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md"><Plus size={16}/></button>
                        </div>
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                            className="font-medium text-gray-600 hover:text-gray-900"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">${cartTotal.toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <p className="text-base font-medium text-gray-900">Order total</p>
                  <p className="text-base font-medium text-gray-900">${cartTotal.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-6">
                <button className="w-full bg-gray-800 text-white py-3 rounded-md text-sm font-medium uppercase hover:bg-gray-900 transition-colors">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// -- MAIN APP COMPONENT --
export default function App() {
  const [page, setPage] = useState('home'); // 'home', 'products', 'productDetail', 'cart'
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const renderPage = () => {
    switch (page) {
      case 'products':
        return <ProductsPage setPage={setPage} setSelectedProduct={setSelectedProduct} />;
      case 'productDetail':
        return <ProductDetailPage product={selectedProduct} setPage={setPage} />;
      case 'cart':
        return <CartPage setPage={setPage} />;
      case 'home':
      default:
        return <HomePage setPage={setPage} setSelectedProduct={setSelectedProduct} />;
    }
  };

  return (
    <CartProvider>
      <div className="font-sans text-gray-800">
        <Header setPage={setPage} />
        <main>
          {renderPage()}
        </main>
        <Footer />
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
          body {
            font-family: 'Inter', sans-serif;
          }
          h1, h2, h3, .font-serif {
            font-family: 'Lora', serif;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(10px); }
          }
          .animate-fade-in-out {
            animation: fadeIn 0.5s ease-out, fadeOut 0.5s ease-in 2.5s;
          }
        `}</style>
      </div>
    </CartProvider>
  );
}
