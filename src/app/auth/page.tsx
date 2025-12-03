'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Moon, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import KuyenLogo from '@/components/ui/KuyenLogo';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      router.push('/');
    } catch (error) {
      console.error('Error en autenticación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-earth-900 via-earth-800 to-gothic-900 relative overflow-hidden'>
      {/* Background Effects */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className='absolute top-1/4 left-1/4 w-32 h-32 border border-earth-400/20 rounded-full'
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className='absolute bottom-1/4 right-1/4 w-48 h-48 border border-sensual-400/20 rounded-full'
        />

        {/* Floating Icons */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className='absolute opacity-10'
            initial={{
              x: Math.random() * 800,
              y: Math.random() * 600,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 180, 360],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
          >
            {i % 3 === 0 && <Moon className='text-lunar-400/40 w-8 h-8' />}
            {i % 3 === 1 && <Star className='text-mystic-400/40 w-6 h-6' />}
            {i % 3 === 2 && <div className='w-4 h-4 rounded-full bg-terra-400/40' />}
          </motion.div>
        ))}
      </div>

      <div className='relative z-10 w-full max-w-md mx-auto px-6'>
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-8'
        >
          <Link href='/'>
            <KuyenLogo size='lg' variant='full' animated={true} className='mb-4' />
          </Link>
          <p className='text-earth-200 font-cursive text-lg'>
            Donde la elegancia florece bajo la luna
          </p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl'
        >
          {/* Toggle Buttons */}
          <div className='flex rounded-full bg-black/20 p-1 mb-6'>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-sensual-500 to-sensual-600 text-white shadow-lg'
                  : 'text-earth-200 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-sensual-500 to-sensual-600 text-white shadow-lg'
                  : 'text-earth-200 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Name Field (only for register) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className='block text-earth-200 text-sm font-medium mb-2'>
                  Nombre completo
                </label>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className='w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-earth-300 focus:outline-none focus:ring-2 focus:ring-sensual-500 focus:border-transparent transition-all'
                  placeholder='Tu nombre completo'
                />
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className='block text-earth-200 text-sm font-medium mb-2'>
                Correo electrónico
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                required
                className='w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-earth-300 focus:outline-none focus:ring-2 focus:ring-sensual-500 focus:border-transparent transition-all'
                placeholder='tu@email.com'
              />
            </div>

            {/* Password Field */}
            <div>
              <label className='block text-earth-200 text-sm font-medium mb-2'>
                Contraseña
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 pr-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder-earth-300 focus:outline-none focus:ring-2 focus:ring-sensual-500 focus:border-transparent transition-all'
                  placeholder='Tu contraseña'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 transform -translate-y-1/2 text-earth-300 hover:text-white transition-colors'
                >
                  {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
              </div>
            </div>

            {/* Confirm Password (only for register) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className='block text-earth-200 text-sm font-medium mb-2'>
                  Confirmar contraseña
                </label>
                <input
                  type='password'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className='w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-earth-300 focus:outline-none focus:ring-2 focus:ring-sensual-500 focus:border-transparent transition-all'
                  placeholder='Confirma tu contraseña'
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type='submit'
              disabled={isLoading}
              className='w-full py-3 px-4 bg-gradient-to-r from-sensual-500 to-sensual-600 hover:from-sensual-600 hover:to-sensual-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                  {isLogin ? 'Iniciando sesión...' : 'Registrando...'}
                </div>
              ) : (
                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className='mt-6 text-center space-y-2'>
            {isLogin && (
              <button className='text-earth-300 hover:text-white text-sm transition-colors'>
                ¿Olvidaste tu contraseña?
              </button>
            )}

            <div className='text-earth-400 text-sm'>
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className='text-sensual-400 hover:text-sensual-300 font-medium transition-colors'
              >
                {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='text-center mt-6'
        >
          <Link
            href='/'
            className='text-earth-300 hover:text-white text-sm transition-colors inline-flex items-center gap-2'
          >
            ← Volver al inicio
          </Link>
        </motion.div>
      </div>
    </div>
  );
}