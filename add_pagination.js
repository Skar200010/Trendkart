const fs = require('fs');
let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Add pagination state after sortBy
content = content.replace(
  "const [sortBy, setSortBy] = useState('newest');",
  "const [sortBy, setSortBy] = useState('newest');\n  const [currentPage, setCurrentPage] = useState(1);\n  const itemsPerPage = 20;"
);

// 2. Add pagination logic after filteredAndSortedProducts
const oldLogic = `return result;
  }, [products, searchQuery, categoryFilter, brandFilter, sortBy]);

  if (!user) {`;
const newLogic = `return result;
  }, [products, searchQuery, categoryFilter, brandFilter, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, brandFilter, sortBy]);

  if (!user) {`;
content = content.replace(oldLogic, newLogic);

// 3. Replace filteredAndSortedProducts with paginatedProducts in the grid
content = content.replace(
  `{filteredAndSortedProducts.map((product, index) => (`,
  `{paginatedProducts.map((product, index) => (`
);

// 4. Add pagination controls after the grid - find the correct location
// We need to add it before the closing of the outer div that contains the grid
const oldEnd = `                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (`;

const newEnd = `                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <p className="text-sm text-text-secondary">
                        Showing {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} products
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="p-2 rounded-lg bg-background border border-text-secondary/20 text-text-secondary hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <span className="text-sm text-text-secondary">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="p-2 rounded-lg bg-background border border-text-secondary/20 text-text-secondary hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (`;

content = content.replace(oldEnd, newEnd);

fs.writeFileSync('src/app/admin/page.tsx', content);
console.log('Done');
