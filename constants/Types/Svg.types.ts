import { ColorType } from '../Colors';

export type SvgBaseProps = {
    size?: number;
    className?: string;
};

export type ColoredSvgProps = SvgBaseProps & {
    color?: ColorType;
};
