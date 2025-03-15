import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      links={[
        {
          key: 'Intelytic',
          title: 'Intelytic',
          href: 'https://intelytictech.com/',
          blankTarget: true,
        },
        // {
        //   key: 'github',
        //   title: <GithubOutlined />,
        //   href: 'https://github.com/ant-design/ant-design-pro',
        //   blankTarget: true,
        // },
        // {
        //   key: 'Intelytic',
        //   title: 'Intelytic',
        //   href: 'https://ant.design',
        //   blankTarget: true,
        // },
      ]}
    />
  );
};

export default Footer;
