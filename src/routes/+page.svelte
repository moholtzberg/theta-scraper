<script>
  import Modal from '$lib/components/Modal.svelte';
  import VideosSection from '$lib/components/VideosSection.svelte';
  import ScreenshotsSection from '$lib/components/ScreenshotsSection.svelte';
  import IntegrationsSection from '$lib/components/IntegrationsSection.svelte'; 
  import FeaturesSection from '$lib/components/FeaturesSection.svelte';

  let isModalOpen = false;

  const videos = [
    { id: 'dQw4w9WgXcQ', title: 'Demo Video 1' },
    { id: 'eY52Zsg-KVI', title: 'Demo Video 2' },
    { id: 'kxopViU98Xo', title: 'Demo Video 3' },
  ];

  const screenshots = [
    { src: '/screenshots/Screenshot1.png', alt: 'Dashboard Overview', description: 'Dashboard Overview' },
    { src: '/screenshots/Screenshot2.png', alt: 'Inventory Management', description: 'Inventory Management' },
    { src: '/screenshots/Screenshot3.png', alt: 'Analytics Dashboard', description: 'Analytics Dashboard' },
    { src: '/screenshots/Screenshot4.png', alt: 'User Settings', description: 'User Settings' },
    { src: '/screenshots/Screenshot5.png', alt: 'Service Tech Routing', description: 'Service Tech Routing' },
    { src: '/screenshots/Screenshot6.png', alt: 'Shipping Integration', description: 'Shipping Integration' },
  ];
</script>

<!-- Home Section -->
<section id="home" class="bg-slate-800 text-white py-24">
  <div class="container mx-auto px-4 text-center">
    <h1 class="text-5xl font-bold mb-6">🚀 Revolutionize Your Office Equipment Dealership</h1>
    <p class="text-xl mb-8 max-w-2xl mx-auto">DealerEdge – The Modern, Web-Based Management System Designed for Today's Dealers</p>
    <button
      class="bg-white text-slate-800 px-6 py-3 rounded-md text-lg font-semibold hover:bg-gray-200 transition-colors"
      on:click={() => isModalOpen = true}
    >
      Get Started
    </button>
  </div>
</section>

<!-- Features Section -->
<section id="features" class="py-20 bg-gray-50">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">✨ Features</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      <!-- Feature 1 -->
      <div class="flex flex-col items-center text-center">
        <span class="text-5xl text-slate-800">🔒</span>
        <h3 class="text-2xl font-semibold mt-4 text-gray-800">Modern Security</h3>
        <p class="mt-2 text-gray-600">State-of-the-art security practices including data encryption, regular updates, and user access controls to keep your data safe.</p>
      </div>
      <!-- Feature 2 -->
      <div class="flex flex-col items-center text-center">
        <span class="text-5xl text-slate-800">🤖</span>
        <h3 class="text-2xl font-semibold mt-4 text-gray-800">AI-Powered</h3>
        <p class="mt-2 text-gray-600">Leverage AI for predictive analytics, automated customer service responses, and smarter decision-making.</p>
      </div>
      <!-- Feature 3 -->
      <div class="flex flex-col items-center text-center">
        <span class="text-5xl text-slate-800">🚚</span>
        <h3 class="text-2xl font-semibold mt-4 text-gray-800">Integrated Shipping</h3>
        <p class="mt-2 text-gray-600">Real-time shipping updates, automated label generation, and seamless integration with major carriers.</p>
      </div>
      <!-- Feature 4 -->
      <div class="flex flex-col items-center text-center">
        <span class="text-5xl text-slate-800">📦</span>
        <h3 class="text-2xl font-semibold mt-4 text-gray-800">Smart Inventory</h3>
        <p class="mt-2 text-gray-600">Automated stock tracking with low-stock alerts and integration with QuickBooks to keep your accountant happy.</p>
      </div>
      <!-- Feature 5 -->
      <div class="flex flex-col items-center text-center">
        <span class="text-5xl text-slate-800">🛠️</span>
        <h3 class="text-2xl font-semibold mt-4 text-gray-800">Service Tech Routing</h3>
        <p class="mt-2 text-gray-600">Optimized technician schedules and real-time tracking to ensure efficient service operations.</p>
      </div>
      <!-- Feature 6 -->
      <div class="flex flex-col items-center text-center">
        <span class="text-5xl text-slate-800">📈</span>
        <h3 class="text-2xl font-semibold mt-4 text-gray-800">Analytics & Reporting</h3>
        <p class="mt-2 text-gray-600">Detailed analytics and customizable reports to help you make informed business decisions.</p>
      </div>
    </div>
  </div>
</section>

<FeaturesSection />


<!-- Videos Section -->
<VideosSection {videos} />

<!-- Testimonials Section -->
<section id="testimonials" class="py-20 bg-gray-800 text-white">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-bold text-center mb-12">💬 What Dealers Are Saying</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
      <!-- Testimonial 1 -->
      <div class="bg-white text-slate-800 p-8 rounded-lg shadow-lg">
        <p class="text-gray-700 italic">"DealerEdge has transformed our dealership operations. The AI features and QuickBooks integration have significantly increased our efficiency and profitability."</p>
        <h4 class="mt-6 font-semibold text-gray-800">- Tina Shekli, OfficePro Dealers</h4>
      </div>
      <!-- Testimonial 2 -->
      <div class="bg-white text-slate-800 p-8 rounded-lg shadow-lg">
        <p class="text-gray-700 italic">"The modern security practices give us peace of mind, and the smart inventory management keeps our stock levels optimal. Highly recommend DealerEdge!"</p>
        <h4 class="mt-6 font-semibold text-gray-800">- Ben Elef, EquipMart</h4>
      </div>
      <!-- Add more testimonials as needed -->
    </div>
  </div>
</section>

<!-- Screenshots Section -->
<!-- <ScreenshotsSection {screenshots} /> -->

<!-- Integrations Section -->
<IntegrationsSection />

<!-- Pricing Section -->
<section id="pricing" class="py-20 bg-gray-800">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-bold text-center mb-12 text-gray-50">💰 Pricing</h2>
    <div class="flex flex-col md:flex-row justify-center items-center gap-12">
      <!-- Basic Plan -->
      <div class="bg-white text-slate-800 rounded-lg shadow-md w-full max-w-md p-8 flex flex-col">
        <h3 class="text-2xl font-semibold mb-4 text-gray-800">Basic</h3>
        <p class="text-4xl font-extrabold mb-6">$99<span class="text-xl">/ month</span></p>
        <ul class="flex-1 mb-6 space-y-3">
          <li class="flex items-center"><span class="mr-2 text-green-500">📦</span> Basic Inventory Management</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">📊</span> QuickBooks Integration</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">✉️</span> Email Support</li>
        </ul>
        <button
          class="bg-slate-800 text-white px-4 py-3 rounded-md hover:bg-slate-700 transition-colors"
          on:click={() => isModalOpen = true}
        >
          Choose Basic
        </button>
      </div>
      <!-- Professional Plan -->
      <div class="bg-white text-slate-800 rounded-lg shadow-md w-full max-w-md p-8 flex flex-col">
        <h3 class="text-2xl font-semibold mb-4 text-gray-800">Professional</h3>
        <p class="text-4xl font-extrabold mb-6">$139<span class="text-xl">/ month</span></p>
        <ul class="flex-1 mb-6 space-y-3">
          <li class="flex items-center"><span class="mr-2 text-green-500">✅</span> All Basic Features</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">🤖</span> AI-Powered Analytics</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">🚚</span> Integrated Shipping</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">🔝</span> Priority Support</li>
        </ul>
        <button
          class="bg-slate-800 text-white px-4 py-3 rounded-md hover:bg-slate-700 transition-colors"
          on:click={() => isModalOpen = true}
        >
          Choose Professional
        </button>
      </div>
      <!-- Enterprise Plan -->
      <div class="bg-white text-slate-800 rounded-lg shadow-md w-full max-w-md p-8 flex flex-col">
        <h3 class="text-2xl font-semibold mb-4 text-gray-800">Enterprise</h3>
        <p class="text-4xl font-extrabold mb-6">$199<span class="text-xl">/ month</span></p>
        <ul class="flex-1 mb-6 space-y-3">
          <li class="flex items-center"><span class="mr-2 text-green-500">🚀</span> All Professional Features</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">⚙️</span> Customizable Dashboards</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">🔐</span> Advanced Security</li>
          <li class="flex items-center"><span class="mr-2 text-green-500">📞</span> 24/7 Support</li>
        </ul>
        <button
          class="bg-slate-800 text-white px-4 py-3 rounded-md hover:bg-slate-700 transition-colors"
          on:click={() => isModalOpen = true}
        >
          Choose Enterprise
        </button>
      </div>
    </div>
    <p class="text-center mt-8 text-gray-600">* Free 14-day trial available.</p>
  </div>
</section>

<!-- Comparison Chart Component -->
<!-- <section id="comparison" class="py-24 bg-gray-100">
  <div class="container mx-auto px-6">
    <h2 class="text-5xl font-extrabold text-center mb-16 text-gray-800">📊 Why Choose DealerEdge Over e-Automate</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white rounded-lg shadow-md">
        <thead>
          <tr>
            <th class="py-4 px-6 bg-gray-200 text-left text-sm font-semibold text-gray-700">Feature</th>
            <th class="py-4 px-6 bg-gray-200 text-start text-sm font-semibold text-gray-700">e-Automate</th>
            <th class="py-4 px-6 bg-gray-200 text-start text-sm font-semibold text-gray-700">DealerEdge</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="py-4 px-6 text-gray-700">Automated Purchasing</td>
            <td class="py-4 px-6 text-start text-gray-700">❌ Manual Process</td>
            <td class="py-4 px-6 text-start text-green-500">✅ Automatic Purchase from Cheapest Vendor</td>
          </tr>
          <tr class="border-b bg-gray-50">
            <td class="py-4 px-6 text-gray-700">Service Contract Billing</td>
            <td class="py-4 px-6 text-start text-gray-700">❌ Manual Billing</td>
            <td class="py-4 px-6 text-start text-green-500">✅ Automatic Billing</td>
          </tr>
          <tr class="border-b">
            <td class="py-4 px-6 text-gray-700">User Interface</td>
            <td class="py-4 px-6 text-start text-gray-700">❌ Outdated & Clunky</td>
            <td class="py-4 px-6 text-start text-green-500">✅ Modern & Intuitive</td>
          </tr>
          <tr class="border-b bg-gray-50">
            <td class="py-4 px-6 text-gray-700">Omnichannel Communications</td>
            <td class="py-4 px-6 text-start text-gray-700">❌ Limited Channels</td>
            <td class="py-4 px-6 text-start text-green-500">✅ Multiple Channels Integrated</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-12 text-center">
      <button
        class="bg-slate-800 text-white px-6 py-3 rounded-md hover:bg-slate-700 transition-colors"
        on:click={() => {
          isModalOpen = true
          }
        }
      >
        Make the Switch Today
      </button>
    </div>
  </div>
</section>
-->
<!-- About Us Section -->
<section id="about" class="py-20 bg-white">
  <div class="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
    <div class="lg:w-2/3">
      <h2 class="text-4xl font-bold mb-6 text-gray-800">🏢 About Us</h2>
      <h3 class="text-2xl font-semibold mb-4 text-gray-700">Our Mission</h3>
      <p class="text-gray-600 mb-6">At DealerEdge, our mission is to empower office equipment dealers with a modern, efficient, and secure management system that enhances profitability and streamlines operations.</p>
      <h3 class="text-2xl font-semibold mb-4 text-gray-700">Why Choose DealerEdge</h3>
      <p class="text-gray-600">Unlike outdated systems, DealerEdge is built with the latest technology, ensuring ease of use, robust security, and seamless integrations that cater specifically to the needs of today's dealers.</p>
    </div>
    <div class="lg:w-1/3 mt-8 lg:mt-0">
      <img src="about-us-2.jpg" alt="About DealerEdge" class="rounded-lg shadow-lg w-full h-auto object-cover">
    </div>
  </div>
</section>

<!-- Contact Us Section -->
<section id="contact" class="py-20 bg-gray-800 text-white">
  <div class="container mx-auto px-4">
    <h2 class="text-4xl font-bold text-center mb-12">📞 Contact Us</h2>
    <div class="flex flex-col lg:flex-row gap-12">
      <!-- Contact Form -->
      <div class="lg:w-1/2">
        <form on:submit|preventDefault={() => isModalOpen = true} class="space-y-6">
          <div>
            <label for="name" class="block text-white mb-2">Name*</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              required
              class="w-full p-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label for="email" class="block text-white mb-2">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              required
              class="w-full p-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
          <div>
            <label for="message" class="block text-white mb-2">Message*</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Your message..."
              required
              class="w-full p-4 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-slate-400"
            ></textarea>
          </div>
          <button
            type="submit"
            class="w-full bg-slate-800 text-white px-6 py-3 rounded-md hover:bg-slate-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
      <!-- Contact Information -->
      <div class="lg:w-1/2">
        <!-- <h3 class="text-2xl font-semibold mb-4">📍 Get in Touch</h3> -->
        <p class="flex items-center mb-3"><span class="mr-3">📍</span> 4760 NW 65th Ave,<br/> Suite 200, <br/>Fort Lauderdale, FL 33319</p>
        <!-- <p class="flex items-center mb-3"><span class="mr-3">📞</span> (347) 456-7890</p> -->
        <p class="flex items-center"><span class="mr-3">✉️</span> support@dealeredge.com</p>
      </div>
    </div>
  </div>
</section>

<!-- Footer -->
<footer class="bg-gray-800 text-white py-8">
  <div class="container mx-auto px-4 text-center">
    <p class="">&copy; 2024 DealerEdge. All rights reserved.</p>
    <div class="mt-4 flex justify-center space-x-6">
      <a href="#" class="hover:text-gray-400 transition-colors">Privacy Policy</a>
      <a href="#" class="hover:text-gray-400 transition-colors">Terms of Service</a>
      <a href="#" class="hover:text-gray-400 transition-colors">Sitemap</a>
    </div>
    <div class="mt-4 flex justify-center space-x-6">
      <!-- Social Media Links with Emojis -->
      <a href="#" class="text-2xl hover:text-gray-400 transition-colors" aria-label="LinkedIn">🔗</a>
      <a href="#" class="text-2xl hover:text-gray-400 transition-colors" aria-label="Twitter">🐦</a>
      <a href="#" class="text-2xl hover:text-gray-400 transition-colors" aria-label="Facebook">💼</a>
      <a href="#" class="text-2xl hover:text-gray-400 transition-colors" aria-label="Instagram">📸</a>
    </div>
  </div>
</footer>

<!-- Modal Component -->
<Modal isOpen={isModalOpen} on:close={() => isModalOpen = false} />