

// Block types you support
export type BlockType =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'img'
  | 'ul'
  | 'youtube'
  | 'button'
  | 'link'
  | 'video'
  | 'rich-text'
  | 'embed'
  | 'postAccordion'; // custom block added

// Image type for image blocks
export type ImageType = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

// What a single dropped block looks like
export type DroppedItem = {
  id: string;
  type: BlockType;
  content: string;
  image?: ImageType;
  button?: {
    url: string;
    isExternal: boolean;
  };
  format?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  containerType?: string;
  listType?: 'bullet' | 'numbered';
  link?: {
    url: string;
    isExternal: boolean;
  };
  children?: DroppedItem[]; // For things like accordions
};

// Block config object interface
