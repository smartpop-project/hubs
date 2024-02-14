import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import styles from "./iframeSidebar.scss";

export function IframeSidebar({
  title,
  beforeTitle,
  afterTitle,
  children,
  contentClassName,
  className,
  disableOverflowScroll
}) {
  return (
    <div className={classNames(styles.sidebar, className)}>
      {(title || beforeTitle || afterTitle) && (
        <div className={styles.header}>
          <div className={styles.beforeTitle}>{beforeTitle}</div>
          <h5>{title}</h5>
        </div>
      )}
      <div className={classNames(styles.content, disableOverflowScroll ? "" : styles.overflowY, contentClassName)}>
        {children}
      </div>
    </div>
  );
}

IframeSidebar.propTypes = {
  title: PropTypes.node,
  beforeTitle: PropTypes.node,
  afterTitle: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  disableOverflowScroll: PropTypes.bool
};

IframeSidebar.defaultProps = {
  disableOverflowScroll: false
};
