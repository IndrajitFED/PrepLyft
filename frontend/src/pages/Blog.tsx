import React, { useState } from 'react'
import { Calendar, User, Clock, ArrowRight, BookOpen } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  readTime: string
  category: string
  image: string
  tags: string[]
}

const Blog: React.FC = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Mastering System Design Interviews: A Complete Guide',
      excerpt: 'System design interviews are crucial for senior engineering roles. Learn how to approach complex system design problems and impress your interviewers.',
      content: `
        <h2>Introduction to System Design Interviews</h2>
        <p>System design interviews are becoming increasingly important for software engineering roles, especially at senior levels. These interviews test your ability to design scalable, reliable, and efficient systems that can handle millions of users.</p>
        
        <h2>Key Principles</h2>
        <h3>1. Requirements Gathering</h3>
        <p>Always start by clarifying functional and non-functional requirements. Ask questions about:</p>
        <ul>
          <li>Expected traffic (read/write QPS)</li>
          <li>Storage requirements</li>
          <li>Latency requirements</li>
          <li>Consistency vs availability trade-offs</li>
        </ul>
        
        <h3>2. High-Level Design</h3>
        <p>Start with a high-level architecture diagram showing major components:</p>
        <ul>
          <li>Load balancers</li>
          <li>Application servers</li>
          <li>Databases (SQL/NoSQL)</li>
          <li>Caching layers</li>
          <li>CDN and static assets</li>
        </ul>
        
        <h3>3. Deep Dive into Components</h3>
        <p>For each component, discuss:</p>
        <ul>
          <li>Data models and schemas</li>
          <li>API design</li>
          <li>Scaling strategies</li>
          <li>Failure handling</li>
        </ul>
        
        <h3>4. Scaling and Optimization</h3>
        <p>Discuss how to scale the system:</p>
        <ul>
          <li>Horizontal vs vertical scaling</li>
          <li>Database sharding strategies</li>
          <li>Caching strategies</li>
          <li>Message queues for async processing</li>
        </ul>
        
        <h2>Common Patterns</h2>
        <p>Familiarize yourself with common design patterns:</p>
        <ul>
          <li><strong>Microservices Architecture:</strong> Breaking down monolithic applications into smaller, independent services</li>
          <li><strong>Event-Driven Architecture:</strong> Using events to communicate between services</li>
          <li><strong>Database Patterns:</strong> Master-slave, master-master, sharding, replication</li>
          <li><strong>Caching Strategies:</strong> Cache-aside, write-through, write-behind</li>
        </ul>
        
        <h2>Practice Tips</h2>
        <ol>
          <li>Practice drawing diagrams on whiteboards or paper</li>
          <li>Study real-world systems (Twitter, Uber, Instagram)</li>
          <li>Practice explaining your thought process out loud</li>
          <li>Time yourself - aim for 45-60 minutes per design</li>
          <li>Get feedback from experienced engineers</li>
        </ol>
        
        <h2>Conclusion</h2>
        <p>System design interviews require both technical knowledge and communication skills. Practice regularly, study real-world systems, and always think about scalability, reliability, and efficiency.</p>
      `,
      author: 'Rajesh Kumar',
      date: '2024-01-15',
      readTime: '12 min',
      category: 'System Design',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
      tags: ['System Design', 'Architecture', 'Scalability', 'Interviews']
    },
    {
      id: 2,
      title: 'Dynamic Programming Patterns Every Developer Should Know',
      excerpt: 'Master the most common dynamic programming patterns to ace coding interviews at top tech companies.',
      content: `
        <h2>What is Dynamic Programming?</h2>
        <p>Dynamic Programming (DP) is an optimization technique used to solve problems by breaking them down into simpler subproblems and storing the results to avoid redundant calculations.</p>
        
        <h2>Key DP Patterns</h2>
        
        <h3>1. Fibonacci Pattern</h3>
        <p>The classic example that demonstrates DP concepts:</p>
        <pre><code>// Bottom-up approach
function fibonacci(n) {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}</code></pre>
        
        <h3>2. 0/1 Knapsack Pattern</h3>
        <p>Given items with weights and values, maximize value within weight limit:</p>
        <ul>
          <li>Each item can be taken at most once</li>
          <li>State: dp[i][w] = max value using first i items with weight w</li>
          <li>Transition: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])</li>
        </ul>
        
        <h3>3. Longest Common Subsequence (LCS)</h3>
        <p>Find the longest subsequence common to two strings:</p>
        <pre><code>function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array(m+1).fill().map(() => Array(n+1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  return dp[m][n];
}</code></pre>
        
        <h3>4. Longest Increasing Subsequence (LIS)</h3>
        <p>Find the longest subsequence in which elements are strictly increasing:</p>
        <ul>
          <li>Can use O(n²) DP or O(n log n) binary search approach</li>
          <li>Common in interview problems</li>
        </ul>
        
        <h3>5. Edit Distance</h3>
        <p>Minimum operations to convert one string to another:</p>
        <ul>
          <li>Operations: insert, delete, replace</li>
          <li>Used in many real-world applications (spell checkers, DNA analysis)</li>
        </ul>
        
        <h3>6. Coin Change</h3>
        <p>Find minimum coins needed to make a target amount:</p>
        <ul>
          <li>Variations: minimum coins, number of ways</li>
          <li>Can be solved with 1D or 2D DP</li>
        </ul>
        
        <h2>DP Approaches</h2>
        <h3>Top-Down (Memoization)</h3>
        <ul>
          <li>Start with the problem and break it down</li>
          <li>Cache results of subproblems</li>
          <li>Often easier to think about</li>
        </ul>
        
        <h3>Bottom-Up (Tabulation)</h3>
        <ul>
          <li>Start with base cases and build up</li>
          <li>Fill DP table iteratively</li>
          <li>Often more space-efficient</li>
        </ul>
        
        <h2>Practice Problems</h2>
        <ol>
          <li>Climbing Stairs</li>
          <li>House Robber</li>
          <li>Coin Change</li>
          <li>Longest Palindromic Substring</li>
          <li>Decode Ways</li>
          <li>Word Break</li>
          <li>Unique Paths</li>
        </ol>
        
        <h2>Tips for DP Interviews</h2>
        <ol>
          <li>Identify if problem has overlapping subproblems</li>
          <li>Define state clearly</li>
          <li>Find recurrence relation</li>
          <li>Initialize base cases</li>
          <li>Think about space optimization</li>
          <li>Practice drawing DP tables</li>
        </ol>
        
        <h2>Conclusion</h2>
        <p>Dynamic Programming is a powerful technique for solving optimization problems. Master these patterns through consistent practice, and you'll be well-prepared for coding interviews.</p>
      `,
      author: 'Priya Sharma',
      date: '2024-01-10',
      readTime: '15 min',
      category: 'Data Structures & Algorithms',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      tags: ['Dynamic Programming', 'Algorithms', 'Coding Interviews', 'DSA']
    }
  ]

  const renderPostContent = (post: BlogPost) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
        <button
          onClick={() => setSelectedPost(null)}
          className="text-primary-600 hover:text-primary-700 mb-6 flex items-center"
        >
          <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
          Back to Blog
        </button>
        
        <div className="mb-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Blog+Image'
            }}
          />
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">{post.category}</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">{tag}</span>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center space-x-6 text-gray-600 mb-6">
            <div className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{post.readTime} read</span>
            </div>
          </div>
        </div>
        
        <div
          className="prose max-w-none blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {selectedPost ? (
          renderPostContent(selectedPost)
        ) : (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center mb-4">
                <BookOpen className="w-12 h-12 text-primary-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">Technical Blog</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Insights, tips, and best practices for acing technical interviews and advancing your career
              </p>
            </div>

            {/* Blog Posts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Blog+Image'
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-3 hover:text-primary-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPost(post)
                      }}
                      className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Read More
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-16 bg-white rounded-lg shadow-lg p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter and get the latest interview tips, technical insights, and career advice delivered to your inbox.
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Blog

