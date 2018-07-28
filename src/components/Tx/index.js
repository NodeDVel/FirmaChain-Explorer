import { connect } from 'react-redux';

import Tx from './Tx';


const mapStateToProps = ({ blockchain, global }) => ({
  tx: blockchain.tx,

  language: global.language,
});

export default connect(mapStateToProps)(Tx);
