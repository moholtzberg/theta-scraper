<script>
    // Define the list of integrations
    const integrations = [
      {
        name: 'QuickBooks',
        logo: 'https://static.cdnlogo.com/logos/q/8/quickbooks.svg',
        link: 'https://quickbooks.intuit.com/',
      },
      {
        name: 'UPS',
        logo: 'https://static.cdnlogo.com/logos/u/78/ups.svg',
        link: 'https://www.ups.com/',
      },
      {
        name: 'USPS',
        logo: 'https://static.cdnlogo.com/logos/u/79/usps-8211-united-states-postal-service.png',
        link: 'https://www.usps.com/',
      },
    //   {
    //     name: 'FedEx',
    //     logo: 'https://static.cdnlogo.com/logos/f/30/fedex-express.svg',
    //     link: 'https://www.fedex.com/',
    //   },
      {
        name: 'Slack',
        logo: 'https://static.cdnlogo.com/logos/s/40/slack-new.svg',
        link: 'https://slack.com/',
      },
      {
        name: 'Zapier',
        logo: 'https://static.cdnlogo.com/logos/z/75/zapier.svg',
        link: 'https://zapier.com/',
      },
      {
        name: 'Salesforce',
        logo: 'https://static.cdnlogo.com/logos/s/83/salesforce.svg',
        link: 'https://www.salesforce.com/',
      },
      // Add more integrations as needed
    ];
</script>
  
<section id="integrations" class="py-20 bg-gray-100">
    <div class="container mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">🔗 Integrations</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {#each integrations as integration}
          <a href={integration.link} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
            <img src={integration.logo} alt={integration.name} class="h-12 w-auto object-cover" />
          </a>
        {/each}
      </div>
    </div>
</section>
  
