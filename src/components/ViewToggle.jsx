// ViewToggle.jsx
import React from 'react';

const ViewToggle = ({ view, onChange }) => (
  <div className="flex items-center gap-2">
    <button
      className={`w-10 h-10 rounded-lg border border-neutral/30 ${view==='grid'?'bg-[#B2E6E4]':'bg-white'} shadow-sm`}
      onClick={() => onChange('grid')}
      title="Grid view"
    >▦</button>
    <button
      className={`w-10 h-10 rounded-lg border border-neutral/30 ${view==='list'?'bg-[#B2E6E4]':'bg-white'} shadow-sm`}
      onClick={() => onChange('list')}
      title="List view"
    >≣</button>
  </div>
);

export default ViewToggle;


