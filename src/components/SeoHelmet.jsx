import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle
        titleTemplate
        defaultDescription
        siteUrl
        defaultImage
      }
    }
  }
`;

function SEO({ title, noTitleTemplate, description, image, article }) {
  const { pathname } = useLocation();
  const { site } = useStaticQuery(query);
  const {
    defaultTitle,
    titleTemplate,
    defaultDescription,
    siteUrl,
    defaultImage
  } = site.siteMetadata;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}/${pathname}`
  };

  const titleTemplateToUse = noTitleTemplate ? null : titleTemplate;

  return (
    <Helmet
      title={seo.title}
      titleTemplate={titleTemplateToUse}
      htmlAttributes={{ lang: 'pl' }}
    >
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      {seo.url && <meta property="og:url" content={seo.url} />}
      {(article ? true : null) && <meta property="og:type" content="article" />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && (
        <meta property="og:description" content={seo.description} />
      )}
      {seo.image && <meta property="og:image" content={seo.image} />}
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  noTitleTemplate: PropTypes.bool,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.bool
};

SEO.defaultProps = {
  title: null,
  noTitleTemplate: false,
  description: null,
  image: null,
  article: false
};

export default SEO;
