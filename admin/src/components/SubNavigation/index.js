import React from 'react';
import { Connector } from '@strapi/icons';
import { Box } from '@strapi/design-system';
import {
  SubNav,
  SubNavHeader,
  SubNavSection,
  SubNavSections,
  SubNavLink,
} from '@strapi/design-system/v2';
import { NavLink } from 'react-router-dom';

export const SubNavigation = ({activeUrl}) => {
  const links = [ {
    id: 1,
    label : 'Setup Information',
    icon : Connector,
    to : '/plugins/@geeky-biz/strapi-plugin-elasticsearch/home',
  },
  {
    id: 2,
    label : 'Configure Collections',
    icon : Connector,
    to : '/plugins/@geeky-biz/strapi-plugin-elasticsearch/configure-collections',
  },
{
  id: 3,
  label : 'Indexing Run Logs',
  icon : Connector,
  to : '/plugins/@geeky-biz/strapi-plugin-elasticsearch/view-indexing-logs',
}];
  return (<Box style={{
        height: '100vh'
      }} background="neutral200">
            <SubNav ariaLabel="Settings sub nav">
              <SubNavHeader label="Strapi Elasticsearch" />
              <SubNavSections>
                <SubNavSection>
                  {links.map(link => link.icon && <SubNavLink 
                  as={NavLink} to={link.to} icon={link.icon} key={link.id} >
                      {link.label}
                  </SubNavLink>)}
                </SubNavSection>
              </SubNavSections>
            </SubNav>
        </Box>);
}