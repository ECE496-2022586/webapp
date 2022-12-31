import React from 'react';

function Box({
    children,
    backgroundColor,
    border,
    borderRadius,
    color,
    overflow,
    fontFamily,
    fontSize,
    fontWeight,
    minHeight,
    marginLeft,
    marginTop,
    marginBottom,
    padding,
    width,
    textAlign,
    style,
    ...props
  }) {
    return (
      <div
        {...props}
        style={{
          border,
          backgroundColor,
          borderRadius,
          color,
          fontFamily,
          fontSize,
          fontWeight,
          overflow,
          minHeight,
          marginLeft,
          marginTop,
          marginBottom,
          padding,
          width,
          textAlign,
          ...style,
        }}
      >
        {children}
      </div>
    )
}

export default Box;
