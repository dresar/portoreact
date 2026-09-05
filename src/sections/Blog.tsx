import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'framer-motion';
import { SplitText } from '../components/ui/SplitText';
import { api } from '../services/api';

export const Blog = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.getPosts({ where: { status: { equals: 'published' } } });
      setBlogPosts(data.docs || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section id="blog" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <SplitText className="text-2xl sm:text-3xl md:text-5xl font-bold mb-8 md:mb-12 text-white text-center">
            Blog & Insights
          </SplitText>

          {loading ? (
            <div className="text-center text-gray-400 py-12">Memuat posts...</div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center text-gray-400 py-12">Data belum ada</div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6">
              {blogPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  className="break-inside-avoid mb-4 md:mb-6 rounded-lg md:rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 md:p-6"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                >
                  <span className="text-primary text-[10px] sm:text-xs font-medium">
                    {typeof post.category === 'object' ? post.category?.name : post.category || 'Uncategorized'}
                  </span>
                  <h3 className="text-lg md:text-xl font-semibold text-white mt-2 mb-2">{post.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 md:mb-4">{post.excerpt}</p>
                  <span className="text-gray-500 text-[10px] sm:text-xs">{formatDate(post.publishedDate)}</span>
                </motion.article>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

