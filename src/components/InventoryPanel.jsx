import useGameStore from '../store/gameStore';
import './InventoryPanel.css';

/**
 * InventoryPanel Component
 * Displays player inventory with item management
 */
const InventoryPanel = ({ onClose }) => {
  const inventory = useGameStore((state) => state.player.inventory);
  const maxInventorySize = useGameStore((state) => state.player.maxInventorySize);
  const useItem = useGameStore((state) => state.useItem);
  const removeFromInventory = useGameStore((state) => state.removeFromInventory);

  // Get category counts
  const getCategoryItems = (category) => {
    return inventory.filter(item => item.category === category || item.type === category);
  };

  const categories = [
    { id: 'food', name: 'Food', icon: '🍎' },
    { id: 'medical', name: 'Medical', icon: '💊' },
    { id: 'material', name: 'Materials', icon: '🪵' },
    { id: 'tool', name: 'Tools', icon: '🔧' }
  ];

  const handleUseItem = (item) => {
    if (item.category === 'food' || item.category === 'medical') {
      useItem(item.id);
    }
  };

  const handleDropItem = (item) => {
    if (confirm(`Drop ${item.name}?`)) {
      removeFromInventory(item.id, 1);
    }
  };

  return (
    <div className="inventory-overlay">
      <div className="inventory-panel">
        <div className="inventory-header">
          <h2>🎒 Inventory</h2>
          <div className="inventory-capacity">
            {inventory.length} / {maxInventorySize}
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="inventory-content">
          {categories.map(category => {
            const items = getCategoryItems(category.id);
            return (
              <div key={category.id} className="inventory-category">
                <h3 className="category-title">
                  <span className="category-icon">{category.icon}</span>
                  {category.name} ({items.length})
                </h3>
                <div className="items-grid">
                  {items.length === 0 ? (
                    <div className="empty-category">No items</div>
                  ) : (
                    items.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="inventory-item">
                        <div className="item-icon">{getCategoryIcon(item)}</div>
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          {item.stackable && (
                            <div className="item-quantity">x{item.quantity}</div>
                          )}
                        </div>
                        <div className="item-description">{item.description}</div>
                        <div className="item-actions">
                          {(item.category === 'food' || item.category === 'medical') && (
                            <button
                              className="action-btn use-btn"
                              onClick={() => handleUseItem(item)}
                            >
                              Use
                            </button>
                          )}
                          <button
                            className="action-btn drop-btn"
                            onClick={() => handleDropItem(item)}
                          >
                            Drop
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {inventory.length === 0 && (
          <div className="empty-inventory">
            <p>Your inventory is empty.</p>
            <p>Explore the island to gather resources!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get item icon
const getCategoryIcon = (item) => {
  switch (item.category || item.type) {
    case 'food': return '🍎';
    case 'medical': return '💊';
    case 'material': return '🪵';
    case 'tool': return '🔧';
    case 'resource': return '🌿';
    default: return '📦';
  }
};

export default InventoryPanel;
