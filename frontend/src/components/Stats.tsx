import { motion } from 'framer-motion';

const stats = [
  { id: 1, value: '9.00', label: 'MCA CGPA' },
  { id: 2, value: '4', label: 'Major Projects' },
  { id: 3, value: '15+', label: 'Tech Stack Skills' },
];

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 border-y border-stroke py-12 md:py-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center md:items-start text-center md:text-left"
            >
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-display text-text-primary tracking-tight mb-2">
                {stat.value}
              </h3>
              <p className="text-sm md:text-base text-muted uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
