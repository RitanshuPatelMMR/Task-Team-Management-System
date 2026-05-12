const colors = {
  'Todo':        'bg-gray-100 text-gray-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Review':      'bg-yellow-100 text-yellow-700',
  'Completed':   'bg-green-100 text-green-700',
  'Low':         'bg-green-100 text-green-700',
  'Medium':      'bg-yellow-100 text-yellow-700',
  'High':        'bg-red-100 text-red-700',
  'Planned':     'bg-gray-100 text-gray-700',
  'Active':      'bg-blue-100 text-blue-700',
  'On Hold':     'bg-orange-100 text-orange-700',
  'Admin':       'bg-red-100 text-red-700',
  'Manager':     'bg-blue-100 text-blue-700',
  'Developer':   'bg-green-100 text-green-700',
};

export default function StatusBadge({ value }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[value] || 'bg-gray-100'}`}>
      {value}
    </span>
  );
}