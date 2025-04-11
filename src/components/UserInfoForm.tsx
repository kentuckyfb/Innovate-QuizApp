// src/components/UserInfoForm.tsx
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { UserInfo } from '../types/quiz';
import { Loader2 } from 'lucide-react';
import { theme } from '../lib/theme';
import { saveUserInfo } from '../lib/supabase';

export function UserInfoForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setUserInfo = useQuizStore((state) => state.setUserInfo);
  const setStep = useQuizStore((state) => state.setStep);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserInfo>();

  const onSubmit = async (data: UserInfo) => {
    try {
      setLoading(true);
      setError(null);

      // Verify phone number length
      const phoneDigits = data.phone.replace(/\D/g, ''); // Remove non-digit characters
      if (phoneDigits.length < 10) {
        setError(
          'Please enter a valid Phone number, must be at least 10 digits long.'
        );
        setLoading(false);
        return;
      }

      // Save to Supabase - include quiz_type to identify this entry correctly
      const saved = await saveUserInfo({
        name: data.name,
        phone: data.phone,
        quiz_type: 'avrudu', // Add this to ensure proper identification in the database
      });

      if (!saved) {
        setError(
          'There was a problem saving your information. Please try again.'
        );
        setLoading(false);
        return;
      }

      // Update local state
      setUserInfo(data);

      // Move to next step
      setStep('quiz');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  // Button shadow style with darker purple shadow
  const buttonShadowStyle = {
    textShadow: `2px 2px 0px #330033`, // Darker purple shadow
    boxShadow: `4px 4px 0px #330033`, // Darker purple shadow
    fontFamily: "'Jockey One', sans-serif",
    letterSpacing: '1px',
    textTransform: 'uppercase',
  };

  return (
    <div className="w-full flex justify-center items-center py-2 sm:py-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md mx-auto p-3 sm:p-5 bg-white rounded-xl shadow-lg flex flex-col"
        style={{
          borderColor: theme.colors.primary.light,
          borderWidth: '2px',
          maxHeight: 'calc(100vh - 160px)',
          overflowY: 'auto',
        }}
      >
        {/* Improved heading with decorative accent */}
        <motion.div
          variants={itemVariants}
          className="mb-4 text-center relative"
        >
          <h2
            className="text-xl sm:text-2xl font-bold"
            style={{ color: theme.colors.primary.dark }}
          >
            Before We Begin...
          </h2>
          {/* Decorative underline to replace the image */}
          <div
            className="h-1 w-20 mx-auto mt-2 rounded-full"
            style={{
              background: `linear-gradient(to right, ${theme.colors.secondary.light}, ${theme.colors.secondary.main}, ${theme.colors.secondary.light})`,
              boxShadow: `0 0 6px ${theme.colors.secondary.main}`,
            }}
          ></div>
        </motion.div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <motion.div variants={itemVariants}>
            <label
              htmlFor="name"
              className="block text-xs sm:text-sm font-medium mb-1"
              style={{ color: theme.colors.secondary.dark }}
            >
              Your Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', { required: 'Name is required' })}
              className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg transition-all duration-200"
              style={{
                borderColor: theme.colors.primary.light,
                color: theme.colors.primary.dark,
              }}
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
            )}
          </motion.div>

          <motion.div variants={itemVariants}>
            <label
              htmlFor="phone"
              className="block text-xs sm:text-sm font-medium mb-1"
              style={{ color: theme.colors.secondary.dark }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              {...register('phone', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9+\-\s()]*$/,
                  message: 'Please enter a valid phone number',
                },
                validate: {
                  minLength: (value) => {
                    const digits = value.replace(/\D/g, '');
                    return (
                      digits.length >= 10 ||
                      'Please enter a valid Phone number, must be at least 10 digits long.'
                    );
                  },
                },
              })}
              className="w-full px-3 py-2 text-xs sm:text-sm border rounded-lg transition-all duration-200"
              style={{
                borderColor: theme.colors.primary.light,
                color: theme.colors.primary.dark,
              }}
              placeholder="Enter your phone number"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">
                {errors.phone.message}
              </p>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-start">
            <div className="flex-shrink-0 pt-1">
              <input
                type="checkbox"
                id="terms"
                {...register('termsAccepted', {
                  required: 'You must accept the terms and conditions',
                })}
                className="h-3 w-3 sm:h-4 sm:w-4 rounded border-gray-300"
                style={{
                  color: theme.colors.secondary.main,
                  borderColor: theme.colors.primary.light,
                }}
              />
            </div>
            <label
              htmlFor="terms"
              className="ml-2 block text-xs sm:text-sm"
              style={{ color: theme.colors.primary.main }}
            >
              I agree to the{' '}
              <a
                href="https://www.atlas.lk/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-opacity-80 transition-all"
                style={{ color: theme.colors.secondary.dark }}
              >
                terms and conditions.
            </label>
          </motion.div>

          {errors.termsAccepted && (
            <p className="text-xs text-red-600 mt-1">
              {errors.termsAccepted.message}
            </p>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-2 bg-red-100 text-red-700 rounded-lg text-xs"
            >
              {error}
            </motion.div>
          )}

          {/* Navigation buttons */}
          <motion.div
            variants={itemVariants}
            className="pt-2 pb-1 sm:pt-3 sm:pb-2 flex space-x-3"
          >
            {/* Back button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => setStep('welcome')}
              className="flex-1 py-2 rounded-lg font-medium
                      transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
              style={{
                backgroundColor: 'transparent',
                border: `2px solid ${theme.colors.primary.light}`,
                color: theme.colors.primary.dark,
              }}
            >
              BACK
            </motion.button>

            {/* Continue button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-lg font-semibold
                      shadow-lg transition-all duration-300 flex items-center justify-center text-xs sm:text-sm"
              style={{
                backgroundColor: theme.colors.secondary.main,
                color: theme.colors.primary.contrastText,
                ...buttonShadowStyle,
                fontFamily: 'Arame',
                fontWeight: 'bold',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span>LOADING...</span>
                </>
              ) : (
                'CONTINUE'
              )}
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
}
