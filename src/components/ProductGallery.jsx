// ProductGallery.jsx
import React, { useEffect, useState } from 'react';
import { listProductAssets } from '../services/catalog';

const ProductGallery = ({ productId, drmProtected }) => {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await listProductAssets(productId);
        if (mounted) setAssets(list);
      } catch {}
    })();
    return () => { mounted = false; };
  }, [productId]);

  const first = assets?.[0];
  const url = first?.url || first?.image_url || first?.src || '';

  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border border-neutral/200 relative">
      <div className="aspect-square grid place-items-center text-5xl" style={{ background: '#f2f2f2', backgroundImage: url ? `url(${url})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {!url && '🖼'}
      </div>
      {drmProtected && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs bg-black/70 text-white">DRM</div>
      )}
    </div>
  );
};

export default ProductGallery;


