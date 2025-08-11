// AdminConsole.jsx
// Role-guarded admin console for managing the platform

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRoles, createRole, assignRole } from '../services/admin';
import { pricingColors, textColors } from '../utils/colors';

const AdminConsole = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('roles');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('user'); // This should come from auth context

  useEffect(() => {
    // Check if user has admin access
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    
    loadRoles();
  }, [userRole, navigate]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (error) {
      if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else {
        setError('Failed to load roles');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData) => {
    try {
      const newRole = await createRole(roleData);
      setRoles(prev => [...prev, newRole]);
      return newRole;
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 409) {
        throw new Error('Role already exists or invalid transition.');
      } else {
        throw new Error('Failed to create role');
      }
    }
  };

  const handleAssignRole = async (userId, roleId) => {
    try {
      await assignRole(userId, roleId);
      // Refresh roles to show updated assignments
      loadRoles();
    } catch (error) {
      if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 409) {
        throw new Error('Invalid role assignment.');
      } else {
        throw new Error('Failed to assign role');
      }
    }
  };

  const tabs = [
    { id: 'roles', label: 'Role Management', icon: '👥' },
    { id: 'catalog', label: 'Catalog Management', icon: '📦' },
    { id: 'inventory', label: 'Inventory Management', icon: '🏪' },
    { id: 'rentals', label: 'Rental Operations', icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📊' }
  ];

  const renderRolesTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Role Management</h2>
        <button
          onClick={() => {/* Open create role modal */}}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: pricingColors.primary,
            color: textColors.primary
          }}
        >
          Create Role
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading roles...</div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="text-red-600 mb-2">{error}</div>
          <button 
            onClick={loadRoles}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{role.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{role.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.map((permission) => (
                        <span 
                          key={permission}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCatalogTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Catalog Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {/* Open create category modal */}}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            New Category
          </button>
          <button
            onClick={() => {/* Open create product modal */}}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: pricingColors.primary,
              color: textColors.primary
            }}
          >
            New Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Electronics</span>
              <div className="flex gap-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                <button className="text-xs text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Sports</span>
              <div className="flex gap-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                <button className="text-xs text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Products</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">iPhone 15</span>
              <div className="flex gap-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                <button className="text-xs text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Tennis Racket</span>
              <div className="flex gap-2">
                <button className="text-xs text-blue-600 hover:text-blue-800">Edit</button>
                <button className="text-xs text-red-600 hover:text-red-800">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventoryTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Inventory Management</h2>
        <button
          onClick={() => {/* Open create inventory item modal */}}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
          style={{ 
            backgroundColor: pricingColors.primary,
            color: textColors.primary
          }}
        >
          Add Item
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">iPhone 15 #001</div>
                <div className="text-sm text-gray-500">Electronics</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Available
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Warehouse A
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Update Status</button>
                <button className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRentalsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Rental Operations</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {/* Open create schedule modal */}}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
          >
            New Schedule
          </button>
          <button
            onClick={() => {/* Open create handover QR modal */}}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            style={{ 
              backgroundColor: pricingColors.primary,
              color: textColors.primary
            }}
          >
            Create QR
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedules */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Schedules</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">iPhone 15 Rental</div>
              <div className="text-xs text-gray-500 mt-1">Dec 15 - Dec 20, 2024</div>
              <div className="text-xs text-gray-500">Customer: John Doe</div>
            </div>
          </div>
        </div>

        {/* Handover QR */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Handover QR</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900">QR Code #12345</div>
              <div className="text-xs text-gray-500 mt-1">Generated: Dec 15, 2024</div>
              <div className="text-xs text-gray-500">Status: Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Revenue</h3>
          <div className="text-3xl font-bold text-green-600">₹45,250</div>
          <div className="text-sm text-gray-500 mt-1">+12% from last month</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Rentals</h3>
          <div className="text-3xl font-bold text-blue-600">24</div>
          <div className="text-sm text-gray-500 mt-1">Currently active</div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
          <div className="text-3xl font-bold text-purple-600">156</div>
          <div className="text-sm text-gray-500 mt-1">+8 new this week</div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'roles':
        return renderRolesTab();
      case 'catalog':
        return renderCatalogTab();
      case 'inventory':
        return renderInventoryTab();
      case 'rentals':
        return renderRentalsTab();
      case 'analytics':
        return renderAnalyticsTab();
      default:
        return renderRolesTab();
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to access the admin console.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Back to Shop
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminConsole;
