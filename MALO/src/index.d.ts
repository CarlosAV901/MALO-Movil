declare module '*.svg' {
    import React from 'react';
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}

declare module '@img/*.png' {
    const content: any;
    export default content;
}

declare module '@img/*.jpg' {
    const content: any;
    export default content;
}
