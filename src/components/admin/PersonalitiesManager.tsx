// src/components/admin/PersonalitiesManager.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  ChevronUp,
  ChevronDown,
  Loader,
  List,
} from 'lucide-react';

// Types for our data
interface Personality {
  id: string;
  name: string;
  title: string;
  description: string;
  traits: string[];
  icon: string;
  image_path: string;
  color: string;
  created_at: string;
  updated_at: string;

  // UI state
  isExpanded?: boolean;
  isEditing?: boolean;
}

export function PersonalitiesManager() {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingPersonality, setEditingPersonality] =
    useState<Personality | null>(null);

  // Supported icon names (from Lucide icons)
  const supportedIcons = [
    'Clock',
    'Award',
    'UtensilsCrossed',
    'Trophy',
    'Music',
    'Sparkles',
    'Users',
    'Shirt',
    'Coffee',
    'Heart',
    'Star',
  ];

  // Supported colors
  const supportedColors = [
    { name: 'Purple', value: 'purple-800' },
    { name: 'Blue', value: 'blue-600' },
    { name: 'Green', value: 'green-600' },
    { name: 'Yellow', value: 'yellow-600' },
    { name: 'Red', value: 'red-600' },
    { name: 'Pink', value: 'pink-600' },
    { name: 'Indigo', value: 'indigo-600' },
    { name: 'Teal', value: 'teal-600' },
  ];

  // Load personalities
  useEffect(() => {
    const fetchPersonalities = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('personalities')
          .select('*')
          .order('name');

        if (error) throw error;

        // Parse traits from JSON
        const personalitiesWithParsedTraits = (data || []).map(
          (personality) => ({
            ...personality,
            traits: Array.isArray(personality.traits) ? personality.traits : [],
            isExpanded: false,
            isEditing: false,
          })
        );

        setPersonalities(personalitiesWithParsedTraits);
      } catch (error: any) {
        console.error('Error fetching personalities:', error);
        setError(error.message || 'Failed to load personalities');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalities();
  }, []);

  // Toggle expanded state for a personality
  const toggleExpand = (personalityId: string) => {
    setPersonalities((prevPersonalities) =>
      prevPersonalities.map((p) =>
        p.id === personalityId ? { ...p, isExpanded: !p.isExpanded } : p
      )
    );
  };

  // Start editing a personality
  const handleEdit = (personality: Personality) => {
    setEditingPersonality({
      ...personality,
      traits: [...personality.traits],
    });

    // Expand the personality card
    setPersonalities((prevPersonalities) =>
      prevPersonalities.map((p) =>
        p.id === personality.id ? { ...p, isExpanded: true } : p
      )
    );
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPersonality(null);
    setError(null);
  };

  // Handle changes to personality fields
  const handleFieldChange = (field: keyof Personality, value: any) => {
    if (!editingPersonality) return;

    setEditingPersonality({
      ...editingPersonality,
      [field]: value,
    });
  };

  // Handle changes to traits array
  const handleTraitChange = (index: number, value: string) => {
    if (!editingPersonality) return;

    const newTraits = [...editingPersonality.traits];
    newTraits[index] = value;

    setEditingPersonality({
      ...editingPersonality,
      traits: newTraits,
    });
  };

  // Add a new trait field
  const handleAddTrait = () => {
    if (!editingPersonality) return;

    setEditingPersonality({
      ...editingPersonality,
      traits: [...editingPersonality.traits, ''],
    });
  };

  // Remove a trait field
  const handleRemoveTrait = (index: number) => {
    if (!editingPersonality) return;

    const newTraits = [...editingPersonality.traits];
    newTraits.splice(index, 1);

    setEditingPersonality({
      ...editingPersonality,
      traits: newTraits,
    });
  };

  // Save personality changes
  const handleSave = async () => {
    if (!editingPersonality) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('personalities')
        .update({
          name: editingPersonality.name,
          title: editingPersonality.title,
          description: editingPersonality.description,
          traits: editingPersonality.traits,
          icon: editingPersonality.icon,
          image_path: editingPersonality.image_path,
          color: editingPersonality.color,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingPersonality.id);

      if (error) throw error;

      // Update in local state
      setPersonalities((prevPersonalities) =>
        prevPersonalities.map((p) =>
          p.id === editingPersonality.id
            ? {
                ...editingPersonality,
                isExpanded: true,
                isEditing: false,
              }
            : p
        )
      );

      setSuccess('Personality updated successfully');
      setEditingPersonality(null);
    } catch (error: any) {
      console.error('Error saving personality:', error);
      setError(error.message || 'Failed to save personality');
    } finally {
      setSaving(false);
    }
  };

  // Add a new personality
  const handleAddPersonality = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Create new personality with default values
      const newPersonality = {
        name: 'new_personality',
        title: 'New Personality Type',
        description: 'Description of the new personality type.',
        traits: ['Trait 1', 'Trait 2', 'Trait 3', 'Trait 4'],
        icon: 'Star',
        image_path: '/assets/2.png', // Default image
        color: 'purple-800',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('personalities')
        .insert(newPersonality)
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newPersonalityWithState = {
        ...data,
        traits: newPersonality.traits, // Ensure traits is parsed correctly
        isExpanded: true,
        isEditing: false,
      };

      setPersonalities((prevPersonalities) => [
        ...prevPersonalities,
        newPersonalityWithState,
      ]);
      setSuccess('New personality created successfully');

      // Start editing the new personality
      handleEdit(newPersonalityWithState);
    } catch (error: any) {
      console.error('Error adding personality:', error);
      setError(error.message || 'Failed to add personality');
    } finally {
      setSaving(false);
    }
  };

  // Delete a personality
  const handleDelete = async (personalityId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this personality? This may affect existing quiz results.'
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('personalities')
        .delete()
        .eq('id', personalityId);

      if (error) throw error;

      // Remove from local state
      setPersonalities((prevPersonalities) =>
        prevPersonalities.filter((p) => p.id !== personalityId)
      );

      setSuccess('Personality deleted successfully');

      // Reset editing state if needed
      if (editingPersonality?.id === personalityId) {
        setEditingPersonality(null);
      }
    } catch (error: any) {
      console.error('Error deleting personality:', error);
      setError(error.message || 'Failed to delete personality');
    } finally {
      setLoading(false);
    }
  };

  if (loading && personalities.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Manage Personalities
          </h1>
          <p className="text-gray-600">
            Edit personality types that users can get as quiz results
          </p>
        </div>
        <button
          onClick={handleAddPersonality}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          <Plus size={16} className="mr-2" />
          Add Personality
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            className="bg-white shadow overflow-hidden sm:rounded-lg"
          >
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full bg-${personality.color} flex items-center justify-center text-white`}
                  >
                    <List size={20} />
                  </div>
                  <h3 className="ml-3 text-lg font-medium text-gray-900">
                    {personality.title}
                  </h3>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(personality)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleExpand(personality.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                  >
                    {personality.isExpanded ? (
                      <>
                        <ChevronUp size={16} className="mr-1" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" />
                        View
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(personality.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Expanded content */}
              {personality.isExpanded && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  {editingPersonality &&
                  editingPersonality.id === personality.id ? (
                    /* Editing form */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Name (internal ID)
                          </label>
                          <input
                            type="text"
                            value={editingPersonality.name}
                            onChange={(e) =>
                              handleFieldChange('name', e.target.value)
                            }
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Title (displayed to users)
                          </label>
                          <input
                            type="text"
                            value={editingPersonality.title}
                            onChange={(e) =>
                              handleFieldChange('title', e.target.value)
                            }
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          rows={3}
                          value={editingPersonality.description}
                          onChange={(e) =>
                            handleFieldChange('description', e.target.value)
                          }
                          className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Traits
                        </label>
                        <div className="space-y-2 mt-1">
                          {editingPersonality.traits.map((trait, index) => (
                            <div key={index} className="flex items-center">
                              <input
                                type="text"
                                value={trait}
                                onChange={(e) =>
                                  handleTraitChange(index, e.target.value)
                                }
                                className="focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveTrait(index)}
                                className="ml-2 inline-flex items-center p-1 border border-transparent rounded-full text-red-500 hover:bg-red-100"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={handleAddTrait}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Plus size={16} className="mr-1" />
                            Add Trait
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Icon
                          </label>
                          <select
                            value={editingPersonality.icon}
                            onChange={(e) =>
                              handleFieldChange('icon', e.target.value)
                            }
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          >
                            {supportedIcons.map((icon) => (
                              <option key={icon} value={icon}>
                                {icon}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Color
                          </label>
                          <select
                            value={editingPersonality.color}
                            onChange={(e) =>
                              handleFieldChange('color', e.target.value)
                            }
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                          >
                            {supportedColors.map((color) => (
                              <option key={color.value} value={color.value}>
                                {color.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Image Path
                          </label>
                          <input
                            type="text"
                            value={editingPersonality.image_path}
                            onChange={(e) =>
                              handleFieldChange('image_path', e.target.value)
                            }
                            className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <X size={16} className="mr-2" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                        >
                          {saving ? (
                            <>
                              <Loader size={16} className="mr-2 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save size={16} className="mr-2" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Description
                        </h4>
                        <p className="mt-1 text-gray-900">
                          {personality.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500">
                          Traits
                        </h4>
                        <ul className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                          {personality.traits.map((trait, index) => (
                            <li
                              key={index}
                              className="text-gray-900 flex items-center"
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                              {trait}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Icon
                          </h4>
                          <p className="mt-1 text-gray-900">
                            {personality.icon}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Color
                          </h4>
                          <div className="mt-1 flex items-center">
                            <div
                              className={`h-4 w-4 rounded-full bg-${personality.color} mr-2`}
                            ></div>
                            <p className="text-gray-900">{personality.color}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">
                            Image Path
                          </h4>
                          <p className="mt-1 text-gray-900 truncate">
                            {personality.image_path}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
