'use client';

export default function ProductsSection() {
  const products = [
    {
      name: 'Coca-Cola',
      description: 'Original Taste 500ml',
      price: 'KSh 60',
      emoji: '🥤',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      name: 'Fanta Orange',
      description: 'Orange Flavor 500ml',
      price: 'KSh 60',
      emoji: '🍊',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      name: 'Sprite',
      description: 'Lemon-Lime 500ml',
      price: 'KSh 60',
      emoji: '💚',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
  ];

  return (
    <section id="products" className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quality soft drinks at the same price across all our branches. Simple, transparent, and affordable.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={index}
              className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-blue-600 hover:shadow-lg transition-all"
            >
              {/* Product Icon */}
              <div className={`${product.bgColor} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6`}>
                <span className="text-6xl">{product.emoji}</span>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <p className={`text-3xl font-bold ${product.textColor}`}>
                  {product.price}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Same price at all branches
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a 
            href="/auth/register"
            className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Shopping Now
          </a>
        </div>
      </div>
    </section>
  );
}
