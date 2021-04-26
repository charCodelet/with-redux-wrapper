import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import {
  BorderProps,
  ColorProps,
  FlexboxProps,
  GridProps,
  LayoutProps,
  PositionProps,
  SpaceProps,
  ShadowProps,
  TypographyProps,
  AlignSelfProps,
  OrderProps,
  MinWidthProps,
  compose,
  grid,
  space,
  color,
  border,
  shadow,
  layout,
  flexbox,
  width,
  position,
  minWidth,
  styleFn,
  TextAlignProps,
  FontWeightProps,
  fontWeight,
  textAlign
} from 'styled-system';
import cssFunc, { get, SystemStyleObject, Theme } from '@styled-system/css';
import shouldForwardProp from '@styled-system/should-forward-prop';

import { PolymorphicComponentProps } from './BaseTypes';

export interface ThemeProps {
  theme?: Theme;
}

export interface SxProps {
  sx?: SystemStyleObject;
}

export interface BaseProps {
  __css?: SystemStyleObject;
}

export interface VariantProps {
  variant?: string;
  tx?: string; // TODO: verify tx prop meaning / usage
}

// TODO: we could optionally make the above interfaces extend ThemeProps.  Open to cleaner code suggestions
export const sx: styleFn = ({ sx, theme }: SxProps & ThemeProps) =>
  cssFunc(sx)(theme);
export const base: styleFn = ({ __css, theme }: BaseProps & ThemeProps) =>
  cssFunc(__css)(theme);
export const variant: styleFn = ({
  theme,
  variant,
  tx = 'variants'
}: ThemeProps & VariantProps) => {
  return cssFunc(
    get(
      theme as object,
      tx + '.' + variant,
      get(
        theme as object,
        variant as any /* TODO: I'm not happy about this `any` cast*/
      )
    )
  )(theme);
};

export const StyledBox = styled('div', {
  shouldForwardProp
})(
  {
    boxSizing: 'border-box',
    margin: 0,
    minWidth: 0
  },
  props => props.css,
  base,
  variant,
  sx,
  compose(
    space,
    layout,
    shadow,
    flexbox,
    border,
    width,
    color,
    position,
    minWidth,
    fontWeight,
    textAlign
  )
);

export type BoxProps<
  C extends React.ElementType
> = PolymorphicComponentProps<C> &
  AlignSelfProps &
  BorderProps &
  ColorProps &
  FlexboxProps &
  LayoutProps &
  OrderProps &
  PositionProps &
  SpaceProps &
  ShadowProps &
  TypographyProps &
  SxProps &
  BaseProps &
  MinWidthProps &
  TextAlignProps &
  FontWeightProps &
  VariantProps;

export const Box = <C extends React.ElementType = 'div'>({
  children,
  ...props
}: BoxProps<C>) => {
  return <StyledBox {...props}>{children}</StyledBox>;
};

// TODO: to keep polymorphic components with statically types props, we have to wrap styled('div') as a box (above)
// In order to forwardRef, we need to use forwardRef (below), but this loses type safety / polymorhpic behavior.
// Major improvement would be allowing `forwardRef` and keeping the polymorphic intellisense / type safety
export const BoxForwardRef = forwardRef<any, BoxProps<any>>(
  <C extends React.ElementType = 'div'>(
    props: Omit<BoxProps<C>, 'color'>,
    ref: any
  ) => {
    return (
      <StyledBox {...props} ref={ref}>
        {props.children}
      </StyledBox>
    );
  }
);

export const Bare = styled('div')(sx);

export const StyledFlex = styled(StyledBox)(
  {
    display: 'flex'
  },
  flexbox
);
// TODO: to keep polymorphic components with statically types props, we have to wrap styled('div') as a Flex (above)
// In order to forwardRef, we need to use forwardRef (below), but this loses type safety / polymorhpic behavior.
// Major improvement would be allowing `forwardRef` and keeping the polymorphic intellisense / type safety.  Same issue as with Box
export const Flex = <C extends React.ElementType = 'div'>({
  children,
  ...props
}: BoxProps<C>) => {
  return <StyledFlex {...props}>{children}</StyledFlex>;
};

export const FlexForwardRef = forwardRef<any, BoxProps<any>>(
  <C extends React.ElementType = 'div'>(
    props: Omit<BoxProps<C>, 'color'>,
    ref: any
  ) => {
    return (
      <StyledFlex {...props} ref={ref}>
        {props.children}
      </StyledFlex>
    );
  }
);

type GridBoxProps = BoxProps<'div'> & GridProps;
const StyledGrid = styled(Box)(
  {
    display: 'grid'
  },
  grid
);
export const Grid = ({ children, ...props }: GridBoxProps) => {
  return <StyledGrid {...props}>{children}</StyledGrid>;
};

export default Box;
