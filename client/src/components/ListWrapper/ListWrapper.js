import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { NavLink } from 'react-router-dom';

import { timeConverter, titleConverter } from '../../lib';
import { blindAddress } from '../../config';

import './ListWrapper.scss';


const linkDistributor = (
  centerList,
  datum,
  lang,
  linkTo,
  rightList,
  spacing,
  titles,
) => titles.map((title, i) => {
  let content = null;
  linkTo.forEach((link) => {
    const seperator = link.split('/');
    if (title.toLowerCase().includes(seperator[1])) {
      content = (
        <NavLink
          to={`/${lang}/${seperator[0]}/${datum[title]}`}
          style={{ width: `${spacing[i]}%` }}
          className={cx({
            center: centerList.includes(title) && !rightList.includes(title),
            right: rightList.includes(title),
          })}
          key={title}
        >
          {
            (title === 'To' && datum[title] === blindAddress) ? '-' : datum[title]
          }
        </NavLink>
      );
    }
  });

  if (!content) {
    const d = Object.assign({}, datum, {
      'Time Stamp': datum['Time Stamp'] && timeConverter(datum['Time Stamp']),
    });
    content = (
      <span
        style={{ width: `${spacing[i]}%` }}
        className={cx({
          center: centerList.includes(title) && !rightList.includes(title),
          right: rightList.includes(title),
        })}
        key={title}
      >
        {d[title]}
      </span>
    );
  }
  return content;
});

const ListWrapper = ({
  centerList,
  data,
  lang,
  linkTo,
  rightList,
  spacing,
  titles,
}) => (
  <div className="listWrapper">
    <div className="listWrapperTitles">
      {
        titles.map((title, i) => (
          <span
            style={{ width: `${spacing[i]}%` }}
            className={cx({ center: centerList.includes(title) })}
            key={title}
          >
            <FormattedMessage id={titleConverter(title)} />
          </span>
        ))
      }
    </div>
    <div className="listWrapperContents">
      {
        data.map((datum, i) => (
          // eslint-disable-next-line
          <div className={cx('listWrapperContentRow', { special: (datum.Ranking >= 1 && datum.Ranking <= 21) })} key={i}>
            { linkDistributor(centerList, datum, lang, linkTo, rightList, spacing, titles) }
          </div>
        ))
      }
    </div>
  </div>
);

ListWrapper.propTypes = {
  centerList: PropTypes.array,
  data: PropTypes.array.isRequired,
  linkTo: PropTypes.array,
  rightList: PropTypes.array,
  spacing: PropTypes.array.isRequired,
  titles: PropTypes.array.isRequired,
};

ListWrapper.defaultProps = {
  centerList: [],
  linkTo: [],
  rightList: [],
};

export default ListWrapper;
