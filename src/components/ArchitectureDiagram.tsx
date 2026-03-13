'use client';

import { motion } from 'framer-motion';

const architectureLayers = [
  {
    id: 1,
    title: 'User Interface Layer',
    description: 'Next.js Pages & Components',
    items: ['Home', 'Product Pages', 'Admin Panel', 'Contact', 'Blog'],
    color: 'from-blue-500 to-cyan-500',
    icon: '🎨',
  },
  {
    id: 2,
    title: 'Agentic AI Layer',
    description: 'Intelligent Automation & Assistance',
    items: ['Style Quiz AI', 'Product Recommendations', 'Chat Assistant', 'Content Generation'],
    color: 'from-purple-500 to-pink-500',
    icon: '🤖',
  },
  {
    id: 3,
    title: 'API & Server Layer',
    description: 'Next.js API Routes & Server Actions',
    items: ['Products API', 'Posts API', 'Contact Form', 'Authentication'],
    color: 'from-green-500 to-emerald-500',
    icon: '⚡',
  },
  {
    id: 4,
    title: 'Database Layer',
    description: 'MongoDB with Mongoose ODM',
    items: ['Products Collection', 'Posts Collection', 'Contact Messages', 'User Data'],
    color: 'from-orange-500 to-amber-500',
    icon: '🗄️',
  },
  {
    id: 5,
    title: 'External Services',
    description: 'Third-party Integrations',
    items: ['WhatsApp API', 'Affiliate Networks', 'Email Service', 'Analytics'],
    color: 'from-red-500 to-rose-500',
    icon: '🔗',
  },
];

export default function ArchitectureDiagram() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="gradient-blob-1 opacity-20" />
        <div className="gradient-blob-2 opacity-20" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Project Architecture
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            TrendKart System Architecture
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A modern e-commerce platform with agentic AI capabilities
          </p>
        </motion.div>

        <div className="relative">
          {architectureLayers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative mb-4"
            >
              <div className="flex items-stretch gap-4">
                <div className="flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.color} flex items-center justify-center text-xl shadow-lg`}
                  >
                    {layer.icon}
                  </motion.div>
                  {index < architectureLayers.length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-primary/50 to-primary/20" />
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="flex-1 card p-5 border-l-4"
                  style={{
                    borderImage: `linear-gradient(to bottom, var(--primary), var(--secondary)) 1`,
                  }}
                >
                  <div className={`bg-gradient-to-r ${layer.color} bg-clip-text text-transparent`}>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-bold">{layer.title}</h3>
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-text-secondary">
                        Layer {layer.id}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{layer.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs px-2 py-1 bg-background rounded-lg text-text-secondary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 card p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20"
        >
          <h3 className="text-lg font-semibold text-text-primary mb-4 text-center">
            🤖 Agentic AI Integration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-background/50">
              <div className="text-2xl mb-2">🎯</div>
              <h4 className="font-medium text-text-primary">Style Personality Quiz</h4>
              <p className="text-sm text-text-secondary mt-1">
                AI-powered quiz that analyzes user preferences to recommend products
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-medium text-text-primary">Smart Recommendations</h4>
              <p className="text-sm text-text-secondary mt-1">
                Personalized product suggestions based on browsing behavior
              </p>
            </div>
            <div className="p-4 rounded-xl bg-background/50">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-medium text-text-primary">Automated Workflows</h4>
              <p className="text-sm text-text-secondary mt-1">
                Agentic agents for inventory management and customer support
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
