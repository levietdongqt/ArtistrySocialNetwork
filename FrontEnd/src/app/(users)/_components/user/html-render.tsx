import React from 'react';

interface HtmlRendererProps {
  htmlString: string;
}

const HtmlRenderer: React.FC<HtmlRendererProps> = ({ htmlString }) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlString }}
    />
  );
};

export default HtmlRenderer;