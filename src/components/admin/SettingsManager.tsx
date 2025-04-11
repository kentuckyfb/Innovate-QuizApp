// src/components/admin/SettingsManager.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Loader, Undo2 } from 'lucide-react';

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: string;
}

interface AppSettings {
  theme: ThemeSettings;
  title: string;
  description: string;
  maxQuestions: number;
}

export function SettingsManager() {
  const [settings, setSettings] = useState<AppSettings>({
    theme: {
      primaryColor: '#9c27b0', // Default purple color
      secondaryColor: '#f3e5f5', // Light purple
      fontFamily: 'Poppins, sans-serif',
      borderRadius: 'rounded',
      buttonStyle: 'default',
    },
    title: 'Avrudu Personality Quiz',
    description: 'Discover your Avrudu personality type',
    maxQuestions: 10,
  });

  const [defaultSettings, setDefaultSettings] = useState<AppSettings | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Available color options
  const colorOptions = [
    { name: 'Purple', value: '#9c27b0' },
    { name: 'Deep Purple', value: '#673ab7' },
    { name: 'Indigo', value: '#3f51b5' },
    { name: 'Blue', value: '#2196f3' },
    { name: 'Teal', value: '#009688' },
    { name: 'Green', value: '#4caf50' },
    { name: 'Amber', value: '#ffc107' },
    { name: 'Orange', value: '#ff9800' },
    { name: 'Deep Orange', value: '#ff5722' },
    { name: 'Red', value: '#f44336' },
    { name: 'Pink', value: '#e91e63' },
  ];

  // Available font options
  const fontOptions = [
    { name: 'Poppins', value: 'Poppins, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif' },
    { name: 'Montserrat', value: 'Montserrat, sans-serif' },
    { name: 'Lato', value: 'Lato, sans-serif' },
  ];

  // Border radius options
  const borderRadiusOptions = [
    { name: 'None', value: 'rounded-none' },
    { name: 'Small', value: 'rounded-sm' },
    { name: 'Medium', value: 'rounded' },
    { name: 'Large', value: 'rounded-lg' },
    { name: 'Full', value: 'rounded-full' },
  ];

  // Button style options
  const buttonStyleOptions = [
    { name: 'Default', value: 'default' },
    { name: 'Outline', value: 'outline' },
    { name: 'Flat', value: 'flat' },
    { name: 'Shadow', value: 'shadow' },
  ];

  // Load settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('*')
          .eq('name', 'app_settings')
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Record not found, create default settings
            await createDefaultSettings();
          } else {
            throw error;
          }
        } else if (data) {
          const appSettings = data.value as AppSettings;
          setSettings(appSettings);
          setDefaultSettings({ ...appSettings }); // Save a copy for reset functionality
        }
      } catch (error: any) {
        console.error('Error fetching settings:', error);
        setError(error.message || 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Create default settings in the database
  const createDefaultSettings = async () => {
    try {
      const defaultAppSettings: AppSettings = {
        theme: {
          primaryColor: '#9c27b0',
          secondaryColor: '#f3e5f5',
          fontFamily: 'Poppins, sans-serif',
          borderRadius: 'rounded',
          buttonStyle: 'default',
        },
        title: 'Avrudu Personality Quiz',
        description: 'Discover your Avrudu personality type',
        maxQuestions: 10,
      };

      const { error } = await supabase.from('settings').insert({
        name: 'app_settings',
        value: defaultAppSettings,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSettings(defaultAppSettings);
      setDefaultSettings({ ...defaultAppSettings });
    } catch (error: any) {
      console.error('Error creating default settings:', error);
      setError(error.message || 'Failed to create default settings');
    }
  };

  // Handle changes to settings fields
  const handleChange = (
    section: keyof AppSettings,
    field: string,
    value: any
  ) => {
    if (section === 'theme') {
      setSettings({
        ...settings,
        theme: {
          ...settings.theme,
          [field]: value,
        },
      });
    } else {
      setSettings({
        ...settings,
        [field]: value,
      });
    }
  };

  // Reset to default settings
  const handleReset = () => {
    if (!defaultSettings) return;

    if (
      confirm(
        'Are you sure you want to reset all settings to their default values?'
      )
    ) {
      setSettings({ ...defaultSettings });
      setSuccess('Settings have been reset to defaults');
    }
  };

  // Save settings to database
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if settings record exists
      const { data, error: fetchError } = await supabase
        .from('settings')
        .select('id')
        .eq('name', 'app_settings')
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (data) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('settings')
          .update({
            value: settings,
            updated_at: new Date().toISOString(),
          })
          .eq('id', data.id);

        if (updateError) throw updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase.from('settings').insert({
          name: 'app_settings',
          value: settings,
          updated_at: new Date().toISOString(),
        });

        if (insertError) throw insertError;
      }

      setSuccess('Settings saved successfully');
      setDefaultSettings({ ...settings }); // Update default settings
    } catch (error: any) {
      console.error('Error saving settings:', error);
      setError(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  // Preview the theme changes
  const getPreviewStyle = () => {
    return {
      backgroundColor: settings.theme.primaryColor,
      color: '#ffffff',
      fontFamily: settings.theme.fontFamily,
      borderRadius:
        settings.theme.borderRadius === 'rounded-none'
          ? '0'
          : settings.theme.borderRadius === 'rounded-sm'
          ? '0.125rem'
          : settings.theme.borderRadius === 'rounded'
          ? '0.25rem'
          : settings.theme.borderRadius === 'rounded-lg'
          ? '0.5rem'
          : '9999px',
      padding: '0.75rem 1.5rem',
      border:
        settings.theme.buttonStyle === 'outline'
          ? `2px solid ${settings.theme.primaryColor}`
          : 'none',
      boxShadow:
        settings.theme.buttonStyle === 'shadow'
          ? '0 4px 6px rgba(0, 0, 0, 0.1)'
          : 'none',
      background:
        settings.theme.buttonStyle === 'flat'
          ? 'none'
          : settings.theme.primaryColor,
    };
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Customize your quiz appearance and behavior
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Undo2 size={16} className="mr-2" />
            Reset to Default
          </button>
          <button
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
                Save Settings
              </>
            )}
          </button>
        </div>
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

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Theme Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full mr-3 border border-gray-300"
                    style={{ backgroundColor: settings.theme.primaryColor }}
                  ></div>
                  <select
                    value={settings.theme.primaryColor}
                    onChange={(e) =>
                      handleChange('theme', 'primaryColor', e.target.value)
                    }
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full mr-3 border border-gray-300"
                    style={{ backgroundColor: settings.theme.secondaryColor }}
                  ></div>
                  <input
                    type="text"
                    value={settings.theme.secondaryColor}
                    onChange={(e) =>
                      handleChange('theme', 'secondaryColor', e.target.value)
                    }
                    className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Font Family
                </label>
                <select
                  value={settings.theme.fontFamily}
                  onChange={(e) =>
                    handleChange('theme', 'fontFamily', e.target.value)
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  {fontOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      style={{ fontFamily: option.value }}
                    >
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Border Radius
                </label>
                <select
                  value={settings.theme.borderRadius}
                  onChange={(e) =>
                    handleChange('theme', 'borderRadius', e.target.value)
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  {borderRadiusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Style
                </label>
                <select
                  value={settings.theme.buttonStyle}
                  onChange={(e) =>
                    handleChange('theme', 'buttonStyle', e.target.value)
                  }
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
                >
                  {buttonStyleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="p-4 bg-gray-100 rounded-md flex items-center">
                  <button
                    style={getPreviewStyle()}
                    className="font-medium focus:outline-none disabled:opacity-50"
                  >
                    Button Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Quiz Settings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title
                </label>
                <input
                  type="text"
                  value={settings.title}
                  onChange={(e) =>
                    handleChange('title', 'title', e.target.value)
                  }
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Description
                </label>
                <input
                  type="text"
                  value={settings.description}
                  onChange={(e) =>
                    handleChange('title', 'description', e.target.value)
                  }
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Questions
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.maxQuestions}
                  onChange={(e) =>
                    handleChange(
                      'title',
                      'maxQuestions',
                      parseInt(e.target.value)
                    )
                  }
                  className="mt-1 focus:ring-purple-500 focus:border-purple-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Maximum number of questions allowed (1-20)
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
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
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
