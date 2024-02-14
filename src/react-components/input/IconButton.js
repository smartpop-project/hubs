import React, { forwardRef, memo } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./IconButton.scss";
import textInputStyles from "./TextInput.scss";

export const IconButton = memo(
  forwardRef(({ className, as: ButtonComponent, compactSm, lg, children, download, ...rest }, ref) => {
    const buttonProps = ButtonComponent === "button" ? { type: "button" } : {};

    /**
     * belivvr custom
     * "download"가 true인 경우에는 a태그 클릭시 페이지 이동이 아닌 파일 다운로드가 되게 함
     */
    return download ? (
      <ButtonComponent
        className={classNames(
          styles.iconButton,
          textInputStyles.iconButton,
          { [styles.compactSm]: compactSm, [styles.lg]: lg },
          className
        )}
        {...buttonProps}
        {...rest}
        ref={ref}
        download
      >
        {children}
      </ButtonComponent>
    ) : (
      <ButtonComponent
        className={classNames(
          styles.iconButton,
          textInputStyles.iconButton,
          { [styles.compactSm]: compactSm, [styles.lg]: lg },
          className
        )}
        {...buttonProps}
        {...rest}
        ref={ref}
      >
        {children}
      </ButtonComponent>
    );
  })
);

IconButton.propTypes = {
  // compactSm makes the icon button shift to a vertical layout in the "sm" (mobile) breakpoint
  as: PropTypes.elementType,
  compactSm: PropTypes.bool,
  lg: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  download: PropTypes.bool
};

IconButton.defaultProps = {
  as: "button"
};

IconButton.displayName = "IconButton";
