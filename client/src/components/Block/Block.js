import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DetailWrapper from '../DetailWrapper';
import { blockMapper } from '../../lib';
import { BlockchainActions, WidgetActions as w } from '../../redux/actionCreators';


class Block extends Component {
  constructor(props) {
    super(props);
    this.callBlock = this.callBlock.bind(this);
  }

  componentDidMount() {
    this.callBlock();
  }

  shouldComponentUpdate(nextProps) {
    const {
      block,
      hash,
      height,
      language,
    } = this.props;
    if (hash !== nextProps.hash || height !== nextProps.height) {
      this.callBlock(nextProps);
      return true;
    }
    if (block !== nextProps.block) return true;
    if (language !== nextProps.language) return true;
    return false;
  }

  callBlock(nextProps) {
    let hash = null;
    let height = null;
    if (nextProps) ({ hash, height } = nextProps);
    else ({ hash, height } = this.props);

    let subject = null;
    if (height) subject = height;
    if (hash) subject = hash;
    if (subject === null) throw new Error('Invalid block info');

    w.loader(
      BlockchainActions
        .getBlock(subject)
        .then((bl) => {
          BlockchainActions.setTxsFromBlock(bl.block.data.transactions);
        }),
    );
  }

  render() {
    const { block, language, mode } = this.props;
    return block && (
      <DetailWrapper
        data={blockMapper(block)}
        lang={language}
        mode={mode}
        type="block"
      />
    );
  }
}

Block.propTypes = {
  block: PropTypes.object,
  hash: PropTypes.string,
  height: PropTypes.string,
  language: PropTypes.string.isRequired,
  mode: PropTypes.number.isRequired,
};

Block.defaultProps = {
  block: null,
  hash: null,
  height: null,
};

export default Block;
