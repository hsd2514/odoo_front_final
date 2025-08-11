// product.js - helpers to normalize product fields across varied shapes

export function resolveProductId(product) {
  if (!product) return undefined;
  return (
    product.id ??
    product.product_id ??
    product.uuid ??
    product.pk ??
    product.slug
  );
}

export function resolveName(product, fallbackPrefix = 'Product') {
  const id = resolveProductId(product);
  const name = product?.name ?? product?.title ?? product?.product_name;
  return name || (id != null ? `${fallbackPrefix} ${id}` : fallbackPrefix);
}

export function resolveUnitPrice(product) {
  const n = Number(product?.price ?? product?.unit_price ?? product?.base_price ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function resolvePricingUnit(product, defaultUnit = 'day') {
  return product?.pricing_unit || defaultUnit;
}


