module.exports = {
  siteMetadata: {
    siteUrl: 'https://www.gliwickiklubstrzelecki.pl',
    defaultTitle: 'Gliwicki Klub Strzelecki',
    titleTemplate: '%s · GKS',
    defaultDescription: 'Pasjonaci strzelectwa',
    defaultImage: '/images/default-image-gks-range.jpg'
  },
  plugins: [
    'gatsby-plugin-image',
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Gliwicki Klub Strzelecki',
        short_name: 'GKS',
        start_url: '/',
        background_color: '#efefef',
        theme_color: '#3f51b5',
        display: 'standalone',
        icon: 'src/images/favicon-gks-black.png'
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://www.gliwickiklubstrzelecki.pl',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: './src/images/'
      },
      __key: 'images'
    },
    {
      resolve: 'gatsby-theme-material-ui',
      options: {
        webFontsConfig: {
          fonts: {
            google: [
              {
                family: 'Titillium Web',
                variants: ['300', '400', '500']
              }
            ]
          }
        }
      }
    }
  ]
};
