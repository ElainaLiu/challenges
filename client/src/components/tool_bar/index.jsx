import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

export default function ToolBar({ iconElementLeft, iconElementRight, title }) {
  return (
    <div className="mdc-toolbar mdc-toolbar--fixed challenges-toolbar">
      {iconElementLeft &&
        <section className="mdc-toolbar__section mdc-toolbar__section--align-start">
          {iconElementLeft}
        </section>}
      <h2 className="mdc-toolbar__title">{title}</h2>
      {iconElementRight &&
        <section className="mdc-toolbar__section mdc-toolbar__section--align-end">
          {iconElementRight}
        </section>}
    </div>
  );
}

ToolBar.propTypes = {
  iconElementLeft: PropTypes.node,
  iconElementRight: PropTypes.node,
  title: PropTypes.string
};
