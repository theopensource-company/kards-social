import { ColorType } from './Colors';

export type SvgBaseProps = {
    size?: number;
}

export type ColoredSvgProps = SvgBaseProps & {
    color?: ColorType;
}