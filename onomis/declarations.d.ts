declare module "*.svg" {
  import React from "react";
  const Component: React.FC<{
    width?: number | string;
    height?: number | string;
    [key: string]: any;
  }>;
  export default Component;
}