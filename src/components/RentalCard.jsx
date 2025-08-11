import { ArchiveBoxIcon, HeartIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

/**
 * RentalCard (Grid style)
 * Matches the shop grid design: square media, name, price, Add to Cart, wishlist.
 */
const RentalCard = ({
  name = 'Product Name',
  priceText = '₹0.00',
  imageUrl,
  isWishlisted = false,
  onAddToCart = () => {},
  onToggleWishlist = () => {},
}) => {
  return (
    <div className="rounded-2xl border border-neutral/20 bg-white/95 p-4 shadow-sm">
      <div className="relative aspect-square rounded-2xl border border-neutral/30 overflow-hidden bg-[radial-gradient(rgba(17,17,17,0.08)_1px,transparent_1px)] [background-size:12px_12px] grid place-items-center">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-14 h-14 grid place-items-center rounded-xl bg-neutral-900 text-white shadow relative z-[1]">
            <ArchiveBoxIcon className="w-7 h-7" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-sm font-medium leading-tight line-clamp-1">{name}</div>
        <div className="text-sm text-neutral/80 mt-0.5">{priceText}</div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onAddToCart}
          className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-[13px] border border-neutral/30 bg-white hover:bg-neutral-50 transition shadow-sm"
        >
          <ShoppingCartIcon className="w-4 h-4" />
          Add to Cart
        </button>
        <button
          type="button"
          aria-pressed={isWishlisted}
          onClick={onToggleWishlist}
          className={`w-8 h-8 grid place-items-center rounded-lg border transition ${
            isWishlisted
              ? 'border-neutral-800 bg-neutral-900 text-white'
              : 'border-neutral/30 bg-white text-neutral-700 hover:bg-neutral-50'
          }`}
        >
          <HeartIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RentalCard;


