declare module "react-plotly.js" {
  import * as React from "react";
  
  export interface PlotProps {
    data: any[];
    layout: any;
    config?: any;
    onInitialized?: (figure: any, graphDiv: any) => void;
    onUpdate?: (figure: any, graphDiv: any) => void;
    onPurge?: (figure: any, graphDiv: any) => void;
    onError?: (err: any) => void;
    useResizeHandler?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }
  
  export default class Plot extends React.Component<PlotProps> {}
}
