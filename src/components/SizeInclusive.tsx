'use client';

import { motion } from 'framer-motion';
import { Heart, TrendingUp, Scissors, Crown } from 'lucide-react';

const features = [
  {
    icon: Crown,
    title: 'Tallas Inclusivas',
    description:
      'Somos especialistas en tallas extragrandes. Ofrecemos lo que el mercado no da: vestidos sensuales para todas las mujeres.',
    color: 'mystic',
  },
  {
    icon: TrendingUp,
    title: 'Mercado Desatendido',
    description:
      'Sabemos que es difícil encontrar vestidos góticos sexis en tallas grandes. Por eso existimos.',
    color: 'terra',
  },
  {
    icon: Scissors,
    title: 'Cortes Especializados',
    description:
      'Patrones únicos diseñados para realzar curvas voluptuosas. No adaptamos, diseñamos específicamente para ti.',
    color: 'lunar',
  },
];

export default function SizeInclusive() {
  return (
    <section className='py-20 px-4 relative'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className='absolute top-1/4 right-0 w-32 h-32 bg-gradient-to-br from-mystic-400/10 to-terra-400/10 rounded-full blur-3xl'
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className='absolute bottom-1/4 left-0 w-48 h-48 bg-gradient-to-br from-lunar-400/10 to-blood-400/10 rounded-full blur-3xl'
        />
      </div>

      <div className='max-w-7xl mx-auto relative z-10'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-mystic-500 to-terra-500 mb-8 animate-glow'
          >
            <Heart className='text-white w-10 h-10 fill-current' />
          </motion.div>

          <h2 className='font-display text-4xl md:text-6xl font-bold mb-6'>
            <span className='bg-gradient-to-r from-mystic-500 to-blood-500 bg-clip-text text-transparent'>
              Belleza
            </span>
            <br />
            <span className='bg-gradient-to-r from-terra-600 to-lunar-500 bg-clip-text text-transparent'>
              Sin Límites
            </span>
          </h2>

          <p className='text-bone-200 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed'>
            En un mundo que a menudo olvida la diversidad, nosotras celebramos
            cada curva, cada forma, cada talla. Porque la sensualidad auténtica
            no se mide en números.
          </p>
        </motion.div>


        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-16'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className='group'
            >
              <div className='bg-gradient-to-br from-terra-50/10 to-mystic-50/10 backdrop-blur-sm border border-terra-200/20 rounded-xl p-8 h-full hover:shadow-2xl transition-all duration-500 group-hover:scale-105'>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                    feature.color === 'mystic'
                      ? 'from-mystic-500 to-mystic-600'
                      : feature.color === 'terra'
                        ? 'from-terra-500 to-terra-600'
                        : 'from-lunar-500 to-lunar-600'
                  } flex items-center justify-center mb-6 mx-auto`}
                >
                  <feature.icon className='text-white w-8 h-8' />
                </motion.div>

                <h3 className='font-display text-2xl font-bold bg-gradient-to-r from-terra-600 to-mystic-500 bg-clip-text text-transparent mb-4 text-center'>
                  {feature.title}
                </h3>

                <p className='text-bone-200 leading-relaxed text-center'>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className='text-center'
        >
          <div className='bg-gradient-to-br from-terra-50/10 to-mystic-50/10 backdrop-blur-sm border border-terra-200/20 rounded-2xl p-8 md:p-12 plus-size-highlight'>
            <h3 className='font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-mystic-500 to-blood-500 bg-clip-text text-transparent mb-4'>
              ¿Talla Grande? ¡Belleza Grande!
            </h3>
            <p className='text-bone-200 text-lg mb-8 max-w-2xl mx-auto'>
              Descubre nuestra colección especial de tallas grandes, donde cada
              vestido es una declaración de amor propio y empoderamiento
              femenino.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='btn-mystic'
            >
              <span className='flex items-center gap-2'>
                <Heart className='w-5 h-5 fill-current' />
                Ver Tallas Grandes
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
